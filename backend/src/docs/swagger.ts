import swaggerJsdoc from "swagger-jsdoc";
import { env } from "../config/env";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "TaskFlow API",
      version: "1.0.0",
      description:
        "REST API for TaskFlow, a task/project management capstone app. " +
        "JWT bearer auth (access + refresh tokens), role-scoped project membership, " +
        "paginated/filterable/searchable resources.",
    },
    servers: [{ url: `http://localhost:${env.port}`, description: "Local" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
  },
  // ts-node-dev (local dev) runs from src/, so JSDoc lives in .ts files there.
  // The production build (tsc, rootDir ".") compiles to dist/src/routes/*.js,
  // NOT dist/routes/*.js — both paths are listed so either environment finds them.
  apis: ["./src/routes/*.ts", "./dist/src/routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
