import { Prisma } from "@prisma/client";
import { prisma } from "../config/db";
import { AppError } from "../utils/AppError";
import { buildPaginationMeta, normalizePagination } from "../utils/pagination";
import { assertProjectMember } from "./membership.service";

interface ListTasksOptions {
  projectId: string;
  userId: string;
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  sortBy?: "createdAt" | "updatedAt" | "dueDate" | "priority";
  sortOrder?: "asc" | "desc";
}

export const taskService = {
  async list(opts: ListTasksOptions) {
    await assertProjectMember(opts.projectId, opts.userId);
    const { page, limit, skip, take } = normalizePagination(opts);

    const where: Prisma.TaskWhereInput = {
      projectId: opts.projectId,
      ...(opts.status ? { status: opts.status as Prisma.EnumTaskStatusFilter["equals"] } : {}),
      ...(opts.priority ? { priority: opts.priority as Prisma.EnumTaskPriorityFilter["equals"] } : {}),
      ...(opts.assigneeId ? { assigneeId: opts.assigneeId } : {}),
      ...(opts.search
        ? {
            OR: [
              { title: { contains: opts.search, mode: "insensitive" } },
              { description: { contains: opts.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };
    const orderBy = { [opts.sortBy ?? "createdAt"]: opts.sortOrder ?? "desc" };

    const [items, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          assignee: { select: { id: true, name: true, email: true } },
          creator: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.task.count({ where }),
    ]);

    return { items, meta: buildPaginationMeta(page, limit, total) };
  },

  async getById(taskId: string, userId: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { assignee: true, creator: true },
    });
    if (!task) throw AppError.notFound("Task not found");
    await assertProjectMember(task.projectId, userId);
    return task;
  },

  async create(
    projectId: string,
    userId: string,
    data: {
      title: string;
      description?: string;
      status?: string;
      priority?: string;
      assigneeId?: string;
      dueDate?: string;
    },
  ) {
    await assertProjectMember(projectId, userId);
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status as Prisma.TaskCreateInput["status"],
        priority: data.priority as Prisma.TaskCreateInput["priority"],
        assigneeId: data.assigneeId,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        projectId,
        creatorId: userId,
      },
    });
  },

  async update(
    taskId: string,
    userId: string,
    data: Partial<{
      title: string;
      description: string;
      status: string;
      priority: string;
      assigneeId: string | null;
      dueDate: string | null;
    }>,
  ) {
    const existing = await prisma.task.findUnique({ where: { id: taskId } });
    if (!existing) throw AppError.notFound("Task not found");
    await assertProjectMember(existing.projectId, userId);

    return prisma.task.update({
      where: { id: taskId },
      data: {
        ...data,
        status: data.status as Prisma.TaskUpdateInput["status"],
        priority: data.priority as Prisma.TaskUpdateInput["priority"],
        dueDate: data.dueDate === undefined ? undefined : data.dueDate ? new Date(data.dueDate) : null,
      },
    });
  },

  async remove(taskId: string, userId: string) {
    const existing = await prisma.task.findUnique({ where: { id: taskId } });
    if (!existing) throw AppError.notFound("Task not found");
    await assertProjectMember(existing.projectId, userId);
    await prisma.task.delete({ where: { id: taskId } });
  },
};
