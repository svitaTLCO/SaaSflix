# PLANS.md

## Purpose

This file tells Codex how to approach substantial work in this repository.

Use it whenever the task:

- spans multiple modules,
- affects architecture,
- introduces a new product surface,
- changes auth, billing, subscription, entitlements, feed, support, or release flows,
- requires new infrastructure,
- or materially affects security, accessibility, or performance.

## Planning rules

For non-trivial work, create a written plan before major edits. The plan may live in the task response, an issue, or a temporary implementation note, but it must be concrete.

A good plan includes:

- objective
- impacted domains
- user-facing behavior
- data model changes
- API changes
- UI changes
- background jobs / events
- observability updates
- security implications
- testing strategy
- rollout / migration notes

Do not jump directly into code for cross-cutting changes.

## Delivery slices

Prefer vertical slices over horizontal bulk rewrites.

Example:

- first add schema and domain model,
- then add API route and authorization,
- then add UI surface,
- then add telemetry and tests,
- then wire background jobs or notifications.

Avoid opening many partial fronts that remain unfinished.

## Default sequencing by domain

### Product and community features
1. domain and lifecycle model
2. storage and indexing
3. service layer
4. API contract
5. UI surfaces
6. notifications / side effects
7. moderation / abuse controls
8. observability and verification

### Billing and access control
1. plan / entitlement model
2. webhook or provider event handling
3. idempotency and audit
4. enforcement points in APIs and UI
5. upgrade / downgrade edge cases
6. test matrices
7. admin tooling and diagnostics

### New published app integration
1. app registry entry model
2. launch and status metadata
3. entitlement mapping
4. member-facing app page
5. launcher integration
6. analytics and release surfaces
7. community/support attachment
8. archival / deprecation behavior

### Infrastructure work
1. desired state and constraints
2. IaC updates
3. environment variable contract
4. deployment strategy
5. monitoring and alerts
6. rollback path
7. runbook updates

## Quality gates

A plan should explicitly state:

- how authorization is enforced,
- how the change is tested,
- how it is monitored,
- how it fails safely,
- how it is rolled back or migrated.

If any of these are unclear, the plan is incomplete.

## Documentation updates

Whenever a change materially alters behavior or architecture, update the relevant markdown document under `docs/`.

At minimum update:

- `docs/product-vision.md` for product-level changes,
- `docs/backend-architecture.md` for domain/API changes,
- `docs/frontend-architecture.md` for new member/public/admin flows,
- `docs/infrastructure.md` for environment/deployment changes,
- `docs/security-performance.md` for threat-sensitive or performance-sensitive changes.

## Anti-patterns

Do not:

- implement hidden business rules in UI only,
- hardcode plan tiers deep inside random components,
- encode app metadata directly into routes instead of the app registry,
- bypass feature flags for staged releases,
- introduce fragile cross-module imports,
- mix admin-only logic into public/member clients,
- treat support, feed, and comments as unrelated systems if they share the same discussion primitives.

## Default repository evolution goals

If scaffolding the repo from scratch, move toward this structure:

- `apps/` for deployable surfaces
- `packages/` for shared libraries
- `services/` only if and when extraction becomes justified
- `infra/` for infrastructure as code and delivery config
- `docs/` for platform source-of-truth documents
- `tests/` or colocated tests as appropriate

## Final check

Before finishing a substantial task, confirm:

- the implementation fits the platform vision,
- the data model is intentional,
- permissions are correct,
- the UX respects design rules,
- the change is observable,
- and the docs remain accurate.
