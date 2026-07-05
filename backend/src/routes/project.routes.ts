import { Router } from "express";
import { projectController } from "../controllers/project.controller";
import { validate } from "../middlewares/validate";
import { requireAuth } from "../middlewares/auth";
import {
  addMemberSchema,
  createProjectSchema,
  listProjectsSchema,
  updateProjectSchema,
} from "../models/project.schema";
import { taskRouter } from "./task.routes";

export const projectRouter = Router();
projectRouter.use(requireAuth);

/**
 * @openapi
 * /api/v1/projects:
 *   get:
 *     summary: List projects the current user belongs to (paginated, searchable, sortable)
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: Paginated project list }
 *   post:
 *     summary: Create a new project (creator becomes OWNER)
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Project created }
 */
projectRouter.get("/", validate(listProjectsSchema), projectController.list);
projectRouter.post("/", validate(createProjectSchema), projectController.create);

/**
 * @openapi
 * /api/v1/projects/{id}:
 *   get:
 *     summary: Get a single project
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Project detail }
 *       404: { description: Not found }
 *   patch:
 *     summary: Update a project (owner only)
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Project updated }
 *   delete:
 *     summary: Delete a project (owner only)
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Project deleted }
 */
projectRouter.get("/:id", projectController.getById);
projectRouter.patch("/:id", validate(updateProjectSchema), projectController.update);
projectRouter.delete("/:id", projectController.remove);

/**
 * @openapi
 * /api/v1/projects/{id}/members:
 *   post:
 *     summary: Add a member to a project by email (owner only)
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Member added }
 */
projectRouter.post("/:id/members", validate(addMemberSchema), projectController.addMember);

// Nested resource: /api/v1/projects/:projectId/tasks
projectRouter.use("/:projectId/tasks", taskRouter);
