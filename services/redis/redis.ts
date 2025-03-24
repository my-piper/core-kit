import { createClient } from "@redis/client";
import { createLogger } from "../logger";
import { REDIS_PASSWORD, REDIS_URL } from "./consts";

const logger = createLogger("redis");

export const redis = createClient({ url: REDIS_URL, password: REDIS_PASSWORD });
logger.error(`Connect to redis ${REDIS_URL}`);
await redis.connect();

redis.on("error", (err: { code?: string; message: string }) => {
  logger.error(`Redis error: ${err.message}`);
  if (
    err.code === "ECONNREFUSED" ||
    err.code === "EHOSTUNREACH" ||
    err.code === "ENOTFOUND"
  ) {
    process.kill(process.pid, "SIGINT");
  }
});
