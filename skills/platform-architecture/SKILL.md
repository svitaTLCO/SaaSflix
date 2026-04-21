---
name: platform-architecture
description: Use this skill when designing or implementing cross-cutting platform architecture such as identity, billing, entitlements, app registry, releases, community, support, or modular boundaries.
---

# Platform Architecture Skill

## When to use

Use this skill when the task:

- spans multiple platform domains,
- introduces a new app lifecycle concept,
- changes how apps are registered or launched,
- affects membership or entitlement logic,
- or risks turning the repo into a pile of disconnected feature code.

## What to do

1. Read:
   - `AGENTS.md`
   - `PLANS.md`
   - `docs/product-vision.md`
   - `docs/backend-architecture.md`
   - `docs/app-registry-and-drops.md`

2. Identify:
   - affected domains
   - source of truth for new state
   - lifecycle and status implications
   - authorization implications
   - event and notification implications
   - observability requirements

3. Propose:
   - domain model changes
   - service boundaries
   - API contract changes
   - migration strategy
   - rollout plan

4. Implement in vertical slices.

5. Update docs if architecture behavior changes.

## Guardrails

- Do not hardcode app metadata into page components.
- Do not leak billing or entitlement logic into random utilities.
- Do not create a microservice unless there is real operational justification.
- Keep platform vocabulary consistent.
