import { prisma } from "../config/db";
import { AppError } from "../utils/AppError";
import { assertProjectMember } from "./membership.service";

async function getTaskOrThrow(taskId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw AppError.notFound("Task not found");
  return task;
}

export const commentService = {
  async list(taskId: string, userId: string) {
    const task = await getTaskOrThrow(taskId);
    await assertProjectMember(task.projectId, userId);
    return prisma.comment.findMany({
      where: { taskId },
      orderBy: { createdAt: "asc" },
      include: { author: { select: { id: true, name: true, email: true } } },
    });
  },

  async create(taskId: string, userId: string, content: string) {
    const task = await getTaskOrThrow(taskId);
    await assertProjectMember(task.projectId, userId);
    return prisma.comment.create({
      data: { content, taskId, authorId: userId },
      include: { author: { select: { id: true, name: true, email: true } } },
    });
  },

  async remove(commentId: string, userId: string) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw AppError.notFound("Comment not found");
    const task = await getTaskOrThrow(comment.taskId);
    await assertProjectMember(task.projectId, userId);
    if (comment.authorId !== userId) {
      throw AppError.forbidden("You can only delete your own comments");
    }
    await prisma.comment.delete({ where: { id: commentId } });
  },
};
