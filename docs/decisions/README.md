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
- Read relevant accepted ADRs before implementing a change. Add a lightweight ADR
  reference at an affected code entry point when implementing it.

The [architecture](../../.github/ARCHITECTURE.md) remains the system overview,
[PRODUCT.md](../../PRODUCT.md) defines product goals, and
[CONTRIBUTING.md](../../.github/CONTRIBUTING.md) defines contribution rules.
This index bootstraps the ADR practice without introducing an extra technology decision.

## Records

- [ADR-0001: Adopt MongoDB for document storage](0001-adopt-mongodb-for-documents.md) — accepted
