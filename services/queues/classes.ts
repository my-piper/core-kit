import { Job, JobsOptions, Queue, Worker } from "bullmq";
import { toInstance, toPlain } from "core-kit/utils/models";
import merge from "lodash/merge";
import { Logger } from "pino";
import { createLogger } from "../logger/utils";
import { JobsQueueOptions } from "./consts";
import connection from "./redis";

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
        defaultJobOptions: {
          attempts: 5,
          backoff: {
            type: "fixed",
            delay: 5000,
          },
        },
      },
      options
    );
    const { defaultJobOptions } = this.options;
    this.bull = new Queue(id, { connection, defaultJobOptions });
  }

  async getState(): Promise<{
    active: number;
    delayed: number;
    waiting: number;
    planned: number;
    completed: number;
    failed: number;
  }> {
    const { active, delayed, waiting, completed, failed } =
      await this.bull.getJobCounts();
    return {
      active,
      delayed,
      waiting,
      planned: active + delayed + waiting,
      completed,
      failed,
    };
  }

  async plan(data: Partial<T> = {}, options: JobsOptions = {}) {
    this.logger.debug("Plan new task");
    await this.bull.add(
      "default",
      toPlain(new this.model(data)),
      merge({}, this.options.defaultJobOptions, options)
    );
  }

  async close() {
    this.bull.close();
  }

  process(
    handler: (payload: T, job?: Job) => Promise<any>,
    error?: (payload: T, err?: Error, job?: Job) => Promise<void>
  ) {
    this.logger.debug("Run worker");
    const { concurrency, limiter } = this.options;
    const worker = new Worker(
      this.id,
      async (job: Job) => {
        this.logger.debug(`Process jobs ${job.id}`);
        try {
          const { data } = job;
          return await handler(toInstance(data, this.model), job);
        } catch (err) {
          this.logger.error(err);
          throw err;
        }
      },
      {
        connection,
        concurrency,
        limiter,
      }
    );
    if (!!error) {
      worker.on("failed", async (job, err) => {
        this.logger.error(`Job failed [${job.attemptsMade}]`);
        this.logger.error(err);
        const { data } = job;
        await error(toInstance(data, this.model), err, job);
      });
    }
  }
}
