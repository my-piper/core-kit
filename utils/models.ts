import { instanceToPlain, plainToInstance } from "class-transformer";
import * as validator from "class-validator";
import isEmpty from "lodash/isEmpty";
import merge from "lodash/merge";
import { DataError, NotFoundError } from "../types/errors";

export async function validate(obj: Object) {
  const errors = await validator.validate(obj);
  if (errors.length > 0) {
    throw new DataError(
      errors.map((e) => Object.values(e.constraints).join(", ")).join("|")
    );
  }
}

export function toPlain<T>(object: T): Object {
  return instanceToPlain(object, {
    excludeExtraneousValues: true,
    exposeUnsetFields: false,
  });
}

export function toInstance<T>(object: object, cls: new () => T): T {
  return plainToInstance(cls, object, {
    excludeExtraneousValues: true,
    exposeUnsetFields: false,
  });
}

export function mapTo<T>(object: object, cls: new () => T): T {
  return plainToInstance(cls, object, {
    excludeExtraneousValues: true,
    exposeUnsetFields: false,
  });
}
export function toModels<T>(arr: Object[], model: new () => T): T[] {
  return arr.map((o) => toInstance(nestedKeys(o) || {}, model));
}

export function toModel<T>(obj: Object | null, model: new () => T): T {
  if (!obj) {
    throw new NotFoundError();
  }

  return toInstance(nestedKeys(obj) || {}, model);
}

export function nestedKeys(obj: Object): Object | null {
  const nested = (path: string, value: any) => {
    if (value === null) {
      return null;
    }
    const chunks = path.split(".");
    if (chunks.length <= 1) {
      return { [path]: value };
    }
    const key = chunks.shift();
    const merged = {};
    merge(merged, nested(chunks.join("."), value));
    return { [key]: merged };
  };

  const merged = {};
  for (const key of Object.keys(obj)) {
    const value = nested(key, obj[key]);
    if (value !== null) {
      merge(merged, value);
    }
  }
  return !isEmpty(merged) ? merged : null;
}
