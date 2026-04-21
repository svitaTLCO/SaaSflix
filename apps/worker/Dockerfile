FROM node:22-alpine
WORKDIR /app
RUN corepack enable
COPY . .
RUN pnpm install --frozen-lockfile
CMD ["pnpm", "--filter", "@saasflix/worker", "dev"]
