# OpenCoK Technical Context

Identify the problem, affected versions, state owners and verifiable outcome before recommending or acting. Context concerns technical evolution, not contributors' personal lives; assume neither resources, deployment nor support. Operational authorization and data restrictions belong in [rules](.agents/RULES.md).

## Project and current baseline

OpenCoK is a reproducible, self-hosted Clash of Kings-compatible platform for operating, studying and customizing private kingdoms: gameplay backends, web services, persistence, infrastructure, operator tooling and clients independent of the original online service and hidden procedures. It is neither an immutable snapshot nor the publisher's commercial infrastructure. Operators own deployment/data; the backend owns rules/progress.

Default configuration prepares two isolated kingdoms sharing global services; development Compose starts one active realm server. Recognized tracks: `v5.36.0`, `v6.12.20`, `v9.27.0`, `v12.06.0`. Compatibility requires evidence for each client/resource/protocol/schema/rule combination, not startup alone.

- **Code:** TypeScript monorepo; Bun development toolchain. Production runtime is undecided; the previous Node.js mandate is suspended.
- **Boundaries:** `apps/` composes processes/configuration, `packages/` owns reusable domains, `infra/` owns deployment/ingress. Packages never import applications. Domain-package migration is incremental, preserving public contracts and tracking facade retirement.
- **Authority:** realm server owns gameplay/economy/combat. API, Chat, Scheduler and Workers have bounded responsibilities, without generic gameplay writes. Scheduler discovers deadlines and requests owner transitions; Workers handle authorized integrations/projections. The accepted player/world split requires architecture migration gates.
- **Persistence:** PostgreSQL is transactional authority; MongoDB holds documents/projections; Redis handles cache/sessions/ephemeral coordination, never sole durable progress. Private objects use S3 interfaces; local MinIO is separate from release distribution.
- **Clients:** authorized Elex APK is transitional; adapters preserve identity/progress/contracts. Lua/native updating is planned; Flutter/Dart remains evaluation without a replacement deadline; web client is experimental.

## Technical goals

- **Reproducibility/modularity:** explicit configuration/dependencies, traceable versions and startup without undocumented repairs; clear domain/contract owners, application composition and rules outside transport. Prefer established patterns over unnecessary abstractions.
- **Integrity/recovery:** preserve progress across retries, disconnects, restarts and service recreation. Owner transactions/invariants govern costs, grants, receipts and events; never duplicate assets or fabricate success.
- **Security:** server-side authentication/validation/authorization, realm/environment isolation and least privilege; credentials stay outside clients/source/evidence.
- **Resilience:** bounded waits, queues, recovery and processing; optional dependencies degrade explicitly without blocking login/essential gameplay. Replicas do not replace stale-writer fencing or safe authority transfer.
- **Operations:** distinguish preparation, commit and delivery; measure latency/resources/backlog/recovery without exposing private payloads/identities. Logs replace neither authoritative state nor durable economic audit.
- **Evolution:** risk-appropriate tests, version-specific compatibility and migration/rollback/restore paths. Synthetic tests do not establish native-client rendering.

## Evaluation and priorities

1. Define scope, expected behavior and acceptance criteria; identify affected clients/services/domains/data/integrations.
2. Separate requirements, contracts, decisions and execution evidence. Proposed, accepted, implemented and verified are distinct states; directories, local images and documented intent prove neither deployment nor readiness/capacity/availability/recovery.
3. Verify behavior in code/evidence; evaluate authorization, concurrency, persistence, economy, protocol and recovery. Never substitute permissive defaults or false success for unknown behavior.
4. Define reproduction, tests, observation, deployment and reversal while preserving valid data; resolve material gaps before dependent work. For conflicts, present requirements/contracts, evidence and compatible alternatives; distinguish incompatibility, hypothesis and missing evidence. Change decisions through their process, never rewrite records to justify code.

**Authorized scope/current decisions → security/privacy → correctness/state integrity → compatibility/recovery → utility → simplicity/maintainability → integration → measured performance → convenience.** Later benefits cannot override earlier constraints.

Prioritize active-client stability, removing blocking external dependencies, performance/recovery, media completion and understandable operations. Optimizations, stack changes and client rewrites require explicit decisions before becoming prerequisites.

## Sources and limits

This summary introduces no technology decisions. [Product](PRODUCT.md): goals/boundaries; [architecture](.github/ARCHITECTURE.md): design/topology/responsibilities; [ADRs](docs/decisions/README.md): decisions/status; [contribution](.github/CONTRIBUTING.md): tests/review/delivery; [security](.github/SECURITY.md): data protection. Reading triggers belong in `AGENTS.md`, without recursive requirements.

Assume no public multi-tenant hosting, global scale, universal compatibility, contributor cloud-account dependency or third-party rights. Replacement components require independent authorship or authorization and documented origin/license.
