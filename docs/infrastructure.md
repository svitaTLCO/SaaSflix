# Infrastructure

## Objective

Operate the platform with production-grade reliability, repeatability, observability, and release safety.

Infrastructure must support a creator-led platform that is always evolving, which means deployment agility matters as much as uptime.

## Core principles

### Immutable delivery
Deploy build artifacts, not ad hoc server mutations.

### Environment parity
Keep local, preview, integration, staging, and production behavior aligned as much as practical.

### Infrastructure as code
Everything significant should be declarative and reviewable.

### Safe releases
Support canaries, rollbacks, and staged exposure.

### Observable systems
Logs, metrics, traces, alerts, and runbooks are part of the platform, not separate cleanup work.

## Environments

Define at least:

- local
- preview per branch or PR where feasible
- integration
- staging
- production

Each environment should have:

- clearly scoped secrets
- controlled external integrations
- seeded or synthetic test data where appropriate
- deployment ownership and promotion rules

## Platform services

The exact providers may change, but infrastructure should cover these responsibilities:

### Compute
Containerized runtime for platform services and workers.

### Database
Managed PostgreSQL with backups, point-in-time recovery if available, and migration controls.

### Cache and coordination
Redis or equivalent for cache, short-lived coordination, rate limiting, and background work support.

### Object storage
S3-compatible bucket(s) for media, screenshots, uploads, downloadable artifacts, and release assets.

### Messaging / async processing
Queue or stream infrastructure for background jobs and domain events.

### Search
Dedicated indexing/search service if search quality exceeds simple DB search needs.

### CDN / edge
Fast delivery for static assets, media, and cacheable public surfaces.

### Secrets management
Central secret storage with rotation support and environment scoping.

## Repository guidance

Prefer an infrastructure layout such as:

- `infra/terraform`
- `infra/k8s` or platform deployment manifests
- `infra/scripts`
- `infra/runbooks`
- `infra/monitoring`

Do not bury deployment logic inside unrelated application folders.

## CI/CD

**Current repository baseline (M13):**
- CI workflow scaffold at `.github/workflows/ci.yml` running install + `pnpm check` on push/PR
- staging deployment compose stack and Dockerfiles for web/admin/worker
- launch-readiness checklist and staging deploy runbook documented for security/performance/ops gates

The delivery pipeline should support:

- dependency install with lockfiles
- lint and type checks
- unit and integration tests
- security scanning
- artifact build
- artifact signing where enabled
- environment deployment
- post-deploy verification
- rollback hooks

Every deployment should be traceable to:
- commit,
- build artifact,
- environment,
- operator or automation source.

## Progressive delivery

Support release controls such as:

- canary rollout
- blue/green or weighted traffic shift
- feature flags
- kill switches
- emergency rollback

High-risk changes should be releasable independently from deploys via configuration or flags where possible.

## Configuration management

- keep configuration explicit
- validate configuration at startup
- separate secrets from non-secret config
- document environment variables
- avoid silent fallback behavior for critical settings

## Data protection and recovery

Define and automate:

- backup schedule
- retention period
- restore procedures
- restore verification drills
- disaster recovery contacts and responsibilities

Document target RPO and RTO even if they evolve over time.

## Observability

Infrastructure must support collection and retention of:

- structured logs
- traces
- metrics
- uptime probes
- job processing metrics
- alerting events

Create dashboards at minimum for:
- auth/sign-in
- subscription and webhook health
- app library load
- release publishing
- discussion/commenting
- support operations
- background queues
- database health
- cache health
- deployment status

## Scaling strategy

Start with vertical simplicity but design for horizontal scaling where justified.

Likely scaling levers:

- web shell replicas
- worker replicas
- queue throughput
- read replicas or query optimization
- search/index tuning
- CDN cache performance
- media transformation offload

## Security-related infrastructure responsibilities

- network segmentation where practical
- WAF / bot protection
- TLS management
- secret rotation
- artifact provenance
- vulnerability scanning
- administrative access controls
- audit trails for infrastructure changes

## Cost discipline

The infrastructure plan should include cost awareness:

- environment shutdown rules for previews
- log retention policies
- media lifecycle policies
- cache hit-rate improvement
- right-sized compute defaults

## Non-negotiable outcome

Infrastructure must let the platform ship frequently without becoming fragile, opaque, or operationally reckless.
