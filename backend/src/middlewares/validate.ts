import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { AppError } from "../utils/AppError";

/**
 * Generic request-validation middleware. Pass a Zod schema shaped like
 * { body?, query?, params? } and it validates + coerces req in place.
 */
export const validate =
  (schema: AnyZodObject) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if (parsed.body) req.body = parsed.body;
      if (parsed.params) req.params = parsed.params;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(
          AppError.badRequest(
            "Validation failed",
            err.errors.map((e) => ({ path: e.path.join("."), message: e.message })),
          ),
        );
      }
      next(err);
    }
  };
