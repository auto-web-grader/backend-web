import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";

const initializeSentry = (app) => {
    Sentry.init({
        dsn: "https://a0efb3054a6c19832128cce84944e71d@o4506518990553088.ingest.sentry.io/4506518993764352",
        integrations: [
          // enable HTTP calls tracing
          new Sentry.Integrations.Http({ tracing: true }),
          // enable Express.js middleware tracing
          new Sentry.Integrations.Express({ app }),
          new ProfilingIntegration(),
        ],
        // Performance Monitoring
        tracesSampleRate: 1.0, //  Capture 100% of the transactions
        // Set sampling rate for profiling - this is relative to tracesSampleRate
        profilesSampleRate: 1.0,
      });
    return Sentry;
};

export default initializeSentry;