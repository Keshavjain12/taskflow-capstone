#!/bin/sh
# Production boot sequence: migrate the database, seed demo data (best-effort,
# never fatal), then start the API. Kept as a real script file (instead of a
# one-line command typed into Render's dashboard) because PaaS "start command"
# text boxes have repeatedly proven unreliable at parsing shell operators like
# && / || / () — a real script removes that ambiguity entirely.
set -e

echo "==> Running database migrations..."
npx prisma migrate deploy

echo "==> Seeding demo data (best-effort)..."
node dist/prisma/seed.js || echo "==> Seed step failed — continuing without demo data."

echo "==> Starting API server..."
exec node dist/src/server.js
