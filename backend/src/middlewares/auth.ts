import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/** Verifies the JWT access token and attaches req.user. */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(AppError.unauthorized("Missing or malformed Authorization header"));
  }
  const token = header.slice("Bearer ".length);
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch {
    next(AppError.unauthorized("Invalid or expired access token"));
  }
}

/** Restricts a route to specific global roles (e.g. ADMIN). */
export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(AppError.forbidden("Insufficient permissions"));
    }
    next();
  };
}
