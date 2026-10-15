
# syntax=docker/dockerfile:1.7

# ---------- Dependencies stage ----------
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@11.20.0 --activate

# Copy lockfile and manifest first
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install all dependencies (including dev) for the build
RUN pnpm install --frozen-lockfile

# ---------- Build stage ----------
FROM node:22-alpine AS build
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.20.0 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_DEFAULT_TECHNICIAN_ID

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID} \
    NEXT_PUBLIC_DEFAULT_TECHNICIAN_ID=${NEXT_PUBLIC_DEFAULT_TECHNICIAN_ID} \
    NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# ---------- Runtime stage ----------
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copy standalone server output and static assets
COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
