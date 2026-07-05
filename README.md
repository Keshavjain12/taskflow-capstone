# TaskFlow — Full-Stack Task & Project Management Capstone

[![Backend CI/CD](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/backend-ci.yml)
[![Frontend CI/CD](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/frontend-ci.yml)

TaskFlow is a production-style task/project management app: users register, create projects, invite
teammates by email, and organize work on a per-project Kanban board (To do → In progress → In review → Done).
It is built end-to-end per the capstone handbook: a typed Node.js/Express API, a React/TypeScript frontend,
PostgreSQL via Prisma, JWT auth with refresh tokens, automated tests at three levels, Docker/Compose,
GitHub Actions CI/CD, and Swagger API docs.

> **Demo login (after seeding):** `demo@taskflow.dev` / `Password123!`

## Table of contents

- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Local setup](#local-setup)
- [API reference](#api-reference)
- [Testing](#testing)
- [Docker & Docker Compose](#docker--docker-compose)
- [CI/CD pipeline](#cicd-pipeline)
- [Deployment](#deployment)
- [Monitoring & logging](#monitoring--logging)
- [Environment variables](#environment-variables)
- [Known limitations & future work](#known-limitations--future-work)

## Screenshots

_Add screenshots or a short demo GIF of the login screen, the projects dashboard, and the Kanban board here
before final submission (e.g. `docs/screenshots/board.png`), and a link to a 60–90s demo video walking
through: register → create project → create task → move it across the board._

## Architecture

Classic 3-tier architecture. Frontend and backend are independently built, containerized, and deployed;
the frontend talks to the API exclusively over HTTPS/JSON using a build-time-configured base URL.

```
┌──────────────────┐      HTTPS/JSON      ┌───────────────────────┐      TCP       ┌──────────────────┐
│   React SPA       │ ───────────────────▶ │  Node.js / Express     │ ─────────────▶ │   PostgreSQL       │
│   (Vite, nginx)    │ ◀─────────────────── │  REST API (/api/v1)    │ ◀───────────── │   (Prisma ORM)     │
└──────────────────┘                       └───────────────────────┘                └──────────────────┘
                                                        │
                                                        ▼
                                            ┌───────────────────────┐
                                            │   GitHub Actions CI     │
                                            │   lint → typecheck →    │
                                            │   test → build → push → │
                                            │   deploy                │
                                            └───────────────────────┘
```

**Backend layering:** `routes → controllers → services → Prisma` — controllers stay thin (parse request,
call service, shape response), services own business logic and authorization, and a centralized error
handler converts any thrown `AppError` (or Prisma error) into a consistent JSON error shape.

**Data model:** `User` 1—N `Project` (as owner), `Project` N—N `User` through `ProjectMember` (role-scoped:
`OWNER` | `MEMBER`), `Project` 1—N `Task`, `Task` N—1 `User` (assignee, nullable) and N—1 `User` (creator).
See [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma).

## Tech stack

| Layer          | Technology                                                             |
| -------------- | ----------------------------------------------------------------------- |
| Frontend       | React 18, Vite, TypeScript, TanStack Query, Zustand, Tailwind CSS, React Hook Form |
| Backend        | Node.js 20, Express, TypeScript, Zod validation, Pino logging            |
| Database       | PostgreSQL 16, Prisma ORM (migrations + typed client)                   |
| Auth           | JWT access (15m) + refresh (7d) tokens, bcryptjs password hashing        |
| Testing        | Jest + Supertest (backend unit/integration), Vitest + Testing Library (frontend unit), Playwright (E2E) |
| Containers     | Docker (multi-stage builds), Docker Compose                              |
| CI/CD          | GitHub Actions (lint → typecheck → test → build → push → deploy)         |
| API docs       | swagger-jsdoc + swagger-ui-express at `/api-docs`                        |

## Project structure

```
capstone-project/
├── .github/workflows/       # backend-ci.yml, frontend-ci.yml
├── backend/
│   ├── src/
│   │   ├── config/          # env, db (Prisma client), logger
│   │   ├── controllers/     # thin HTTP handlers
│   │   ├── middlewares/     # auth, validate, errorHandler, rateLimiter
│   │   ├── models/          # Zod request schemas
│   │   ├── routes/          # versioned Express routers (+ OpenAPI JSDoc)
│   │   ├── services/        # business logic + authorization
│   │   ├── utils/           # AppError, jwt, pagination, asyncHandler
│   │   ├── docs/            # swagger.ts
│   │   ├── app.ts / server.ts
│   ├── prisma/               # schema.prisma, migrations/, seed.ts
│   ├── tests/{unit,integration}
│   └── Dockerfile
├── frontend/
│   ├── src/{pages,components,hooks,api,store,lib}
│   ├── tests/e2e/            # Playwright specs
│   └── Dockerfile
├── docker-compose.yml
└── docs/                     # ARCHITECTURE.md, DEPLOYMENT.md
```

## Local setup

**Prerequisites:** Docker + Docker Compose (recommended), or Node.js 20+ and a local PostgreSQL 16 instance.

### Option A — Docker Compose (matches production, zero manual setup)

```bash
git clone <your-repo-url>
cd capstone-project
docker compose up --build
```

This single command builds and starts Postgres, runs migrations, seeds demo data, starts the API, and
serves the built frontend via nginx.

- Frontend: http://localhost:3000
- Backend health check: http://localhost:4000/health
- API docs (Swagger UI): http://localhost:4000/api-docs

### Option B — Run services natively

```bash
# 1. Database
docker run -d --name capstone-db -e POSTGRES_USER=capstone -e POSTGRES_PASSWORD=capstone \
  -e POSTGRES_DB=capstone_db -p 5432:5432 postgres:16-alpine

# 2. Backend
cd backend
cp .env.example .env        # edit if needed
npm install
npm run prisma:migrate:deploy
npm run prisma:seed
npm run dev                 # http://localhost:4000

# 3. Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:3000
```

## API reference

Full interactive docs (request/response schemas, try-it-out) are served at **`/api-docs`** once the backend
is running, generated from JSDoc annotations in `backend/src/routes/*.ts` (`swagger-jsdoc` +
`swagger-ui-express`). Summary of endpoints:

| Method | Endpoint                                    | Auth | Description                          |
| ------ | -------------------------------------------- | ---- | ------------------------------------- |
| POST   | `/api/v1/auth/register`                      | –    | Create an account, returns tokens     |
| POST   | `/api/v1/auth/login`                         | –    | Log in, returns tokens                |
| POST   | `/api/v1/auth/refresh`                       | –    | Exchange refresh token for new access token |
| POST   | `/api/v1/auth/logout`                        | ✓    | Revoke refresh token                  |
| GET    | `/api/v1/auth/me`                            | ✓    | Current user profile                  |
| GET    | `/api/v1/projects`                           | ✓    | List projects (paginate/search/sort)  |
| POST   | `/api/v1/projects`                           | ✓    | Create a project                      |
| GET    | `/api/v1/projects/:id`                       | ✓    | Project detail                        |
| PATCH  | `/api/v1/projects/:id`                       | ✓    | Update project (owner only)           |
| DELETE | `/api/v1/projects/:id`                       | ✓    | Delete project (owner only)           |
| POST   | `/api/v1/projects/:id/members`               | ✓    | Add member by email (owner only)      |
| GET    | `/api/v1/projects/:projectId/tasks`          | ✓    | List tasks (paginate/filter/search/sort) |
| POST   | `/api/v1/projects/:projectId/tasks`          | ✓    | Create a task                         |
| GET    | `/api/v1/projects/:projectId/tasks/:id`      | ✓    | Task detail                           |
| PATCH  | `/api/v1/projects/:projectId/tasks/:id`      | ✓    | Update task (status, priority, ...)   |
| DELETE | `/api/v1/projects/:projectId/tasks/:id`      | ✓    | Delete task                           |
| GET    | `/health`                                    | –    | Liveness/health probe                 |

All list endpoints accept `page`, `limit`, `search`, and resource-specific filters (`status`, `priority`,
`assigneeId`) plus `sortBy`/`sortOrder`, and return a `meta` block (`page`, `limit`, `total`, `totalPages`,
`hasNextPage`, `hasPrevPage`).

## Testing

| Level       | Location                          | Command (from `backend/` or `frontend/`) |
| ----------- | ---------------------------------- | ------------------------------------------ |
| Backend unit | `backend/tests/unit`              | `npm run test:unit`                        |
| Backend integration | `backend/tests/integration` | `npm run test:integration` (needs a running Postgres — see `DATABASE_URL`) |
| Backend coverage | —                              | `npm run test:coverage` (coverage report in `backend/coverage/`) |
| Frontend unit | `frontend/src/**/__tests__`      | `npm run test`                              |
| E2E (Playwright) | `frontend/tests/e2e`         | `npm run test:e2e` (needs the app running, see `playwright.config.ts`) |

CI runs all of the above automatically on every push/PR to `main` (see [CI/CD pipeline](#cicd-pipeline)).

## Docker & Docker Compose

- `backend/Dockerfile` — multi-stage (`builder` → `runner`), non-root user, `HEALTHCHECK` against `/health`.
- `frontend/Dockerfile` — multi-stage, static build served by nginx with SPA fallback routing.
- `docker-compose.yml` — brings up Postgres, backend (migrate → seed → start), and frontend with proper
  `depends_on`/health-based ordering. Run with `docker compose up --build`.

## CI/CD pipeline

Two independent GitHub Actions workflows (path-scoped, so a frontend-only change doesn't re-run backend CI):

- **`.github/workflows/backend-ci.yml`** — install → lint → typecheck → `prisma generate` → `prisma migrate
  deploy` against an ephemeral Postgres service container → unit + integration tests with coverage → build →
  (on `main`) Docker build & push → deploy webhook.
- **`.github/workflows/frontend-ci.yml`** — install → lint → typecheck → unit tests → build → Playwright E2E
  against the built app → (on `main`) Docker build & push → deploy webhook.

Required repo secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `RENDER_DEPLOY_HOOK`, `VERCEL_DEPLOY_HOOK`.
Set these under **Settings → Secrets and variables → Actions** in your GitHub repo — never commit them.

## Deployment

| Component | Recommended host                      |
| --------- | --------------------------------------- |
| Frontend  | Vercel or Netlify (static build, auto-deploy from `main`) |
| Backend   | Render or Railway (Docker-native)        |
| Database  | Render Postgres, Supabase, or MongoDB Atlas equivalent (managed Postgres) |

**Live URLs:** _fill in after you deploy — e.g._
`Frontend: https://taskflow-yourname.vercel.app` · `Backend health: https://taskflow-api-yourname.onrender.com/health`

## Monitoring & logging

- Structured JSON logs via **Pino** (`pino-http` request logging, redacts `Authorization`/passwords/tokens).
- `/health` endpoint for container healthchecks and external uptime monitors (e.g. UptimeRobot, every 5 min).
- Recommended for production: point **Sentry** (frontend + backend) and **Better Stack/Logtail** at the
  deployed services — both have free tiers and only need an env var + a few lines of init code.

## Environment variables

See `backend/.env.example` and `frontend/.env.example` for the full list. Highlights:

| Variable | Where | Purpose |
| -------- | ----- | ------- |
| `DATABASE_URL` | backend | Postgres connection string |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | backend | Sign/verify JWTs — must be long, random, and different from each other |
| `CLIENT_ORIGIN` | backend | Locks CORS to the deployed frontend origin |
| `VITE_API_URL` | frontend (build-time) | Base URL the SPA calls |

## Known limitations & future work

- **Real-time updates:** the board currently refetches via TanStack Query invalidation rather than
  WebSocket/SSE push; a `Socket.IO` layer would make multi-user boards feel instant.
- **Drag-and-drop:** task status changes use a select dropdown rather than pointer-based drag-and-drop, to
  keep the dependency footprint small; swapping in `@dnd-kit` is a natural next step.
- **Refresh-token revocation list:** logout invalidates the stored hash for that user, but there's no
  per-device session list yet (only one active refresh token per user at a time).
- **bcryptjs instead of native bcrypt:** the handbook suggests `bcrypt`; this project uses `bcryptjs` (a
  pure-JS, API-compatible implementation) to avoid native build tooling (`node-gyp`) in constrained/offline
  build environments and slimmer Docker images. Hashing behavior and security properties are equivalent.
- **Notifications, activity log, CSV export:** not yet implemented — natural "enhancement" candidates once
  the core rubric is fully covered.
- **This repository was assembled in a sandboxed environment without outbound access to Docker Hub, GitHub
  release assets, or `binaries.prisma.sh`.** Dependency installation, linting, type-checking, and unit tests
  were verified to run and pass in that sandbox; `prisma generate` (which downloads a query-engine binary)
  and live deployment could not be executed there. Both work normally with standard internet access — run
  `npm run prisma:generate` once after `npm install` in your own environment, and `docker compose up --build`
  to bring up the full stack.
