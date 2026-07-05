import { prisma } from "../config/db";
import { AppError } from "../utils/AppError";

/** Shared authorization helper: confirm a user belongs to a project, and at what role. */
export async function assertProjectMember(projectId: string, userId: string) {
  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  if (!membership) throw AppError.forbidden("You do not have access to this project");
  return membership;
}

export async function assertProjectOwner(projectId: string, userId: string) {
  const membership = await assertProjectMember(projectId, userId);
  if (membership.role !== "OWNER") throw AppError.forbidden("Only the project owner can do this");
  return membership;
}
