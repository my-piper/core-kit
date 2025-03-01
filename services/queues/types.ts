import { Job, JobsOptions, Queue, Worker } from "bullmq";
import assign from "lodash/assign";
import merge from "lodash/merge";
import { Logger } from "pino";
import { toInstance, toPlain } from "../../utils/models";
import { createLogger } from "../logger/utils";
import { BULL_REDIS_HOST, JobsQueueOptions } from "./consts";

export class JobsQueue<T> {
  private logger: Logger = createLogger(this.id);

  private bull: Queue;
  private options: JobsQueueOptions;

  constructor(
    private id: string,
    private model: new (defs?: Partial<T>) => T,
    options: JobsQueueOptions = {}
  ) {
    this.options = merge(
      {
        concurrency: 1,
        limiter: {
          max: 5,
          duration: 10000,
        },
        job: {
          attempts: 12,
          backoff: 10000,
        },
      },
      options
    );
    this.bull = new Queue(id, {
      connection: {
        host: BULL_REDIS_HOST,
      },
    });
  }

  async getPendingCount(): Promise<number> {
    const { active, delayed, waiting } = await this.bull.getJobCounts();
    return active + delayed + waiting;
  }

  async plan(data: Partial<T> = {}, options: JobsOptions = {}) {
    await this.bull.add(
      "default",
      toPlain(new this.model(data)),
      assign({}, this.options.job, options)
    );
  }

  handle(handler: (payload: T, job?: Job) => Promise<any>) {
    const { concurrency, limiter } = this.options;
    const worker = new Worker(
      this.id,
      async (job: Job) => {
        try {
          const { data } = job;
          return await handler(toInstance(data, this.model), job);
        } catch (err) {
          this.logger.error(err);
          throw err;
        }
      },
      {
        connection: {
          host: BULL_REDIS_HOST,
        },
        concurrency,
        limiter,
      }
    );
    worker.on("failed", (job, err) => {
      this.logger.error(`Job failed [${job.attemptsMade}]`);
      this.logger.error(err);
    });
  }
}
