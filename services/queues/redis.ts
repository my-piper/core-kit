import { Redis } from "ioredis";
import { createLogger } from "../logger";
import { BULL_REDIS_HOST } from "./consts";

const logger = createLogger("queues");
logger.info(`Connect to redis ${BULL_REDIS_HOST}`);

const redis = new Redis({
  host: BULL_REDIS_HOST,
  port: 6379,
  db: 5,
  maxRetriesPerRequest: null,
});

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

export default redis;
