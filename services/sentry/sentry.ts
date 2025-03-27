import * as sentry from "@sentry/node";
import { createLogger } from "../logger";
import { SENTRY_DSN } from "./consts";

const logger = createLogger("sentry");
logger.info(`Use DSN: ${SENTRY_DSN}`);

sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
});

export default sentry;
