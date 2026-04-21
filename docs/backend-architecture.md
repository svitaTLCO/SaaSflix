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

**Current repository baseline (M2):**
- `Subscription` and provider webhook event models
- replay-safe webhook transition helper with duplicate-event handling
- status transition guardrail logic (`canTransition`)

### Entitlement domain
Responsibilities:
- mapping subscription state to platform capabilities
- app access
- feature access
- limits / quotas
- beta / founder-circle access rules
- experiment gating

**Current repository baseline (M2):**
- entitlement resolver with precedence: plan defaults -> overrides -> experiments
- expirable grants and capability checks
- status-aware entitlement eligibility based on billing state

### App registry domain
Responsibilities:
- canonical record for every app
- category, metadata, visibility, access tier
- lifecycle status
- launch URLs
- media
- compatibility notes
- archive and deprecation flags

**Current repository baseline (M3):**
- `AppRecord` model for canonical app metadata, lifecycle, visibility, availability, and integration type
- member access guardrails for plan thresholds, invite-only access, founder-circle access, and time-limited experiments
- discoverability and public-visibility helpers to keep library and storefront behavior explicit

### Release domain
Responsibilities:
- releases / drops
- changelogs
- release notes
- launch page payloads
- staged rollout metadata
- release tagging
- release-related notifications

**Current repository baseline (M3):**
- `AppRelease` model with release type and publication lifecycle state
- publication state-transition guardrails (`canTransitionPublicationState`)
- transition application helper (`applyPublicationTransition`) and release visibility helper (`isReleaseVisible`)

### Feed and publishing domain
Responsibilities:
- founder posts
- editorial or short-form updates
- attached media
- release-linked content
- drafts
- publication state
- scheduling

**Current repository baseline (M5):**
- `FeedPost` model with visibility and publication-state lifecycle
- publish/archive state-transition guardrails for feed operations
- content-safety validation to block unsafe inline script payloads in post markdown

### Discussion domain
Responsibilities:
- threads
- comments
- replies
- reactions
- follows / watches
- moderation state
- thread types such as support, feedback, release discussion, roadmap discussion

**Current repository baseline (M6):**
- `DiscussionThread` model with typed thread categories and explicit visibility rules
- moderation lifecycle transitions (`open/locked/hidden/archived`) with transition guardrails
- content-safety validation for thread title/body payloads and viewer-scoped visibility checks

### Support domain
Responsibilities:
- support cases
- linked knowledge entries
- issue states
- visibility controls
- canonical answers
- escalations
- app association

**Current repository baseline (M7):**
- `SupportCase` model with explicit lifecycle states and visibility policies
- transition guardrails for support workflows with resolved/closed timestamps
- reusable knowledge-candidate helper for answered/resolved support outcomes

### Notification domain
Responsibilities:
- in-app notifications
- email digests or transactional notifications
- delivery preferences
- read state
- retry and suppression logic

**Current repository baseline (M8):**
- `NotificationPreference` and `NotificationEvent` models for topic/channel delivery behavior
- preference-aware delivery gating (`shouldDeliver`) with default in-app fallback
- notification read-state transition helper with timestamp validation

### Media and asset domain
Responsibilities:
- uploads
- media metadata
- storage references
- transformations
- validation and abuse checks

**Current repository baseline (M9):**
- `MediaAsset` model with kind-aware size guardrails and storage-key validation
- boundary validation for MIME, timestamps, and storage namespace safety

### Search domain
Responsibilities:
- indexing app registry, releases, posts, discussions, knowledge articles
- search ranking rules
- autocomplete / suggestions

**Current repository baseline (M10):**
- typed `SearchDocument` model with scoped entity types
- basic scoring and type-filter helpers for query evaluation

### Analytics and audit domain
Responsibilities:
- user activity events
- app entry events
- release engagement
- entitlement checks
- privileged operation audit
- security-relevant event logging

**Current repository baseline (M11):**
- typed `UsageEvent` model and validator for analytics event ingestion boundaries
- event-type bucketing helper for admin/ops analytics slices

### Admin domain
Responsibilities:
- moderation
- registry management
- release publishing
- support diagnostics
- plan / entitlement diagnostics
- operational dashboards

**Current repository baseline (M4):**
- application-layer secure orchestration for registry upsert and release publish actions
- centralized authorization enforcement via security policy checks before state changes
- audit-log emission for privileged admin actions to preserve traceability
- replay-safe action handling for privileged mutations using action-id inbox semantics

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
