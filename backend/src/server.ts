import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { prisma } from "./config/db";

const server = app.listen(env.port, () => {
  logger.info(`TaskFlow API listening on port ${env.port} [${env.nodeEnv}]`);
  logger.info(`API docs available at http://localhost:${env.port}/api-docs`);
});

async function shutdown(signal: string) {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    logger.info("Shutdown complete");
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Unhandled promise rejection");
});
