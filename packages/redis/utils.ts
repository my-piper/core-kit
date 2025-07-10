import { Primitive } from "types/primitive";
import { toInstance, toPlain } from "../transform/utils";
import redis from "./redis";

const DEFAULT_LOCK_EX = 60;

export async function lock(
  key: string,
  expired: number = DEFAULT_LOCK_EX
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

export async function increment(key: string): Promise<number> {
  return await redis.INCR(key);
}

export async function expire(key: string, expiration: number): Promise<void> {
  await redis.EXPIRE(key, expiration);
}

export async function readInstance<T>(
  key: string,
  type: new () => T
): Promise<T | null> {
  const json = await redis.get(key);
  return !!json ? toInstance(JSON.parse(json) as Object, type) : null;
}

export async function saveInstance<T>(
  key: string,
  data: T,
  expiration: number = 0
) {
  if (expiration > 0) {
    await redis.setEx(key, expiration, JSON.stringify(toPlain(data)));
  } else {
    await redis.set(key, JSON.stringify(toPlain(data)));
  }
}

const cache = new Map<string, string>();

const normalize = (value: Primitive): string => {
  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value.toPrecision(20).replace(/\.?0+$/, "")
      : String(value);
  }
  return String(value);
};

export async function evalScript(
  script: string,
  keys: string[] = [],
  args: Primitive[] = []
): Promise<any> {
  if (!cache.has(script)) {
    const sha = await redis.scriptLoad(script);
    cache.set(script, sha);
  }

  const sha = cache.get(script)!;

  try {
    return await redis.evalSha(sha, {
      keys,
      arguments: args.map(normalize),
    });
  } catch (err: any) {
    if (err?.message?.includes("NOSCRIPT")) {
      const result = await redis.eval(script, {
        keys,
        arguments: args.map(normalize),
      });

      const hash = await redis.scriptLoad(script);
      cache.set(script, hash);
      return result;
    }

    throw err;
  }
}
