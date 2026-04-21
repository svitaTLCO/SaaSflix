# Backend Architecture

## Objective

Build a production-grade backend that acts as the platform core for membership, entitlements, publishing, release management, community, support, notifications, analytics, and future app integration.

The backend should be a **modular monolith with event-driven boundaries** unless and until clear extraction pressure exists.

## Architectural style

### Preferred style
- modular monolith
- strict domain boundaries
- explicit service interfaces
- domain events for asynchronous side effects
- queue-backed job workers
- typed API contracts
- idempotent external integrations

### Why this style
It preserves development velocity and operational simplicity while supporting future decomposition where justified.

## Core domains

### Identity and account domain
Responsibilities:
- user accounts
- authentication methods
- sessions
- passkeys / MFA-capable structure
- account recovery
- device/session visibility
- security event history

**Current repository baseline (M1):**
- `UserAccount`, `AuthMethod`, `AccountSession`, and `SecurityEvent` domain types
- role + plan aware access decisions
- active session check helper for session lifetime validation

### Subscription and billing domain
Responsibilities:
- plans
- subscription state
- billing provider mapping
- invoices and receipts metadata
- trials / grace periods / cancellations
- provider webhooks
- idempotency
- downgrade / upgrade rules

### Entitlement domain
Responsibilities:
- mapping subscription state to platform capabilities
- app access
- feature access
- limits / quotas
- beta / founder-circle access rules
- experiment gating

### App registry domain
Responsibilities:
- canonical record for every app
- category, metadata, visibility, access tier
- lifecycle status
- launch URLs
- media
- compatibility notes
- archive and deprecation flags

### Release domain
Responsibilities:
- releases / drops
- changelogs
- release notes
- launch page payloads
- staged rollout metadata
- release tagging
- release-related notifications

### Feed and publishing domain
Responsibilities:
- founder posts
- editorial or short-form updates
- attached media
- release-linked content
- drafts
- publication state
- scheduling

### Discussion domain
Responsibilities:
- threads
- comments
- replies
- reactions
- follows / watches
- moderation state
- thread types such as support, feedback, release discussion, roadmap discussion

### Support domain
Responsibilities:
- support cases
- linked knowledge entries
- issue states
- visibility controls
- canonical answers
- escalations
- app association

### Notification domain
Responsibilities:
- in-app notifications
- email digests or transactional notifications
- delivery preferences
- read state
- retry and suppression logic

### Media and asset domain
Responsibilities:
- uploads
- media metadata
- storage references
- transformations
- validation and abuse checks

### Search domain
Responsibilities:
- indexing app registry, releases, posts, discussions, knowledge articles
- search ranking rules
- autocomplete / suggestions

### Analytics and audit domain
Responsibilities:
- user activity events
- app entry events
- release engagement
- entitlement checks
- privileged operation audit
- security-relevant event logging

### Admin domain
Responsibilities:
- moderation
- registry management
- release publishing
- support diagnostics
- plan / entitlement diagnostics
- operational dashboards

## Suggested module layout

The exact filesystem may vary, but backend code should align to domain modules such as:

- `identity`
- `billing`
- `entitlements`
- `appRegistry`
- `releases`
- `feed`
- `discussions`
- `support`
- `notifications`
- `media`
- `search`
- `analytics`
- `audit`
- `admin`

Each module should expose clear application services and domain types.

## Data model guidance

### Core entities
At minimum model:

- User
- AuthMethod
- Session
- Subscription
- Plan
- Entitlement
- App
- AppVersion or Release
- AppStatus
- AppAsset
- Post
- Thread
- Comment
- Reaction
- Follow
- SupportCase
- KnowledgeArticle
- Notification
- Upload
- AuditEvent
- UsageEvent
- FeatureFlagAssignment where appropriate

### Relationship guidance
- An app can have many releases.
- A release can have one or more linked founder posts.
- A thread may attach to an app, release, post, or support case.
- Entitlements should resolve from plan plus overrides plus experiment grants.
- Audit events should reference actor, target, action, timestamp, and relevant metadata.

## API architecture

Support a clean external contract for:

- public content
- authenticated member actions
- admin actions
- app-to-platform integrations

Patterns:

- version APIs intentionally
- validate every inbound payload
- return typed error envelopes
- enforce authn/authz at route or resolver boundaries
- use idempotency keys for externally triggered state changes
- model pagination consistently
- support filtering and sort semantics intentionally

## Event-driven behavior

Use domain events and background jobs for side effects such as:

- subscription state changed
- entitlement recalculated
- release published
- app status changed
- post published
- support case escalated
- comment created
- notification fanout
- search reindex request
- analytics aggregation
- email dispatch

Keep core write-path success independent from non-critical side effects wherever possible.

## Authorization

Authorization must be explicit and layered.

Model at least:

- anonymous visitor
- authenticated member
- plan-based gates
- moderator
- support operator
- admin
- founder / super-admin

Use both role-based and object-aware checks where appropriate. Never rely on frontend hiding as authorization.

**Current repository baseline (M1):**
- `authorizeAction` with role + plan + object ownership checks
- explicit separation between surface access (`public/member/admin`) and action-level authorization

## Consistency and migrations

- Use disciplined schema migrations.
- Avoid destructive changes without a migration plan.
- Support backfills for analytics and lifecycle fields.
- Design webhook processing and provider callbacks to be replay-safe.

## Reliability features

- retries with backoff
- dead-letter handling for jobs
- idempotency
- rate limiting
- request correlation IDs
- health probes
- graceful shutdown
- structured logging

## Observability

Every critical request path should emit:

- trace context
- latency metrics
- success/failure metrics
- structured logs
- domain event visibility where appropriate

High-value flows to instrument first:

- sign-in
- subscription updates
- entitlement checks
- app launch/open
- release publish
- comment creation
- support case lifecycle
- search

## Testing strategy

Required backend test categories:

- unit tests for domain logic
- integration tests for persistence and service wiring
- contract tests for external provider callbacks
- authorization tests for restricted routes
- idempotency tests
- queue / event processing tests for critical flows

## Non-negotiable outcome

The backend must behave like a durable platform core, not a loose collection of endpoints.
