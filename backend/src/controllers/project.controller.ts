import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { projectService } from "../services/project.service";

export const projectController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const { items, meta } = await projectService.list({ userId: req.user!.id, ...req.query });
    res.status(200).json({ success: true, data: items, meta });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.getById(req.params.id, req.user!.id);
    res.status(200).json({ success: true, data: project });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.create(req.user!.id, req.body);
    res.status(201).json({ success: true, data: project });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.update(req.params.id, req.user!.id, req.body);
    res.status(200).json({ success: true, data: project });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await projectService.remove(req.params.id, req.user!.id);
    res.status(204).send();
  }),

  addMember: asyncHandler(async (req: Request, res: Response) => {
    const member = await projectService.addMember(
      req.params.id,
      req.user!.id,
      req.body.email,
      req.body.role,
    );
    res.status(201).json({ success: true, data: member });
  }),
};
