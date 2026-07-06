import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { Sentry } from "./config/sentry";
import { apiV1Router } from "./routes";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import { apiRateLimiter } from "./middlewares/rateLimiter";
import { swaggerSpec } from "./docs/swagger";

export function createApp(): Application {
  const app = express();

  // Security & core middleware
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: env.clientOrigin,
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(
    pinoHttp({
      logger,
      autoLogging: !env.isTest,
      redact: ["req.headers.authorization"],
    }),
  );
  app.use(apiRateLimiter);

  // Health check — required for container orchestration & uptime monitoring
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
  });

  // Interactive API docs
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api-docs.json", (_req, res) => res.json(swaggerSpec));

  // Versioned API
  app.use("/api/v1", apiV1Router);

  // Verification helper — hit this URL and check the Sentry dashboard to
  // confirm error tracking is wired up, instead of needing a real bug.
  // Always returns a 500 (via errorHandler below); if SENTRY_DSN isn't set,
  // the error simply isn't reported anywhere, same as any other error.
  app.get("/debug-sentry", () => {
    throw new Error("Test error — confirms Sentry error tracking is wired up.");
  });

  app.use(notFoundHandler);

  // Reports any error thrown by a route/middleware above to Sentry (a no-op
  // if SENTRY_DSN isn't set), then forwards to our own errorHandler below so
  // the JSON response shape stays consistent either way.
  Sentry.setupExpressErrorHandler(app);

  app.use(errorHandler);

  return app;
}

export const app = createApp();
