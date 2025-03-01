import * as sentry from "@sentry/node";
import { SENTRY_SDN as SENTRY_DSN } from "./consts";

sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
});

export default sentry;
