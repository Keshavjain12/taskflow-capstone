# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app
# Prisma's engines are linked against OpenSSL; Alpine ships OpenSSL 3 only,
# and Prisma's auto-detect can miss it without the package explicitly present.
RUN apk add --no-cache openssl
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
RUN npm run prisma:generate
RUN npm run build

# ---- Production runtime stage ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S nodejs && adduser -S taskflow -G nodejs
RUN apk add --no-cache wget openssl

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
RUN npm ci --omit=dev && npm run prisma:generate
COPY --from=builder /app/dist ./dist
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Non-root user needs write access to node_modules/@prisma at runtime
# (prisma migrate deploy touches its engine cache on first run).
RUN chown -R taskflow:nodejs /app

USER taskflow
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:4000/health || exit 1

# start.sh runs migrate deploy -> best-effort seed -> the server. Kept as a
# real script (not a PaaS "start command" one-liner) since dashboard text
# boxes have repeatedly mishandled shell operators like && / || / ().
CMD ["./start.sh"]
