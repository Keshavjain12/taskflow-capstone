import * as Sentry from "@sentry/node";
import { env } from "./env";
import { logger } from "./logger";

/**
 * Error tracking is opt-in: it only activates when SENTRY_DSN is set. This
 * must be called before the Express app is created (Sentry needs to patch
 * Node's http/https modules before other libraries wrap them).
 */
export function initSentry(): void {
  if (!env.sentryDsn) {
    logger.info("SENTRY_DSN not set — error tracking disabled.");
    return;
  }

  Sentry.init({
    dsn: env.sentryDsn,
    environment: env.nodeEnv,
    tracesSampleRate: env.isProduction ? 0.2 : 1.0,
  });

  logger.info("Sentry error tracking initialized.");
}

export { Sentry };
