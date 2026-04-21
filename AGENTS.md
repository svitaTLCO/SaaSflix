# AGENTS.md

## Mission

Build and evolve a creator-led software studio platform where subscribers get access to every published app, follow releases and experiments, participate in community/support discussions, and experience the platform as one coherent digital universe.

This repository is not a generic SaaS starter. It is the control plane, storefront, membership system, launch system, and community shell for a growing ecosystem of products.

## Instruction hierarchy

This file is the operational control layer for Codex. Use it together with:

- `PLANS.md` for execution strategy and delivery sequencing.
- `docs/product-vision.md` for product positioning and platform definition.
- `docs/visual-design.md` for design language and UX rules.
- `docs/backend-architecture.md` for domain model, APIs, and backend patterns.
- `docs/frontend-architecture.md` for frontend structure and rendering strategy.
- `docs/infrastructure.md` for deployment, environments, observability, and delivery.
- `docs/security-performance.md` for security, privacy, and performance rules.
- `docs/app-registry-and-drops.md` for product publishing, release, and lifecycle logic.
- `docs/community-and-support.md` for feed, community, support, and moderation flows.

If a task is large, ambiguous, or spans multiple domains, consult the relevant document before editing code.

## Product pillars

The platform must always preserve these pillars:

1. **Creator-led identity**  
   The platform reflects the founder's ideas, launches, experiments, and worldview.
2. **Unified membership**  
   One account and one subscription unlock the ecosystem.
3. **Launch culture**  
   New releases, drops, betas, and changelogs are first-class product surfaces.
4. **Community plus support**  
   Discussion, feedback, and support must feel alive, useful, and product-native.
5. **Production readiness**  
   Reliability, accessibility, observability, and security are baseline requirements.

## Target stack

Unless a task explicitly requires a justified exception, assume the following default stack:

- **Web shell:** Next.js App Router with React and TypeScript
- **Primary database:** PostgreSQL
- **Cache / coordination:** Redis
- **Background work:** queue-backed jobs
- **Object storage:** S3-compatible
- **Search:** dedicated search/indexing layer
- **Observability:** OpenTelemetry-compatible instrumentation
- **Infrastructure as code:** Terraform
- **Deployment:** containerized workloads with progressive delivery support

Prefer a **modular monolith with event-driven boundaries** over premature microservices.

## Architecture rules

- Keep platform concerns centralized: identity, billing, entitlements, app registry, feed, support, notifications, audit, and analytics.
- Treat published apps as first-class platform objects, not hardcoded links.
- Separate public, member, and admin surfaces cleanly.
- Prefer explicit domain modules over generic utility sprawl.
- Use typed contracts for all API boundaries.
- Design code so future native apps and external product surfaces can reuse the same platform APIs.
- Use feature flags and configuration, not hardcoded environment-specific branching.

## Coding rules

- Use TypeScript with strict typing.
- Avoid `any` unless a task explicitly documents why it is unavoidable.
- Keep modules cohesive and name things by domain intent, not technical accident.
- Prefer pure functions for business rules and thin adapters for I/O.
- Validate all external inputs at boundaries.
- Model failure states explicitly.
- Keep side effects observable and auditable.
- Do not introduce dead abstractions or speculative generalization.

## UX and accessibility rules

- Accessibility is not optional.
- All interactive features must be keyboard-usable.
- Always provide visible focus states.
- Form validation must be understandable and recoverable.
- Motion must be tasteful and reducible.
- Loading, empty, error, and success states are required, not later polish.
- The visual language must feel premium, consistent, and authored.

## Security rules

- Treat auth, billing, entitlements, media upload, and admin tooling as high-risk surfaces.
- Never bypass authorization because a route is "internal."
- Protect all state-changing operations against replay, tampering, and abuse.
- Prefer passkey-capable auth architecture and modern session design.
- Log privileged actions and security-relevant events.
- Never commit secrets or fabricate credentials.

## Performance rules

- Prefer server rendering for content-rich and SEO-important surfaces.
- Keep client bundles intentional.
- Use caching deliberately.
- Avoid waterfalls in member dashboard and app library flows.
- Treat Core Web Vitals and API latency as release criteria, not later optimization.

## Testing and verification

Before considering a task complete, verify as many of these as the current repo state allows:

- typecheck
- lint
- unit tests for domain logic
- integration tests for critical flows
- accessibility checks for affected UI
- security-sensitive paths reviewed for authn/authz correctness
- telemetry added or updated for important new flows

If the repo does not yet contain the necessary tooling, scaffold it in the direction described in the docs rather than ignoring verification.

## Definition of done

A change is not done when it merely compiles. It is done when:

- it aligns with the product vision,
- respects design and architecture documents,
- is production-minded,
- is testable,
- is observable,
- and does not weaken security, accessibility, or maintainability.

## Delivery behavior

For large features:

1. read the relevant docs,
2. produce or update a concrete execution plan,
3. implement in coherent slices,
4. verify,
5. leave the codebase cleaner than it was.

Do not drift into generic dashboard SaaS patterns. Build the platform as a software studio operating system.
