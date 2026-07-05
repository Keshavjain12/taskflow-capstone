import { z } from "zod";

const statusEnum = z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]);
const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200),
    description: z.string().max(4000).optional(),
    status: statusEnum.optional(),
    priority: priorityEnum.optional(),
    assigneeId: z.string().uuid().optional(),
    dueDate: z.string().datetime().optional(),
  }),
  params: z.object({ projectId: z.string().uuid() }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200).optional(),
    description: z.string().max(4000).optional(),
    status: statusEnum.optional(),
    priority: priorityEnum.optional(),
    assigneeId: z.string().uuid().nullable().optional(),
    dueDate: z.string().datetime().nullable().optional(),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const listTasksSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    status: statusEnum.optional(),
    priority: priorityEnum.optional(),
    assigneeId: z.string().uuid().optional(),
    sortBy: z.enum(["createdAt", "updatedAt", "dueDate", "priority"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
  params: z.object({ projectId: z.string().uuid() }),
});
