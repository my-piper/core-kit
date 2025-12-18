import { DefaultJobOptions } from "bullmq";

export type JobsQueueOptions = {
  concurrency?: number;
  timeout?: number;
  limiter?: {
    max: number;
    duration: number;
  };
  defaultJobOptions?: DefaultJobOptions;
  logger?: {
    module: string;
  };
};
