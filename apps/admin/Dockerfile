FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @saasflix/admin build

FROM node:22-alpine AS runner
WORKDIR /app
RUN corepack enable
COPY --from=builder /app .
EXPOSE 3001
CMD ["pnpm", "--filter", "@saasflix/admin", "start", "--", "-p", "3001"]
