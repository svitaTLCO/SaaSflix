# Staging Deploy Runbook

## Preconditions
- `pnpm check` passes on target commit.
- Staging environment variables satisfy `pnpm staging:check-env`.
- Docker daemon is available.

## Deploy
1. `docker compose -f infra/docker/docker-compose.staging.yml build`
2. `docker compose -f infra/docker/docker-compose.staging.yml up -d`
3. Validate health endpoints:
   - `curl http://localhost:3000/api/health`
   - `curl http://localhost:3001/api/health`

## Rollback
1. `docker compose -f infra/docker/docker-compose.staging.yml down`
2. Checkout previous known-good commit.
3. Repeat build + up steps.

## Post-deploy checks
- Verify app/member/admin surfaces load.
- Verify queue worker starts and logs event intake.
- Verify DB and cache connectivity.
