import Pino, { stdTimeFunctions } from "pino";
import pretty from "pino-pretty";
import { LOG_LEVEL, LOG_PRETTY } from "./consts";

const logger = Pino(
  {
    level: LOG_LEVEL,
    formatters: {
      bindings: ({ hostname: host }) => ({ host }),
      level: (label: string) => ({ label }),
    },
    timestamp: stdTimeFunctions.isoTime,
  },
  LOG_PRETTY ? pretty({ colorize: true }) : undefined
);

export function createLogger(module: string) {
  return logger.child({
    name: module,
  });
}
