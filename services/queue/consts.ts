import env from "core-kit/env";

import { JobsOptions } from "bullmq";

export const BULL_REDIS_HOST = env["BULL_REDIS_HOST"] || "redis";
export type JobsQueueOptions = {
  concurrency?: number;
  timeout?: number;
  limiter?: {
    max: number;
    duration: number;
  };
  defaultJobOptions?: JobsOptions;
  logger?: {
    module: string;
  };
};
