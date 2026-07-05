# Deployment Guide

This app is designed to deploy as two independent services plus a managed database, matching the handbook's
recommended hosting split.

## 1. Database — Render Postgres / Supabase / Neon

1. Create a managed Postgres instance on your provider of choice.
2. Copy the connection string it gives you — this becomes `DATABASE_URL` for the backend.
3. Ensure the instance allows connections from your backend host (most managed Postgres providers do this
   automatically for same-provider deploys; for cross-provider deploys, allow-list the backend's egress IP
   or use a connection pooler URL if provided).

## 2. Backend — Render / Railway (Docker-native)

1. Create a new **Web Service** from your GitHub repo, root directory `backend/`, using the provided
   `Dockerfile` (Render/Railway both auto-detect it).
2. Set environment variables in the host's dashboard (never commit these):
   - `DATABASE_URL` (from step 1)
   - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — long random strings (e.g. `openssl rand -hex 32`)
   - `CLIENT_ORIGIN` — your deployed frontend's origin (e.g. `https://taskflow-yourname.vercel.app`)
   - `NODE_ENV=production`
3. On first deploy, run migrations + seed once (Render/Railway both support one-off "Jobs"/shell commands):
   ```bash
   npx prisma migrate deploy
   node dist/prisma/seed.js
   ```
   (Subsequent deploys via the CI/CD pipeline's `command:` in `docker-compose.yml`-equivalent start script
   already run `migrate deploy` automatically before starting the server — see the backend Dockerfile/CMD.)
4. Confirm `GET /health` returns `200 { "status": "ok" }` on the public URL.
5. Copy the backend's deploy hook URL into the `RENDER_DEPLOY_HOOK` GitHub secret so CI can trigger
   redeploys automatically after a successful build.

## 3. Frontend — Vercel / Netlify

1. Import the repo, set the root directory to `frontend/`.
2. Build command: `npm run build`. Output directory: `dist`.
3. Set the build-time env var `VITE_API_URL` to your deployed backend's URL (from step 2).
4. Copy the project's deploy hook URL into the `VERCEL_DEPLOY_HOOK` GitHub secret.

## 4. Wire up CI/CD secrets

In your GitHub repo → **Settings → Secrets and variables → Actions**, add:

| Secret | Value |
| ------ | ----- |
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | A Docker Hub access token (Account Settings → Security) |
| `RENDER_DEPLOY_HOOK` | Backend deploy hook URL from step 2 |
| `VERCEL_DEPLOY_HOOK` | Frontend deploy hook URL from step 3 |

And under **Variables**, optionally set `VITE_API_URL` so the frontend CI build embeds the right API URL.

## 5. Verify

- `docker compose up --build` succeeds locally with no manual fixes.
- Push to `main` → both GitHub Actions workflows go green.
- Live frontend loads, registers a user, creates a project/task.
- Live backend `/health` returns 200 and `/api-docs` renders Swagger UI.

## Rollback

Both Vercel/Netlify and Render/Railway keep prior deploys and support one-click rollback from their
dashboards — use that for a fast recovery if a `main` deploy regresses, then fix forward on a branch.
