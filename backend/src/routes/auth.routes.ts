import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { requireAuth } from "../middlewares/auth";
import { authRateLimiter } from "../middlewares/rateLimiter";
import { loginSchema, refreshSchema, registerSchema } from "../models/auth.schema";

export const authRouter = Router();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201: { description: User registered with access/refresh tokens }
 *       409: { description: Email already in use }
 */
authRouter.post("/register", authRateLimiter, validate(registerSchema), authController.register);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in with email/password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Access/refresh tokens issued }
 *       401: { description: Invalid credentials }
 */
authRouter.post("/login", authRateLimiter, validate(loginSchema), authController.login);

/**
 * @openapi
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Exchange a refresh token for a new access token
 *     tags: [Auth]
 *     responses:
 *       200: { description: New token pair issued }
 *       401: { description: Invalid or expired refresh token }
 */
authRouter.post("/refresh", validate(refreshSchema), authController.refresh);

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     summary: Log out and revoke the refresh token
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Logged out }
 */
authRouter.post("/logout", requireAuth, authController.logout);

/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     summary: Get the currently authenticated user
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Current user profile }
 */
authRouter.get("/me", requireAuth, authController.me);
