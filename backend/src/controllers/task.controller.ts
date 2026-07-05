import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { taskService } from "../services/task.service";

export const taskController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const { items, meta } = await taskService.list({
      projectId: req.params.projectId,
      userId: req.user!.id,
      ...req.query,
    });
    res.status(200).json({ success: true, data: items, meta });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const task = await taskService.getById(req.params.id, req.user!.id);
    res.status(200).json({ success: true, data: task });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const task = await taskService.create(req.params.projectId, req.user!.id, req.body);
    res.status(201).json({ success: true, data: task });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const task = await taskService.update(req.params.id, req.user!.id, req.body);
    res.status(200).json({ success: true, data: task });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await taskService.remove(req.params.id, req.user!.id);
    res.status(204).send();
  }),
};
