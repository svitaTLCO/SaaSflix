---
name: frontend-system
description: Use this skill for any UI work that should align with the platform shell, design system, accessibility standards, and premium product feel.
---

# Frontend System Skill

## When to use

Use this skill when implementing or refactoring:

- public marketing pages
- member shell routes
- app library or app detail pages
- release pages
- feed or discussion surfaces
- support flows
- notifications
- profile, billing, or security settings
- reusable UI components

## What to do

1. Read:
   - `AGENTS.md`
   - `docs/visual-design.md`
   - `docs/frontend-architecture.md`

2. Determine:
   - which experience zone the UI belongs to
   - required states: loading, empty, error, success
   - access / entitlement states
   - accessibility requirements
   - telemetry needs

3. Build using:
   - shared components where possible
   - server-first patterns where sensible
   - controlled client interactivity
   - semantic structure
   - visible focus and keyboard support

4. Verify:
   - responsiveness
   - accessibility
   - visual consistency
   - failure-state quality

## Guardrails

- Do not create one-off styling when a system component should exist.
- Do not ship visually "working" UI that lacks empty/error/loading states.
- Do not add motion that reduces clarity.
- Do not let the platform drift into generic admin-dashboard aesthetics.
