# OpenCoK Technical Context

## Purpose and baseline

OpenCoK is an open-source, self-hosted persistent strategy game for independently operated communities. Clash of Kings provides gameplay and visual references; OpenCoK has its own implementation, accounts, contracts and release lifecycle. OpenCoK does not distribute proprietary Clash of Kings assets; users who supply external assets are responsible for obtaining them lawfully and ensuring that they have the rights required to use them. Flutter + Flame provides one game client for mobile and web. Global identity/services are shared across isolated kingdoms; characters and gameplay progress belong to a kingdom. An installation can operate any number of Realms; local development can begin with one active Realm.

This document provides a standalone technical orientation: system responsibilities, accepted technologies, delivery priorities and verification principles. An accepted target does not establish implementation or verification. Inspect the current source, manifests and executable checks before describing a capability as working; directory scaffolding alone is not evidence.

## Repository and application boundaries

The repository is a Turborepo monorepo. Bun manages TypeScript workspaces and dependencies; native toolchains remain responsible for Go and Flutter. `mise.toml` defines language/SDK/tool versions. `bootstrap/` owns reproducible setup from a clean checkout, while `.devcontainer/`, `.github/`, `.husky/` and `.vscode/` provide their respective development integrations.

| Location                                        | Responsibility                                                                                     |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `app/`                                          | Flutter + Flame game for mobile and web.                                                           |
| `apps/api/`                                     | Global TypeScript/Bun HTTP API: identity, accounts, admission, payments, media and administration. |
| `gameserver/`                                   | Global Go WSS application: connections, sessions, routing, Chat and authorized delivery.           |
| `apps/realm/`                                   | TypeScript/Bun authoritative gameplay application, deployed per kingdom.                           |
| `apps/workers/`                                 | Global TypeScript/Bun background integrations, projections, publication and reconciliation.        |
| `apps/automation/`                              | TypeScript/Bun Bots and NPCs using the same WSS contracts as players.                              |
| `apps/wiki/`                                    | Markdown/MDX public documentation; generator undecided.                                            |
| `apps/admin/`, `apps/console/`, `apps/landing/` | Separate React/Vite/TanStack operator, player-account and public clients.                          |
| `packages/`                                     | Shared TypeScript code/tooling, including backend-authored contracts.                              |

API, GameServer and Workers serve multiple kingdoms and can have replicas. Each Realm has one logical authoritative gameplay writer. API/GameServer never write realm gameplay directly. Workers execute committed intent and request authoritative changes through the owner. Automation has no direct Realm store access or privileged gameplay implementation.

TypeScript backend modules use explicit Facades, command/query handlers, domain classes, repositories and a shared transactional Unit of Work. Effect supports composition, resources and concurrency on Bun. Go GameServer uses explicit interfaces, structs and native concurrency, independently of Bun/Effect. Modules are statically composed; reusable packages never import executable applications.

## Accepted technical baseline

- PostgreSQL is authoritative for accounts, gameplay, economic effects, entitlement, operation receipts and required intent. Initially, one global database and one database per kingdom share an instance, with scoped credentials and resource budgets. Kysely owns TypeScript SQL/migration tooling; aggregate-oriented columns and JSONB preserve atomic invariants.
- MongoDB owns versioned configuration/rules, original document content such as Chat, and declared read projections. Applications execute validated immutable configuration snapshots in memory. Deployment settings and secrets are injected separately.
- Redis is exclusively disposable read cache. It does not own configuration, sessions, queues, Realm authority, entitlement or required delivery.
- Interactive API/GameServer–Realm calls are direct and service-authenticated; their exact RPC protocol is open. RabbitMQ is accepted for asynchronous tasks/events. PostgreSQL outbox/job records preserve required intent through broker or Worker failure.
- Realm's Scheduler handles persisted gameplay deadlines through the same transitions used by foreground commands. Global Workers handle integrations, not independent gameplay authority.
- Firebase Authentication supports Guest, Facebook, Google, Apple and email/password. Firebase Cloud Messaging handles advisory push notifications; it is separate from WSS updates and internal configuration activation.
- Stripe handles payments/subscriptions. Verified provider events, durable reconciliation and Realm-confirmed grants establish gameplay benefits.
- MinIO is used for development object storage; Cloudflare R2 and edge caching serve production assets. Traefik handles infrastructure HTTP/WSS routing. Compose supports initial development; production orchestration remains open.
- Unleash handles feature admission and kill switches separately from economic rules. Observability uses Maple, Sentry, Prometheus, Grafana and Alertmanager, plus Firebase Analytics/Crashlytics on supported client targets. Runtime/platform support still needs validation.

## Contracts, access and client continuity

`packages/contracts/` owns Zod wire schemas, inferred TypeScript types and export tooling. JSON over HTTPS/WSS is the initial encoding. Dart models/HTTP client use OpenAPI Generator (`dart-dio`); realtime messages reuse generated models through a WSS adapter. Go consumes generated bindings and runtime validation from the same contracts; its generation/validation tooling remains open. Never maintain independent handwritten wire shapes. Exact numeric encodings must preserve balances, counters and identifiers across TypeScript, Go, native Dart and browsers.

Only one active player gameplay session/device is allowed per account, enforced by backend session revocation across replicas. Player admission disconnects the Bot controlling that character. Provider linking preserves the stable internal account and progress. An unlinked Guest cannot be recovered after credentials are lost. Operators and services use separate authorization boundaries.

Patch versions within a supported `0.<minor>.x` line remain compatible; another minor line requires explicit server support. Reject incompatible clients before gameplay. Reconnect uses authoritative snapshots, watermarks and versioned updates, with receipt lookup for interrupted operations. Mobile suspension and local animation do not establish completion.

Assets use versioned authenticated manifests, verified downloads, staged activation and persistent local storage. Keep a small required base and load optional assets on demand with appropriate compression, bounded storage and recoverable cleanup. Mobile uses application-private storage; browser persistence must handle quotas, eviction and coordination between tabs. Specific adapters/codecs remain client design work. Local assets do not enable offline authoritative gameplay.

## Durable gameplay and delivery priorities

The first milestone authenticates, enters a kingdom, loads a city, starts construction, charges once, persists its deadline, disconnects/restarts and reconnects to complete once. Build the minimum contracts, modules, migrations, receipts/outbox, configuration activation and Scheduler required for that flow. Expand world, marches, gathering, reproducible combat and auxiliary platforms incrementally.

Commit authoritative state, economic ledger, operation receipt and publication intent atomically. Retries return recorded results; a timeout is an uncertain outcome resolved through lookup/reconciliation. Do not fabricate failure, refund speculatively or reroll outcomes. MongoDB publication and external delivery can retry independently without losing confirmed entitlement.

Preserve accepted rule versions, costs, deadlines, reservations, fractional production and earned rewards through retries, reconnects and restarts. Realm transactions must reject stale owners through a protected epoch check. Bots remain within manual limits, player sessions take priority and purchased automation requires valid revocable entitlement. NPCs are operator-owned and excluded from player rewards, final rankings and player analytics. Farms are owned Realm characters using normal production and combat, with bounded ownership and transfers. Exact commercial quotas remain undecided; no missing quota or gameplay rule grants implicit permission.

## Working and verification principles

For each change, identify its owner, affected contracts/versions, intended behavior, state invariants and observable acceptance criteria. Distinguish proposed, accepted, implemented and verified work. Unknown behavior needs evidence rather than permissive defaults or invented success.

Prioritize economic correctness, recoverable play, bounded workloads and understandable operations. Optional-service failures should expose truthful pending/unavailable states and preserve core play where its authoritative dependencies remain available. Diagnostics do not replace durable ledger/audit records.

Validate relevant duplicate commands, uncertain commits, stale owners, publication failures, configuration activation, cache loss, mobile/browser recovery and isolated restore. Local checks do not prove production capacity or native release readiness. Migrations, rollout and rollback/forward recovery preserve valid OpenCoK accounts and progress; this context authorizes no destructive data migration.

Original Elex clients/protocols, historical compatibility and account/progress imports are outside scope. Historical references do not establish compatibility requirements. Project licensing does not grant rights to third-party assets. Do not assume worldwide scale, public multi-tenant hosting or contributor cloud accounts. Open decisions include internal RPC, replica fan-out/revocation, concrete Realm fencing, configuration publication/activation, Go contract tooling, exact numeric encodings, client state/storage adapters, operator/service authentication, production orchestration, recovery objectives and observability support. Introduce infrastructure only for a demonstrated workload or isolation need.
