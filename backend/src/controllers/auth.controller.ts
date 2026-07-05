import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { authService } from "../services/auth.service";
import { AppError } from "../utils/AppError";

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.status(200).json({ success: true, data: result });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const token = req.body.refreshToken ?? req.cookies?.refreshToken;
    if (!token) throw AppError.unauthorized("Refresh token is required");
    const result = await authService.refresh(token);
    res.status(200).json({ success: true, data: result });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    await authService.logout(req.user!.id);
    res.status(204).send();
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.me(req.user!.id);
    res.status(200).json({ success: true, data: user });
  }),
};
