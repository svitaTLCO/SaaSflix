# SaaSflix

> **A creator-led software studio operating system** — one membership, one identity, one evolving universe of apps, drops, community, and support.

[![Monorepo](https://img.shields.io/badge/repo-monorepo-111827?style=for-the-badge)](#)
[![TypeScript](https://img.shields.io/badge/language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Next.js](https://img.shields.io/badge/web-Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](#)
[![PNPM](https://img.shields.io/badge/package_manager-pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](#)
[![License](https://img.shields.io/badge/license-Private-6B7280?style=for-the-badge)](#)

---

## ✨ What is SaaSflix?

SaaSflix is the platform layer behind a **creator-led studio** where members subscribe once and unlock an expanding software ecosystem.

It combines:

- **Membership + identity** (accounts, plans, access)
- **App library + launcher** (published products as first-class platform objects)
- **Drops + release motion** (launches, changelogs, betas)
- **Community + support** (discussion and help embedded in product context)
- **Creator feed** (updates, notes, and direction from the founder)

This repository is the shared control plane powering public, member, admin, and operational surfaces.

---

## 🧱 Monorepo at a glance

```text
apps/
  web/        Public + member experience (Next.js App Router)
  admin/      Admin operations surface (Next.js App Router)
  worker/     Background job runtime

packages/
  domain/*    Core platform domain modules (billing, releases, feed, etc.)
  contracts/  Shared typed API/domain contracts
  security/   Security-centric helpers and primitives
  telemetry/  Observability primitives and instrumentation helpers
  config/     Shared configuration utilities
  application/ Application-level orchestration

infra/
  terraform/  Infrastructure as code scaffolding
  k8s/        Container orchestration manifests
  docker/     Local/staging container definitions
  runbooks/   Operational runbooks and procedures
  scripts/    Infrastructure-related helper scripts

docs/
  Product, architecture, design, infra, security, and lifecycle docs

tests/
  Cross-surface testing assets (including e2e)
```

---

## 🚀 Quick start

### 1) Prerequisites

- **Node.js 20+**
- **pnpm 9+**
- Optional: Docker for local infra workflows

### 2) Install dependencies

```bash
pnpm install
```

If your environment requires npm registry auth, export a read-only `NPM_TOKEN` first:

```bash
export NPM_TOKEN=your_token_here
pnpm install
```

### 3) Run checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm check
```

### 4) Run apps (examples)

```bash
pnpm --filter @saasflix/web dev
pnpm --filter @saasflix/admin dev
pnpm --filter @saasflix/worker dev
```

> Package names can vary over time; inspect each app's `package.json` scripts if needed.

---

## 🧭 Product philosophy

SaaSflix is designed around five non-negotiable product pillars:

1. **Creator-led identity**
2. **Unified membership**
3. **Launch culture**
4. **Community + support as core product layers**
5. **Production readiness by default**

If a change weakens one of these pillars, it likely needs to be redesigned.

---

## 🏗️ Platform architecture principles

- Prefer a **modular monolith** with clear domain boundaries.
- Keep identity, billing, entitlements, registry, and moderation as platform-level concerns.
- Treat app metadata and lifecycle state as **data**, not hardcoded UI.
- Use typed contracts at all API boundaries.
- Keep business logic in domain/application modules; keep I/O adapters thin.
- Build with observability, accessibility, and security as baseline constraints.

---

## 📚 Documentation map

Use these docs as source-of-truth before major changes:

- [`PLANS.md`](./PLANS.md) — planning + delivery sequencing
- [`docs/product-vision.md`](./docs/product-vision.md) — positioning and product definition
- [`docs/visual-design.md`](./docs/visual-design.md) — visual language + UX rules
- [`docs/frontend-architecture.md`](./docs/frontend-architecture.md) — frontend structure and rendering strategy
- [`docs/backend-architecture.md`](./docs/backend-architecture.md) — domain model + APIs
- [`docs/infrastructure.md`](./docs/infrastructure.md) — environments and deployment strategy
- [`docs/security-performance.md`](./docs/security-performance.md) — security + performance requirements
- [`docs/app-registry-and-drops.md`](./docs/app-registry-and-drops.md) — publishing and release lifecycle
- [`docs/community-and-support.md`](./docs/community-and-support.md) — discussions, support, moderation flows
- [`docs/launch-readiness-checklist.md`](./docs/launch-readiness-checklist.md) — pre-launch quality bar

---

## 🔐 Security and quality baseline

Before shipping meaningful changes, this project expects verification across:

- Type safety
- Linting
- Unit/integration coverage for affected domains
- Accessibility checks for affected UI
- Authorization/authentication review on sensitive paths
- Telemetry updates for important flows

**Definition of done:** passing code is not enough — changes must be testable, observable, secure, and aligned with product vision.

---

## 🛠️ Common commands

```bash
# workspace quality gates
pnpm lint
pnpm typecheck
pnpm test
pnpm check

# targeted package checks
pnpm --filter <package-name> test
pnpm --filter <package-name> typecheck

# formatting (if configured in package scripts)
pnpm format
```

---

## 🌍 Environment setup

- Copy and configure environment variables from [`.env.example`](./.env.example).
- Keep secrets out of source control.
- Use runbooks in [`infra/runbooks`](./infra/runbooks) for environment-specific operational flows.

---

## 🤝 Contributing

1. Read the relevant architecture/product docs first.
2. For non-trivial work, create a concrete plan.
3. Implement in vertical slices (domain → API → UI → telemetry/tests).
4. Run quality gates before opening a PR.
5. Keep the platform coherent — avoid generic SaaS drift.

---

## 📄 License

Internal/private project unless stated otherwise by repository owners.
