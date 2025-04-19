import { redis } from "./redis";

const DEFAULT_LOCK_EX = 60;

export async function lock(
  key: string,
  expired: number = DEFAULT_LOCK_EX
): Promise<void> {
  await redis.setEx(key, expired, "x");
}

export async function unlock(key: string): Promise<void> {
  await redis.del(key);
}

export async function locked(key: string): Promise<boolean> {
  return !!(await redis.GET(key));
}
