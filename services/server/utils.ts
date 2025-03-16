import { tables } from "consts/tables";
import {
  ALL_CURRENCIES,
  ALL_LANGUAGES,
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  DEFAULT_LANGUAGE,
} from "core-kit/consts/locale";
import { createLogger } from "core-kit/services/logger/utils";
import { mysql } from "core-kit/services/mysql";
import {
  DataError,
  NotFoundError,
  PenTestingError,
  TooManyRequestsError,
  UnauthorizedError,
} from "core-kit/types/errors";
import { toInstance, toModel, toPlain } from "core-kit/utils/models";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import assign from "lodash/assign";
import { uuid as uuidv4 } from "uuidv4";
import { JWT_SECRET } from "../../../consts/core";
import { User } from "../../../models/user";
import { Injector } from "../../../types/injector";
import { Currencies } from "../../enums/currencies";
import { Languages } from "../../enums/languages";
import { NO_CACHE_HEADERS } from "./consts";

const USER_TOKEN_HEADER = "user-token";
const CF_COUNTRY_HEADER = "cf-ipcountry";
const COUNTRY_HEADER = "country";
const CURRENCY_HEADER = "currency";
const LANGUAGE_QUERY_PARAM = "language";
const LANGUAGE_COOKIE = "language";
const LANGUAGE_HEADER = "language";
const ACCEPT_LANGUAGE_HEADER = "accept-language";

const logger = createLogger("http-handler");

export type ApiHandler = (
  injector: Injector
) => (
  req: Request,
  res?: Response
) => void | Promise<void | string | number | object>;

export const handle =
  (handler: ApiHandler) => async (req: Request, res: Response) => {
    const injector: Injector = {
      country: DEFAULT_COUNTRY,
      currency: DEFAULT_CURRENCY,
      language: DEFAULT_LANGUAGE,
    };

    logger.debug(`Process ${req.path}`);

    {
      const country: string | null = (() => {
        const header =
          req.headers[COUNTRY_HEADER] || req.headers[CF_COUNTRY_HEADER];
        if (!!header) {
          return header as string;
        }
        return null;
      })();
      if (!!country) {
        assign(injector, { country });
      }
    }

    {
      const currency = (() => {
        const header = req.headers[CURRENCY_HEADER] as Currencies;
        if (!!header && ALL_CURRENCIES.includes(header)) {
          return header;
        }
        return null;
      })();
      if (!!currency) {
        assign(injector, { currency });
      }
    }

    {
      const language = (() => {
        const param = req.query[LANGUAGE_QUERY_PARAM];
        if (!!param) {
          return param as string;
        }

        {
          const header = req.headers[LANGUAGE_HEADER] as Languages;
          if (!!header && ALL_LANGUAGES.includes(header)) {
            return header;
          }
        }

        const cookie = req.cookies[LANGUAGE_COOKIE];
        if (!!cookie && ALL_LANGUAGES.includes(cookie)) {
          return cookie;
        }

        {
          const header = req.headers[ACCEPT_LANGUAGE_HEADER]?.split(
            ","
          )[0] as Languages;
          if (!!header && ALL_LANGUAGES.includes(header)) {
            return header;
          }
          return null;
        }
      })();
      if (!!language) {
        assign(injector, { language });
      }
    }

    {
      const header = req.headers[USER_TOKEN_HEADER];
      if (!!header) {
        const token = header as string;
        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          const { email } = toInstance(decoded as Object, User);

          assign(injector, {
            currentUser: await (async () => {
              const found = await mysql
                .from(tables.users)
                .select(["id", "name", "email", "registered_at"])
                .where({ email })
                .first();
              if (!!found) {
                return toModel(found, User);
              }

              const user = new User({
                id: uuidv4(),
                registeredAt: new Date(),
                email,
              });
              await mysql.from(tables.users).insert(toPlain(user));
              return user;
            })(),
          });
        } catch (err) {
          logger.error(err);
          res.status(401).send("Wrong user token");
          return;
        }
      }
    }

    try {
      const answer = await handler(injector)(req, res);
      if (answer !== undefined) {
        logger.debug("Send answer");
        res.set(NO_CACHE_HEADERS);
        !!answer ? res.status(200).send(answer) : res.status(204).send();
      } else {
        res.end();
      }
    } catch (e) {
      if (e instanceof DataError) {
        res.status(400).send(e.message);
      } else if (e instanceof UnauthorizedError) {
        res.status(401).send(e.message);
      } else if (e instanceof NotFoundError) {
        res.status(404).send(e.message);
      } else if (e instanceof TooManyRequestsError) {
        res.status(429).send(e.message);
      } else if (e instanceof PenTestingError) {
        logger.error("Pen testing detected");
        res.status(200).redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      } else {
        logger.error(e);
        res
          .status(500)
          .send("SERVICE_OFFLINE|Our service temporarily unavailable");
      }
    }
  };

export function checkLogged(user: User) {
  if (!user) {
    throw new DataError("You aren't logged");
  }
}

// TODO: short and improve it
export function stringifyParams(obj: Object) {
  let params = [];
  Object.keys(obj).forEach((key) => {
    const isObject = typeof obj[key] === "object";
    const isArray = isObject && obj[key]?.length >= 0;
    if (!isObject) {
      params.push(`${key}=${obj[key]}`);
    }

    if (isObject && isArray) {
      obj[key].forEach((element) => {
        params.push(`${key}=${encodeURIComponent(element)}`);
      });
    }
  });

  return params.join("&");
}
