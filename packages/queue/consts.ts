import env from "core-kit/env";

export const BULL_REDIS_HOST = env["BULL_REDIS_HOST"] || "redis";
export const BULL_REDIS_PORT =
  (() => {
    const port = process.env["BULL_REDIS_PORT"];
    if (!!port) {
      return parseInt(port);
    }
    return 0;
  })() || 6379;
export const BULL_REDIS_DB =
  (() => {
    const port = process.env["BULL_REDIS_DB"];
    if (!!port) {
      return parseInt(port);
    }
    return 0;
  })() || 5;
