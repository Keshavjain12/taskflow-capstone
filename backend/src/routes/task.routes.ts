import { Router } from "express";
import { taskController } from "../controllers/task.controller";
import { validate } from "../middlewares/validate";
import { createTaskSchema, listTasksSchema, updateTaskSchema } from "../models/task.schema";
import { commentRouter } from "./comment.routes";

// mergeParams so :projectId from the parent router is visible here
export const taskRouter = Router({ mergeParams: true });

/**
 * @openapi
 * /api/v1/projects/{projectId}/tasks:
 *   get:
 *     summary: List tasks in a project (paginated, filterable by status/priority/assignee, searchable, sortable)
 *     tags: [Tasks]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Paginated task list }
 *   post:
 *     summary: Create a task in a project
 *     tags: [Tasks]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Task created }
 */
taskRouter.get("/", validate(listTasksSchema), taskController.list);
taskRouter.post("/", validate(createTaskSchema), taskController.create);

/**
 * @openapi
 * /api/v1/projects/{projectId}/tasks/{id}:
 *   get:
 *     summary: Get a single task
 *     tags: [Tasks]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Task detail }
 *   patch:
 *     summary: Update a task (status, priority, assignee, etc.)
 *     tags: [Tasks]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Task updated }
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Task deleted }
 */
taskRouter.get("/:id", taskController.getById);
taskRouter.patch("/:id", validate(updateTaskSchema), taskController.update);
taskRouter.delete("/:id", taskController.remove);

// Nested resource: /api/v1/projects/:projectId/tasks/:taskId/comments
taskRouter.use("/:taskId/comments", commentRouter);
