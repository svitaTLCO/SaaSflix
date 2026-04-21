# Milestone Clean & Security Log

## Policy
Before starting each milestone, run workspace verification and confirm boundary validation + authz implications for the affected high-risk surfaces.

## Executed checks
- Pre-M6: `pnpm install`, `pnpm check`
- Pre-M7: `pnpm install`, `pnpm check`
- Pre-M8: `pnpm check`
- Pre-M9: `pnpm check`
- Pre-M10: `pnpm check`
- Pre-M11: `pnpm check`
- Pre-M14: `pnpm install`, `pnpm check`

## Security focus by milestone
- M6: discussion content safety + visibility/moderation controls
- M7: support visibility, transition integrity, knowledge-promotion eligibility
- M8: notification preference gating and read-state validation
- M9: media namespace + MIME/size + timestamp validation
- M10: search type scoping and deterministic scoring helpers
- M11: analytics event timestamp/type validation

- M14: staging env schema enforcement, health endpoints, container runtime boundaries, and deploy runbook
