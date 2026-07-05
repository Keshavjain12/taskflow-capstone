import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150),
    description: z.string().max(2000).optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150).optional(),
    description: z.string().max(2000).optional(),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const addMemberSchema = z.object({
  body: z.object({
    email: z.string().email(),
    role: z.enum(["OWNER", "MEMBER"]).default("MEMBER"),
  }),
  params: z.object({ id: z.string().uuid() }),
});

export const listProjectsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    sortBy: z.enum(["name", "createdAt", "updatedAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});
