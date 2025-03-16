import { createClient } from "@redis/client";
import { REDIS_PASSWORD, REDIS_URL } from "./consts";

export const redis = createClient({ url: REDIS_URL, password: REDIS_PASSWORD });
await redis.connect();
