import pino from "pino";
import { env } from "./env";

export const logger = pino({
  level: env.logLevel,
  transport: env.isProduction
    ? undefined
    : { target: "pino-pretty", options: { colorize: true, translateTime: "HH:MM:ss" } },
  redact: ["req.headers.authorization", "*.password", "*.accessToken", "*.refreshToken"],
});
