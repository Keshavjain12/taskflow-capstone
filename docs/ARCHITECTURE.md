# Architecture

## System overview

```
┌──────────────────┐      HTTPS/JSON      ┌───────────────────────┐      TCP       ┌──────────────────┐
│   React SPA       │ ───────────────────▶ │  Node.js / Express     │ ─────────────▶ │   PostgreSQL       │
│   (Vite, nginx)    │ ◀─────────────────── │  REST API (/api/v1)    │ ◀───────────── │   (Prisma ORM)     │
└──────────────────┘                       └───────────────────────┘                └──────────────────┘
```

Frontend and backend are built and deployed as independent containers; they only communicate over the
network via the versioned REST API, never by sharing code or a database connection.

## Backend layering

```
routes/         →  controllers/       →  services/            →  Prisma (config/db.ts)
(HTTP + Zod        (parse req,           (business logic +        (typed queries against
 validation +       call service,         authorization,           PostgreSQL)
 OpenAPI docs)       shape response)      Prisma calls)
```

- **Routes** declare the URL/method/middleware chain and carry the `@openapi` JSDoc that feeds Swagger.
- **Controllers** are intentionally thin — no business logic, just req → service → res.
- **Services** own authorization (e.g. `assertProjectMember`/`assertProjectOwner`), validation-adjacent
  business rules, and all Prisma calls. This keeps controllers testable/mockable and business logic reusable.
- **Centralized error handling**: any service can `throw new AppError(...)` (or let a Prisma error bubble
  up); `middlewares/errorHandler.ts` is the single place that maps errors → HTTP status + JSON shape, so
  every endpoint returns errors consistently without repeating try/catch boilerplate.

## Data model

```
User ──1───────N── Project        (User.id = Project.ownerId)
User ──N───────N── Project        (through ProjectMember, role-scoped: OWNER | MEMBER)
Project ──1─────N── Task
User ──1───────N── Task           (as assignee, nullable — SET NULL on user delete)
User ──1───────N── Task           (as creator — CASCADE on user delete)
```

Indexes: `users.email` (unique + lookup), `projects.ownerId`, `project_members(projectId, userId)` (unique
composite — prevents duplicate memberships), `tasks.projectId`, `tasks.status`, `tasks.assigneeId`.

## Auth flow

1. **Register/Login** → bcryptjs-hashed password verified → server issues a short-lived access token
   (15 min, carries `sub`/`email`/`role`) and a long-lived refresh token (7 days). The refresh token's
   **hash** (not the raw token) is stored on the user row, so a leaked database dump alone can't be used to
   mint new sessions.
2. **Authenticated requests** send `Authorization: Bearer <accessToken>`; `middlewares/auth.ts` verifies the
   signature/expiry and attaches `req.user`.
3. **On 401**, the frontend's axios interceptor (`frontend/src/api/client.ts`) transparently calls
   `/api/v1/auth/refresh` once, retries the original request with the new access token, and only redirects
   to `/login` if the refresh itself fails — so a 15-minute access-token expiry never interrupts the user.
4. **Logout** clears the stored refresh-token hash server-side (revocation) in addition to clearing client
   state.
5. **Authorization** beyond "is logged in" is resource-scoped: every project/task operation calls
   `assertProjectMember`/`assertProjectOwner`, which checks the `ProjectMember` join row rather than a
   global role — a user can be an `OWNER` on one project and have no access to another.

## Frontend architecture

- **Server state** (projects, tasks, current user) lives entirely in **TanStack Query** — no manual
  `useEffect` + `fetch` + `useState` fetching. Mutations invalidate the relevant query keys; task status
  updates use an **optimistic update** (`onMutate`) with rollback on error so drag-free status changes feel
  instant.
- **Client-only state** (JWT pair, current user object) lives in a small **Zustand** store, persisted to
  `localStorage` so a refresh doesn't log the user out.
- **Routing**: `react-router-dom` with a `ProtectedRoute` wrapper that redirects unauthenticated users to
  `/login`.
- **UX states**: every data view explicitly renders loading (skeletons), empty, and error states rather than
  a bare spinner or blank screen — this is called out explicitly in the handbook's evaluation rubric.

## Why these tradeoffs

- **Monorepo, two workspaces** — lets CI scope backend/frontend pipelines independently (`paths:` filters)
  while keeping one source of truth for the whole capstone.
- **Zod at the boundary, Prisma types internally** — request validation and database types are two different
  concerns; conflating them (e.g. validating with Prisma-generated types) tends to leak internal shape into
  the public API contract.
- **bcryptjs over bcrypt** — pure JS, no native compilation step, smaller/simpler Docker images, identical
  hashing behavior; see `README.md` → Known limitations for the full rationale.
