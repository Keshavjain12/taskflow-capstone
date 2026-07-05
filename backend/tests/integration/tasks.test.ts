import request from "supertest";
import { app } from "../../src/app";
import { prisma } from "../../src/config/db";

const user = { email: "tasks-user@taskflow.dev", password: "Password123!", name: "Tasker" };
let token: string;
let projectId: string;
let taskId: string;

describe("Tasks API", () => {
  beforeAll(async () => {
    await request(app).post("/api/v1/auth/register").send(user);
    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: user.email, password: user.password });
    token = login.body.data.accessToken;

    const project = await request(app)
      .post("/api/v1/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Task Test Project" });
    projectId = project.body.data.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: user.email } });
    await prisma.$disconnect();
  });

  it("creates a task with default status TODO and priority MEDIUM", async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Write integration tests" });
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe("TODO");
    expect(res.body.data.priority).toBe("MEDIUM");
    taskId = res.body.data.id;
  });

  it("rejects a task title that is too short", async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "x" });
    expect(res.status).toBe(400);
  });

  it("lists tasks scoped to the project with pagination", async () => {
    const res = await request(app)
      .get(`/api/v1/projects/${projectId}/tasks`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.meta.total).toBeGreaterThan(0);
  });

  it("filters tasks by status", async () => {
    const res = await request(app)
      .get(`/api/v1/projects/${projectId}/tasks?status=DONE`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.every((t: any) => t.status === "DONE")).toBe(true);
  });

  it("searches tasks by title", async () => {
    const res = await request(app)
      .get(`/api/v1/projects/${projectId}/tasks?search=integration`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.some((t: any) => t.id === taskId)).toBe(true);
  });

  it("updates a task's status", async () => {
    const res = await request(app)
      .patch(`/api/v1/projects/${projectId}/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "IN_PROGRESS" });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("IN_PROGRESS");
  });

  it("returns 404 for a non-existent task", async () => {
    const res = await request(app)
      .get(`/api/v1/projects/${projectId}/tasks/00000000-0000-0000-0000-000000000000`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("deletes a task", async () => {
    const res = await request(app)
      .delete(`/api/v1/projects/${projectId}/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});
