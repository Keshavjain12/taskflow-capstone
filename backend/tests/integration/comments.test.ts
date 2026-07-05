import request from "supertest";
import { app } from "../../src/app";
import { prisma } from "../../src/config/db";

const user = { email: "comments-user@taskflow.dev", password: "Password123!", name: "Commenter" };
let token: string;
let projectId: string;
let taskId: string;
let commentId: string;

describe("Comments API", () => {
  beforeAll(async () => {
    await request(app).post("/api/v1/auth/register").send(user);
    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: user.email, password: user.password });
    token = login.body.data.accessToken;

    const project = await request(app)
      .post("/api/v1/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Comment Test Project" });
    projectId = project.body.data.id;

    const task = await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Write comment tests" });
    taskId = task.body.data.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: user.email } });
    await prisma.$disconnect();
  });

  it("starts with an empty comment list", async () => {
    const res = await request(app)
      .get(`/api/v1/projects/${projectId}/tasks/${taskId}/comments`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it("rejects an empty comment body", async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/tasks/${taskId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "" });
    expect(res.status).toBe(400);
  });

  it("creates a comment with the author attached", async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/tasks/${taskId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "Looks good, shipping it." });
    expect(res.status).toBe(201);
    expect(res.body.data.content).toBe("Looks good, shipping it.");
    expect(res.body.data.author.email).toBe(user.email);
    commentId = res.body.data.id;
  });

  it("lists comments oldest first", async () => {
    const res = await request(app)
      .get(`/api/v1/projects/${projectId}/tasks/${taskId}/comments`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].id).toBe(commentId);
  });

  it("returns 404 for comments on a non-existent task", async () => {
    const res = await request(app)
      .get("/api/v1/projects/" + projectId + "/tasks/00000000-0000-0000-0000-000000000000/comments")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("deletes its own comment", async () => {
    const res = await request(app)
      .delete(`/api/v1/projects/${projectId}/tasks/${taskId}/comments/${commentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});
