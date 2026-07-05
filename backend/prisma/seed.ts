/**
 * Seed script — required by the handbook so evaluators never hit an empty DB.
 * Fully idempotent: safe to run on every container start (docker-compose does
 * exactly that) without creating duplicate demo data.
 * Run with: npm run prisma:seed
 */
import { PrismaClient, ProjectRole, TaskStatus, TaskPriority } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);
const DEMO_PROJECT_NAME = "TaskFlow Launch";

async function main() {
  console.log("Seeding database...");

  const password = await bcrypt.hash("Password123!", SALT_ROUNDS);

  const owner = await prisma.user.upsert({
    where: { email: "demo@taskflow.dev" },
    update: {},
    create: {
      email: "demo@taskflow.dev",
      password,
      name: "Demo Owner",
      role: "USER",
    },
  });

  const teammate = await prisma.user.upsert({
    where: { email: "teammate@taskflow.dev" },
    update: {},
    create: {
      email: "teammate@taskflow.dev",
      password,
      name: "Dana Teammate",
      role: "USER",
    },
  });

  // Guard against re-seeding on every container restart — only create the
  // demo project (and its tasks) the first time.
  const existingProject = await prisma.project.findFirst({
    where: { ownerId: owner.id, name: DEMO_PROJECT_NAME },
  });

  if (existingProject) {
    console.log("Demo project already exists — skipping project/task seed.");
    console.log("Seed complete. Demo login: demo@taskflow.dev / Password123!");
    return;
  }

  const project = await prisma.project.create({
    data: {
      name: DEMO_PROJECT_NAME,
      description: "Ship the capstone MVP end to end.",
      ownerId: owner.id,
      members: {
        create: [
          { userId: owner.id, role: ProjectRole.OWNER },
          { userId: teammate.id, role: ProjectRole.MEMBER },
        ],
      },
    },
  });

  const tasks: Array<{
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeId: string;
  }> = [
    {
      title: "Design database schema",
      description: "Model users, projects, members, tasks with proper relations.",
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      assigneeId: owner.id,
    },
    {
      title: "Build authentication flow",
      description: "JWT access/refresh tokens, bcrypt hashing, protected routes.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      assigneeId: owner.id,
    },
    {
      title: "Build Kanban board UI",
      description: "Drag-and-drop task board with loading/empty/error states.",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      assigneeId: teammate.id,
    },
    {
      title: "Write CI/CD pipeline",
      description: "GitHub Actions: lint, test, build, containerize, deploy.",
      status: TaskStatus.TODO,
      priority: TaskPriority.URGENT,
      assigneeId: teammate.id,
    },
  ];

  for (const t of tasks) {
    await prisma.task.create({
      data: { ...t, projectId: project.id, creatorId: owner.id },
    });
  }

  console.log("Seed complete. Demo login: demo@taskflow.dev / Password123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
