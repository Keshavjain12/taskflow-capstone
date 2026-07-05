import { Prisma } from "@prisma/client";
import { prisma } from "../config/db";
import { AppError } from "../utils/AppError";
import { buildPaginationMeta, normalizePagination } from "../utils/pagination";
import { assertProjectMember, assertProjectOwner } from "./membership.service";

interface ListProjectsOptions {
  userId: string;
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export const projectService = {
  async list(opts: ListProjectsOptions) {
    const { page, limit, skip, take } = normalizePagination(opts);
    const where: Prisma.ProjectWhereInput = {
      members: { some: { userId: opts.userId } },
      ...(opts.search ? { name: { contains: opts.search, mode: "insensitive" } } : {}),
    };
    const orderBy = { [opts.sortBy ?? "createdAt"]: opts.sortOrder ?? "desc" };

    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          owner: { select: { id: true, name: true, email: true } },
          _count: { select: { tasks: true, members: true } },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return { items, meta: buildPaginationMeta(page, limit, total) };
  },

  async getById(projectId: string, userId: string) {
    await assertProjectMember(projectId, userId);
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        _count: { select: { tasks: true } },
      },
    });
    if (!project) throw AppError.notFound("Project not found");
    return project;
  },

  async create(userId: string, data: { name: string; description?: string }) {
    return prisma.project.create({
      data: {
        ...data,
        ownerId: userId,
        members: { create: [{ userId, role: "OWNER" }] },
      },
    });
  },

  async update(projectId: string, userId: string, data: { name?: string; description?: string }) {
    await assertProjectOwner(projectId, userId);
    return prisma.project.update({ where: { id: projectId }, data });
  },

  async remove(projectId: string, userId: string) {
    await assertProjectOwner(projectId, userId);
    await prisma.project.delete({ where: { id: projectId } });
  },

  async addMember(projectId: string, userId: string, email: string, role: "OWNER" | "MEMBER") {
    await assertProjectOwner(projectId, userId);
    const targetUser = await prisma.user.findUnique({ where: { email } });
    if (!targetUser) throw AppError.notFound("No user found with that email");

    const existing = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: targetUser.id } },
    });
    if (existing) throw AppError.conflict("User is already a member of this project");

    return prisma.projectMember.create({
      data: { projectId, userId: targetUser.id, role },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  },
};
