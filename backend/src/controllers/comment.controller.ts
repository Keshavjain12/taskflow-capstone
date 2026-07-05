import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { commentService } from "../services/comment.service";

export const commentController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const comments = await commentService.list(req.params.taskId, req.user!.id);
    res.status(200).json({ success: true, data: comments });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const comment = await commentService.create(req.params.taskId, req.user!.id, req.body.content);
    res.status(201).json({ success: true, data: comment });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await commentService.remove(req.params.id, req.user!.id);
    res.status(204).send();
  }),
};
