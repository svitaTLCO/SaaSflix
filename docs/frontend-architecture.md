# Frontend Architecture

## Objective

Build a frontend system that delivers a premium, coherent, high-performance platform shell while allowing many apps, releases, and community surfaces to live inside one universe.

The frontend must support three main experiences:

- public discovery and conversion,
- member experience and routine use,
- admin operations.

## Frontend philosophy

### Platform shell first
The platform shell owns navigation, identity, entitlements, feed, discovery, notifications, and support. Individual apps plug into it.

### Server-first where sensible
Prefer server-rendered or server-driven surfaces for content-rich pages, SEO-sensitive views, and fast initial loading. Use client interactivity intentionally.

### Shared primitives
All major frontend surfaces should use the same design system, data-fetching conventions, telemetry hooks, and access-control patterns.

### Clear surface separation
Do not mix public, member, and admin responsibilities inside the same ad hoc page components.

## Suggested top-level app structure

If using a monorepo, aim toward a layout such as:

- `apps/web` for the public and member shell
- `apps/admin` if admin becomes substantially distinct
- `packages/design-system`
- `packages/platform-sdk`
- `packages/auth-sdk`
- `packages/telemetry`
- `packages/config`
- `packages/eslint-config`
- `packages/tsconfig`

If keeping one frontend app initially, preserve equivalent internal module boundaries.

## Major frontend surfaces

**Current repository baseline (M12):**
- member shell route scaffolds for feed/library/drops/roadmap/support/discussions/notifications/profile/billing/security
- admin shell route scaffolds for registry/releases/moderation/support/analytics/feature flags
- route-level surface access checks retained for member and admin groups

### Public site
- homepage
- pricing
- philosophy / about
- app previews
- release previews
- sign in / sign up entry points

### Member shell
- home
- feed
- app library
- app detail page
- drops / releases
- roadmap / upcoming
- notifications
- profile
- billing
- security settings
- support
- discussions

### Admin shell
- app registry editor
- release publishing
- moderation tools
- support tooling
- analytics views
- feature flag controls
- subscription diagnostics

## Routing strategy

Use route groups or equivalent organizational patterns to separate:

- public
- authenticated member
- admin

Each route must clearly declare whether it requires:
- authentication,
- a minimum plan,
- or elevated privileges.

## Data access strategy

Establish a consistent strategy for:

- server data loading
- client-side mutations
- optimistic updates only when rollback is safe
- cache invalidation
- pagination and infinite loading
- stale versus real-time surfaces

High-value real-time or near-real-time candidates:
- notifications
- live comment updates on active release discussions
- support status changes where useful

## UI state strategy

Separate:

- server truth,
- local interaction state,
- transient view state,
- and draft / composer state.

Avoid global-state overuse. Reserve shared state for truly cross-route concerns such as session, feature flags, and user preferences.

## Access control in the frontend

The frontend should reflect access state, but never be the only enforcement layer.

UI responsibilities include:
- communicate why something is locked
- show available upgrades or request paths
- prevent confusing dead-end navigation
- distinguish unavailable, upcoming, beta-only, and archived states clearly

## App integration model

Every app should have a platform-facing record and frontend entry surface.

The member frontend should support:

- app launcher card
- app detail page
- release history
- entitlement state
- linked support and discussion entry points
- related founder posts
- install/open actions if relevant
- platform wrapper for embedded experiences where justified

## Feed and community UX architecture

The creator feed and discussion system are central, not add-ons.

Frontend requirements include:

- readable post rendering
- linkable release cards inside posts
- rich but controlled media presentation
- thread view with nested replies or constrained reply depth
- reactions
- watches / follows
- moderation states and message clarity
- support thread differentiation

## Search UX architecture

Search should eventually support:

- apps
- releases
- posts
- support answers
- roadmap entries if visible

Search UI needs:
- quick open
- scoped results
- clear result types
- recent and suggested results
- empty-state guidance

## Performance rules

- keep route-level JS budgets intentional
- prefer streaming and suspense thoughtfully
- lazy-load heavy member-only or admin-only modules
- avoid blocking dashboard loads on secondary data
- prefetch judiciously for high-likelihood navigation paths
- optimize images and media delivery

## Error handling

The frontend must provide user-quality failures for:

- auth expiry
- lost entitlement
- payment issues
- failed comment or support submission
- unavailable app integration
- release not yet accessible
- archived app state

Never expose raw backend errors without product-quality translation.

## Accessibility

Requirements include:

- semantic structure
- focus management
- keyboard usage
- accessible modal and menu behavior
- screen-reader friendly announcements for dynamic updates
- reduced motion support
- readable validation and inline errors

## Testing strategy

Required frontend test categories:

- component tests for critical UI primitives
- route-level integration tests
- accessibility checks for major screens
- visual regression for design-system-sensitive surfaces
- end-to-end tests for major flows:
  - sign in
  - browse app library
  - open an entitled app
  - read a release page
  - comment or reply
  - open support
  - manage billing or security settings

## Non-negotiable outcome

The frontend must feel like a premium operating system for the platform, not a simple wrapper around unrelated pages.
