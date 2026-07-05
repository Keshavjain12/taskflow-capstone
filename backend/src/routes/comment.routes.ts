import { Router } from "express";
import { commentController } from "../controllers/comment.controller";
import { validate } from "../middlewares/validate";
import { createCommentSchema } from "../models/comment.schema";

// mergeParams so :projectId and :taskId from parent routers are visible here
export const commentRouter = Router({ mergeParams: true });

/**
 * @openapi
 * /api/v1/projects/{projectId}/tasks/{taskId}/comments:
 *   get:
 *     summary: List comments on a task, oldest first
 *     tags: [Comments]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Comment list }
 *   post:
 *     summary: Add a comment to a task
 *     tags: [Comments]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Comment created }
 */
commentRouter.get("/", commentController.list);
commentRouter.post("/", validate(createCommentSchema), commentController.create);

/**
 * @openapi
 * /api/v1/projects/{projectId}/tasks/{taskId}/comments/{id}:
 *   delete:
 *     summary: Delete a comment (author only)
 *     tags: [Comments]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Comment deleted }
 */
commentRouter.delete("/:id", commentController.remove);
