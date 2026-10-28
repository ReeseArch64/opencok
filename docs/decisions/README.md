# Architecture Decision Records

Each record captures one accepted technology decision, its boundaries, alternatives,
implementation TODOs and verifiable completion criteria. Acceptance is not evidence
that an implementation or deployment is complete.

## Conventions

- Keep records in `docs/decisions/`, numbered sequentially as `NNNN-adopt-topic.md`.
- Use English and the ADR skill's simple template with an explicit implementation plan.
- Statuses are `proposed`, `accepted`, `rejected`, `deprecated` or `superseded`.
- The maintainer approved these initial decisions on 2026-10-23. Future decisions
  need human confirmation before acceptance.
- Do not rewrite accepted decision history. Append dated learnings; replace a
  decision with a new record and reciprocal supersession links.
- Keep one technology decision per record and one commit per ADR. Implementation
  TODOs are local tracking until linked through the repository's contribution workflow.
- Read relevant accepted ADRs before implementing a change. Link ADRs from component
  prose documentation and name the governed code paths; source comments are prohibited.

The [architecture](../../.github/ARCHITECTURE.md) remains the system overview,
[PRODUCT.md](../../PRODUCT.md) defines product goals, and
[CONTRIBUTING.md](../../.github/CONTRIBUTING.md) defines contribution rules.
This index bootstraps the ADR practice without introducing an extra technology decision.

## Records

- [ADR-0001: Adopt MongoDB for document storage](0001-adopt-mongodb-for-documents.md) — accepted
- [ADR-0002: Adopt PostgreSQL for authoritative transactional state](0002-adopt-postgresql-for-authoritative-state.md) — accepted
- [ADR-0003: Adopt Mongo Express for development inspection](0003-adopt-mongo-express-for-development.md) — accepted
- [ADR-0004: Adopt pgAdmin 4 for development inspection](0004-adopt-pgadmin4-for-development.md) — accepted
- [ADR-0005: Adopt Redis for cache and ephemeral coordination](0005-adopt-redis-for-cache.md) — accepted
- [ADR-0006: Adopt Redis Insight for development inspection](0006-adopt-redis-insight-for-development.md) — accepted
- [ADR-0007: Adopt Oxlint for JavaScript and TypeScript linting](0007-adopt-oxlint-for-linting.md) — accepted
- [ADR-0008: Adopt Oxfmt for repository formatting](0008-adopt-oxfmt-for-formatting.md) — superseded by ADR-0014
- [ADR-0009: Adopt Bun for development tooling and execution](0009-adopt-bun-for-development.md) — accepted
- [ADR-0010: Adopt Node.js for production service execution](0010-adopt-nodejs-for-production.md) — deprecated (production mandate suspended)
- [ADR-0011: Adopt TypeScript for application and shared package code](0011-adopt-typescript-for-application-code.md) — accepted
- [ADR-0012: Adopt Effect for API and realm service composition](0012-adopt-effect-for-service-composition.md) — proposed
- [ADR-0013: Adopt Maple for local operational observability](0013-adopt-maple-for-local-operational-observability.md) — proposed
- [ADR-0014: Adopt dprint for TypeScript formatting](0014-adopt-dprint-for-typescript-formatting.md) — accepted
- [ADR-0015: Adopt measured per-application build selection](0015-adopt-measured-per-application-build-selection.md) — proposed
- [ADR-0016: Adopt domain-owned package layout](0016-adopt-domain-owned-package-layout.md) — accepted
