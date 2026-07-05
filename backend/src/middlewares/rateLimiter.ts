import rateLimit from "express-rate-limit";

/** Tighter limiter for auth endpoints to slow brute-force attempts. */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { message: "Too many attempts, please try again later" } },
});

/** Generous general-purpose limiter for the rest of the API. */
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
