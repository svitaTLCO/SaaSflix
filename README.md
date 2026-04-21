# SaaSflix Platform Monorepo (M0)

Production-first workspace scaffold for the creator-led software studio platform.

## Workspace commands

- `pnpm install`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm check`

## Structure

- `apps/web`: public + member shell (Next.js)
- `apps/admin`: admin shell (Next.js)
- `apps/worker`: background worker runtime
- `packages/*`: shared platform libraries
- `infra/*`: infrastructure placeholders for Terraform, deploy manifests, monitoring, runbooks
- `tests/*`: cross-surface test suites

## Registry authentication

This environment may require npm authentication to install workspace dependencies.

1. Create a read-only npm token.
2. Export `NPM_TOKEN` in your shell or CI secret store.
3. Run `pnpm install`.

The workspace `.npmrc` is configured to forward `NPM_TOKEN` to `registry.npmjs.org`.
