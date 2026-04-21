---
name: secure-implementation
description: Use this skill for auth, billing, webhooks, uploads, admin tools, moderation, or any feature that materially affects security, privacy, or abuse resistance.
---

# Secure Implementation Skill

## When to use

Use this skill when touching:

- login, session, recovery, or device management
- billing or payment-provider integration
- subscription state and entitlements
- file upload or media processing
- moderation or admin controls
- public input surfaces such as comments or support threads
- feature-flag or privileged internal operations

## What to do

1. Read:
   - `AGENTS.md`
   - `docs/security-performance.md`
   - relevant backend and frontend architecture docs

2. Identify:
   - trust boundaries
   - attack surface
   - authorization points
   - replay or idempotency requirements
   - abuse vectors
   - audit requirements

3. Enforce:
   - input validation
   - output safety
   - authn/authz correctness
   - rate limiting or anti-abuse where needed
   - logging and audit for privileged operations

4. Test:
   - success case
   - denial case
   - malformed input
   - replay or duplication case where relevant

## Guardrails

- Never rely on hidden UI alone for protection.
- Never grant entitlements from unverified external state.
- Never accept uploads without type, size, and validation rules.
- Never add privileged actions without audit logging.
