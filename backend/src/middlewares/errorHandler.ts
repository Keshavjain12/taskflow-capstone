import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { logger } from "../config/logger";
import { env } from "../config/env";

/**
 * Centralized error handler — must be registered last. Every controller can
 * simply `throw` (or call next(err)) and get a consistent JSON error shape.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  let statusCode = 500;
  let message = "Internal server error";
  let details: unknown;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      message = "A record with this value already exists";
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = "Record not found";
    } else {
      statusCode = 400;
      message = "Database request error";
    }
  } else if (err instanceof Error) {
    message = env.isProduction ? message : err.message;
  }

  if (statusCode >= 500) {
    logger.error({ err, path: req.path, method: req.method }, "Unhandled error");
  } else {
    logger.warn({ path: req.path, method: req.method, statusCode, message }, "Request error");
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(details ? { details } : {}),
      ...(env.isProduction ? {} : { stack: err instanceof Error ? err.stack : undefined }),
    },
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: { message: `Route ${req.method} ${req.originalUrl} not found` },
  });
}
