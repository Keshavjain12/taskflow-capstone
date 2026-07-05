import request from "supertest";
import { app } from "../../src/app";
import { prisma } from "../../src/config/db";

const owner = { email: "projects-owner@taskflow.dev", password: "Password123!", name: "Owner" };
const outsider = { email: "projects-outsider@taskflow.dev", password: "Password123!", name: "Outsider" };

let ownerToken: string;
let outsiderToken: string;
let projectId: string;

describe("Projects API", () => {
  beforeAll(async () => {
    await request(app).post("/api/v1/auth/register").send(owner);
    await request(app).post("/api/v1/auth/register").send(outsider);
    const ownerLogin = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: owner.email, password: owner.password });
    const outsiderLogin = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: outsider.email, password: outsider.password });
    ownerToken = ownerLogin.body.data.accessToken;
    outsiderToken = outsiderLogin.body.data.accessToken;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: [owner.email, outsider.email] } } });
    await prisma.$disconnect();
  });

  it("rejects unauthenticated requests", async () => {
    const res = await request(app).get("/api/v1/projects");
    expect(res.status).toBe(401);
  });

  it("creates a project with the creator as OWNER", async () => {
    const res = await request(app)
      .post("/api/v1/projects")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "Integration Test Project", description: "Created by tests" });
    expect(res.status).toBe(201);
    expect(res.body.data.ownerId).toBeDefined();
    projectId = res.body.data.id;
  });

  it("lists projects for the owner with pagination metadata", async () => {
    const res = await request(app)
      .get("/api/v1/projects?page=1&limit=5")
      .set("Authorization", `Bearer ${ownerToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toMatchObject({ page: 1, limit: 5 });
  });

  it("denies access to a non-member", async () => {
    const res = await request(app)
      .get(`/api/v1/projects/${projectId}`)
      .set("Authorization", `Bearer ${outsiderToken}`);
    expect(res.status).toBe(403);
  });

  it("allows the owner to update the project", async () => {
    const res = await request(app)
      .patch(`/api/v1/projects/${projectId}`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "Renamed Project" });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Renamed Project");
  });

  it("adds a member by email", async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/members`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ email: outsider.email, role: "MEMBER" });
    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe(outsider.email);
  });

  it("now allows the added member to view the project", async () => {
    const res = await request(app)
      .get(`/api/v1/projects/${projectId}`)
      .set("Authorization", `Bearer ${outsiderToken}`);
    expect(res.status).toBe(200);
  });

  it("prevents a non-owner member from deleting the project", async () => {
    const res = await request(app)
      .delete(`/api/v1/projects/${projectId}`)
      .set("Authorization", `Bearer ${outsiderToken}`);
    expect(res.status).toBe(403);
  });

  it("allows the owner to delete the project", async () => {
    const res = await request(app)
      .delete(`/api/v1/projects/${projectId}`)
      .set("Authorization", `Bearer ${ownerToken}`);
    expect(res.status).toBe(204);
  });
});
