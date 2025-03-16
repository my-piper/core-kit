import "../../env";

import { JobsOptions } from "bullmq";

export const BULL_REDIS_HOST = process.env["BULL_REDIS_HOST"] || "redis";
export type JobsQueueOptions = {
  concurrency?: number;
  limiter?: {
    max: number;
    duration: number;
  };
  defaultJobOptions?: JobsOptions;
  logger?: {
    module: string;
  };
};
