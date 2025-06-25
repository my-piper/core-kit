import { toInstance, toPlain } from "../transform/utils";
import redis from "./redis";

const DEFAULT_LOCK_EX = 60;

export async function lock(
  key: string,
  expired: number = DEFAULT_LOCK_EX,
): Promise<void> {
  await redis.setEx(key, expired, "x");
}

export async function remove(key: string): Promise<void> {
  await redis.del(key);
}

export async function unlock(key: string): Promise<void> {
  await redis.del(key);
}

export async function locked(key: string): Promise<boolean> {
  return !!(await redis.GET(key));
}

export async function readInstance<T>(
  key: string,
  type: new () => T,
): Promise<T | null> {
  const json = await redis.get(key);
  return !!json ? toInstance(JSON.parse(json) as Object, type) : null;
}

export async function saveInstance<T>(
  key: string,
  data: T,
  expiration: number = 0,
) {
  if (expiration > 0) {
    await redis.setEx(key, expiration, JSON.stringify(toPlain(data)));
  } else {
    await redis.set(key, JSON.stringify(toPlain(data)));
  }
}
