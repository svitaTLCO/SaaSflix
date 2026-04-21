# M13 Launch Readiness Checklist

- CI gates enforce lint, typecheck, and tests on every PR.
- Production configuration validation exists for critical settings.
- Security-sensitive write paths are replay-safe and audited.
- Role/plan authorization checks are server-side for protected operations.
- Performance budgets are tracked for API latency/search/notification freshness.
- Rollback and incident runbooks are documented and discoverable.
- Monitoring and alerting cover auth, web, queue, DB, and deployment health.
- Data backup + restore drills are scheduled and verified.
