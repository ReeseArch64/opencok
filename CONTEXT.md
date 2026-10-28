# OpenCoK Technical Context

Before recommending, planning or executing, identify the problem, affected versions, state owners and verifiable outcome. Context concerns the project and its technical evolution, not contributors' personal lives. Do not assume resources, deployment, support or authorization.

## What the project is

OpenCoK is a reproducible, self-hosted Clash of Kings-compatible platform for operating, studying and customizing private kingdoms. It integrates gameplay backends, web services, persistence, infrastructure, operator tooling and clients without depending on the original online service or hidden procedures.

It is neither an immutable server snapshot nor a recreation of the publisher's commercial infrastructure. Operators control deployment and data; the backend owns rules and progress. Compatibility requires evidence for the client/resource/protocol/schema/rule combination, not merely successful startup.

Default configuration prepares two kingdoms with isolated state and shared global services; development Compose currently starts one active realm server. Recognizing `v5.36.0`, `v6.12.20`, `v9.27.0` and `v12.06.0` does not prove support for every track.

## Technical baseline and responsibility boundaries

- **Code:** TypeScript monorepo; Bun is the development toolchain. Production runtime remains open, with the previous Node.js mandate suspended. Local images do not prove production readiness.
- **Organization:** `apps/` composes processes/configuration; `packages/` owns reusable capabilities/domains; `infra/` owns deployment and ingress. Packages do not import applications. Domain-owned package migration is incremental, preserving public contracts and tracking facade retirement.
- **Authority:** the realm server currently owns gameplay, economy and combat state. API, Chat, Scheduler and Workers have bounded responsibilities, not generic gameplay write permission. Scheduler discovers deadlines and requests owner transitions; Workers perform only authorized integrations/projections. The accepted player/world authority split remains subject to the architecture's migration gates.
- **Persistence:** PostgreSQL is transactional authority; MongoDB serves documents/projections; Redis serves cache, sessions and ephemeral coordination, never the only durable progress record. Private objects use S3 interfaces; MinIO is the local baseline, separate from release distribution.
- **Clients:** the authorized Elex APK remains transitional. New adapters preserve identity, progress and contracts; Lua/native updating is planned, Flutter/Dart is an evaluation without a replacement deadline, and the web client remains experimental.

These boundaries guide changes; inventory, topology and details belong in architecture. Existing directories, planned services and accepted ADRs do not prove completed implementation, deployment or verification.

## What it should become technically

- **Reproducible:** explicit configuration, identified dependencies, traceable versions and startup without undocumented manual repairs. Private inputs must not become hidden shared dependencies.
- **Modular and understandable:** clear domain/contract owners, application composition, rules outside transport and explicit dependencies. Prefer established patterns to unnecessary layers or abstractions.
- **Consistent and recoverable:** preserve progress through retries, disconnects, restarts and service recreation. Costs, grants, receipts and events obey owner transactions/invariants without duplicating assets or fabricating success.
- **Secure at boundaries:** server-side authentication, validation and authorization; realm/environment isolation; least privilege; credentials outside clients, source and evidence. Personal/private data is not debugging fixture material.
- **Resilient:** bounded waits, queues, recovery and processing. Optional dependencies degrade explicitly without blocking login or essential gameplay. More replicas do not replace stale-writer fencing or safe authority transfer.
- **Observable and operable:** distinguish preparation, commit and delivery; measure latency, resources, backlog and recovery without exposing payloads/private identities. Operational logs replace neither authoritative state nor durable economic audit.
- **Verifiable and evolvable:** risk-appropriate tests/evidence, version-specific compatibility and migration/rollback/restore paths. Synthetic tests do not establish native-client rendering.

## Understanding and evaluation

1. Establish goals, scope, expected behavior and acceptance criteria. Identify affected clients, services, domains, data and integrations.
2. Separate product requirements, existing contracts, technical decisions and execution evidence. Check decision status: proposed is not accepted; accepted is not implemented.
3. Verify current behavior in code and evidence. Do not present production targets, estimated capacity, dependencies or documented intent as operational facts.
4. Evaluate authorization, concurrency, persistence, economy, protocol and recovery before implementation convenience. Do not replace unknown behavior with permissive defaults or false-success responses.
5. Define reproduction, testing, observation, deployment and reversal while preserving valid data. Investigate or clarify material gaps before the dependent step.

## Evaluation order and priorities

**Authorized scope and current decisions → security/privacy → correctness/state integrity → compatibility/recovery → real utility → simplicity/maintainability → integration → measured performance → convenience.** Later benefits do not justify violating earlier invariants or restrictions.

Prioritize active-client stability, removal of blocking external dependencies, performance/recovery, media completion and understandable operations. Do not make optimizations, stack changes or client rewrites prerequisites without explicit decisions. Production capacity, high availability and recovery goals require measurements/tests, not promises inferred from design.

## Interpretation, conflicts and sources

For conflicts, present the affected requirement/contract, available evidence and compatible alternatives. Do not rewrite decisions or records to justify implementation; direction changes require the corresponding process and authorization. Distinguish proven incompatibility, hypothesis and missing evidence.

This document summarizes technical direction, not replacement sources or new technology decisions. [Product](PRODUCT.md) owns goals/boundaries; [architecture](.github/ARCHITECTURE.md), design/responsibilities; [ADRs](docs/decisions/README.md), decisions/status; [contribution](.github/CONTRIBUTING.md), tests/review/delivery; [rules](.agents/RULES.md) and [security](.github/SECURITY.md), authorization/data protection. The [agent guide](AGENTS.md) centralizes when to consult each source without recursive reading requirements.

The project assumes no public multi-tenant hosting, global scale, universal compatibility, dependency on contributors' cloud accounts or rights over third-party material. Replacement components must be independently authored or authorized, with documented origin/license.
