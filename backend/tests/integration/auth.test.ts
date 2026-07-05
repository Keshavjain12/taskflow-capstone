import request from "supertest";
import { app } from "../../src/app";
import { prisma } from "../../src/config/db";

const credentials = { email: "auth-test@taskflow.dev", password: "Password123!", name: "Auth Tester" };

describe("Auth API", () => {
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: credentials.email } });
    await prisma.$disconnect();
  });

  describe("POST /api/v1/auth/register", () => {
    it("registers a new user and returns a token pair", async () => {
      const res = await request(app).post("/api/v1/auth/register").send(credentials);
      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty("accessToken");
      expect(res.body.data).toHaveProperty("refreshToken");
      expect(res.body.data.user.email).toBe(credentials.email);
      expect(res.body.data.user).not.toHaveProperty("password");
    });

    it("rejects a duplicate email with 409", async () => {
      const res = await request(app).post("/api/v1/auth/register").send(credentials);
      expect(res.status).toBe(409);
    });

    it("rejects a weak password with 400", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ ...credentials, email: "weak@taskflow.dev", password: "weak" });
      expect(res.status).toBe(400);
      expect(res.body.error.details).toBeDefined();
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("returns tokens for valid credentials", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: credentials.email, password: credentials.password });
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("accessToken");
    });

    it("rejects invalid credentials with 401", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: credentials.email, password: "wrong-password" });
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/v1/auth/me", () => {
    it("rejects requests without a token", async () => {
      const res = await request(app).get("/api/v1/auth/me");
      expect(res.status).toBe(401);
    });

    it("returns the current user profile with a valid token", async () => {
      const login = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: credentials.email, password: credentials.password });
      const token = login.body.data.accessToken;

      const res = await request(app).get("/api/v1/auth/me").set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(credentials.email);
    });
  });

  describe("POST /api/v1/auth/refresh", () => {
    it("issues a new access token from a valid refresh token", async () => {
      const login = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: credentials.email, password: credentials.password });
      const { refreshToken } = login.body.data;

      const res = await request(app).post("/api/v1/auth/refresh").send({ refreshToken });
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("accessToken");
    });

    it("rejects an invalid refresh token", async () => {
      const res = await request(app).post("/api/v1/auth/refresh").send({ refreshToken: "not-a-real-token" });
      expect(res.status).toBe(401);
    });
  });
});
