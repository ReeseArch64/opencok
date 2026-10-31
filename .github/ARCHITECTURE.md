# OpenCoK Architecture

## Runtime and applications

TypeScript monorepo with Bun tooling and Effect composition. The former Node.js production mandate is suspended; production runtime is undecided. Source checks do not certify emitted artifacts or native releases.

Current gameplay has one logical writer per realm. Two isolated kingdom databases share global services; local development starts one active realm server. Domain extraction and process separation are distinct migrations.

| Application      | Boundary                                                                                                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/api`       | Discovery, optional Chat metadata proxy, account provisioning and opt-in avatar media. Broader identity/Admin/push/payment endpoints remain targets.                             |
| `apps/server`    | TCP/SFS transport and sole gameplay writer, including progression, world and combat application. Composition stays in `realm-composition.ts`, lifecycle in `RealmApplication`.   |
| `apps/chat`      | HTTP/WebSocket messages, session/metadata adapters, persistence, replay receipts and social-feed composition.                                                                    |
| `apps/workers`   | Opt-in Mail integrations: one realm's committed queues, global gift projection and signed Chat delivery. No gameplay token, Rules catalog or Redis.                              |
| `apps/scheduler` | Opt-in bounded metadata discovery/dispatch for twelve registered timed activity types and legacy restoration. No gameplay writes/payloads, writer token, Rules catalog or Redis. |
| `apps/web`       | Experimental browser loading/health scaffold; full gameplay and SSR remain evaluation work.                                                                                      |

The accepted target makes Server a gateway with one active Player and World owner per realm/authority kind. These applications, independent epochs and cross-owner protocols are not implemented. Bot/Admin/landing/docs applications remain planned; no separate Files listener or standalone Combat service is selected.

## Package structure and ownership

`apps/` composes processes/configuration; reusable domains/contracts/adapters live in flat `packages/*` workspaces. Packages never import applications. Controllers delegate transport work to constructor-injected Services; concrete runtime wiring stays in applications.

Use responsibility directories inside domain `src`: `domain`, `contracts`, `dtos`, `rules`, `services`, `validations`, `mappings`, `controllers`, `repositories`, `resources`, `bindings`, `enums`, `constants`. Create only implemented directories; keep any feature-first layout consistent. Pure entrypoints must not load ORM, brokers, sockets, process composition or a universal catalog registry.

Preserve direct workspace dependencies and selective exports, including `"./*": "./src/*.ts"`, root entries/assets/aliases. Temporary facades delegate/re-export one implementation with an owner, remaining callers and removal task. Check runtime/type-only edges; do not introduce cycles or remove old implementations before moved tests remain discoverable and pass.

Review cohesion near 10–15k handwritten behavioral lines per package or 400–600 per file; count catalogs/schemas/tests separately. These are review triggers, not hard limits or permission for giant cross-domain packages/empty scaffolding.

| Packages                                                            | Current ownership                                                                                                                                          |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `env`, `config`, `core`                                             | Injectable validated environment, compiler config, scoped Effect resources, transport helpers and filtered logging.                                        |
| `api`, `connection`, `controllers`, `identity`                      | HTTP/SFS entry, authentication and thin command Controllers.                                                                                               |
| `contracts`, `dtos`, `enums`, `validations`, `mappings`, `messages` | Shared/versioned ports, inputs, wire types, SFS codecs and boundary primitives; migrated declarations follow their domain.                                 |
| `rules`, `base`, `ledger`                                           | Remaining pure rules, concrete shared lifecycles, mutation/posting/outbox contracts and signed-64 validation. Ledger has no domain/persistence dependency. |
| `account`, `player`                                                 | Global account discovery/reservation/activation; realm character provisioning, profiles, preferences, descriptions and nickname workflows.                 |
| `economy`, `production`, `city`                                     | Balances/inventory/activity economics; accumulation/collection/effect settlement; aggregate planning, dispatch, persistence and bootstrap.                 |
| `building`, `research`, `troops`, `equipment`                       | Construction/catalogs; ordinary/civilization research; training/healing/fortifications; equipment/sets/workshop.                                           |
| `tasks`, `skins`, `shop`, `policy`                                  | Quest/sign-in/recall/reconnect; city cosmetics; mall/NPC trading; content filtering and bounded adapters.                                                  |
| `hero`, `dragon`, `resources`                                       | Hero workflows/archetypes; named dragon definitions/bindings; typed gameplay catalogs. Dragon workflows remain incomplete.                                 |
| `alliance`, `share`, `ranking`                                      | Alliance context/locking/persistence; feed visibility/expiry/native envelopes; published attribute/payment/consumption boards.                             |
| `world`                                                             | Map/search/favorites/point details; population admission, quotas, expiry, durable clocks and transactional persistence.                                    |
| `mail`, `queues`                                                    | Mail leaf contracts/gift projection/Chat relays; persisted activity discovery and versioned owner-dispatch contracts.                                      |
| `repositories`, `drizzle`, `storage`                                | Remaining persistence, PostgreSQL schemas/migrations/setup and Redis/ZooKeeper/S3 adapters.                                                                |

Composition injects clocks, catalogs, numeric bindings, effects and cross-domain collaborators. `CityProgressionContextFactory` loads state/effects; `CityProgressionContext` plans atomic writes/economics. Domain classes specialize `ActivityDomain`, `CityCommandDomain` or `CommandDomain`; weighted choice remains a bounded Rules algorithm.

Domain DTOs, Zod schemas and serializers belong in `dtos`, `validations` and `mappings`; response interfaces belong in `contracts/responses`. Centralized equivalents remain compatibility locations during migration.

World population executes sequentially by family under realm fencing, advisory locks, captured clock and outbox ordering; local/remote snapshots remain read-only. March/gathering recovery, ranking finality/funding/rewards, dedicated battle-report rendering and all mailbox/avatar workflows are not completed merely by package extraction.

## Catalogs and native compatibility

Runtime catalogs are maintained TypeScript artifacts, without XML parsing, mounts or `GAME_RESOURCES`. Building owns costs/prerequisites/effects/star progression; Resources retains other typed tables/maps/variables/routing and a flat-record compatibility adapter. Offline XML tooling is developer-only; the policy dictionary ships in the server artifact.

Hero has 109 named archetypes with injected numeric bindings and stable unknown entries. Dragon has 14 client archetypes, 13 server configurations; Vildrin remains client-only. Use typed properties/units/relationships, deterministic ordered rosters and separate versioned native bindings; homogeneous curves/matrices remain data, not subclasses per level/cell.

Preserve numeric/string/leading-zero identities, aliases, save keys and cross-version reuse. Establish identity from native records, entity/localization/relationship linkage and server consumers, never icon similarity, ID prefixes, guessed translations or display names alone.

Each family records owner, authoring source, client fingerprint/version and migrated/deferred/unresolved status. `catalog-tools` produces safe relative provenance and deterministic collision/reference/coverage diagnostics without modifying originals or silently rewriting maintained source. Builds/tests use maintained artifacts and synthetic fixtures. Unresolved required bindings block promotion; incomplete/client-only entries stay unavailable rather than gaining invented effects/defaults.

One authoring source drives definitions/bindings and injected compatibility Mappers. Require record/field/type/default/alias/order parity and semantic-consumer migration before cutover; XML-shaped bags for raw-ID callers are insufficient. Track remaining facades and prevent unrelated startup from loading the universal registry.

## Persistence and realm authority

PostgreSQL is transactional authority, with global and physical per-kingdom databases. Immediate reads, balances, costs and preconditions use the writer; target Neon replicas serve delay-tolerant reads with explicit lag budgets. Bound pools and realm/service roles; replicas are not backups. Drizzle owns additive migrations and provisioning; runtime applications do not migrate themselves or repair grants.

MongoDB holds versioned documents/reconstructible projections. Redis holds cache, sessions and ephemeral coordination, never sole durable progress. Private media uses S3-compatible storage/local MinIO, separate from R2 release distribution.

Current `RealmAuthority` acquires a persisted monotonic `ownerEpoch`. Every authoritative transaction, including recovery, fences stale writers and atomically commits state, ledger postings, receipts and outbox. Membership, ZooKeeper election or cache locks alone are not fencing; authority loss stops mutations. Preserve participant/alliance lock ordering.

The accepted Player/World split requires distinct persisted owner epochs/instances, readiness and least-privilege roles; replacement acquisition serializes against old commits. Player owns progression/economy/inventory/troops/production; World owns occupancy/placement/populations/spatial march checkpoints. Initial ownership is per realm/authority kind, not per character; independent writers cannot share the existing realm token.

Cross-owner work needs registered aggregate/table/command ownership, factual durable reservations, versioned acceptance/results, pinned rule/RNG/reward outcomes and reconciliation. Carry realm, operation identity, participant, contract version and expected state version. World records movement/checkpoints; Player applies losses/releases/rewards once. Timeouts remain uncertain outcomes, never permission to release consumed troops or grant again.

Keep current atomic paths until equivalent ordering, compensation, database-denial, stale-writer and crash-recovery evidence exists. Transfer admission through drain/checkpoint, fenced acquisition, readiness and reconnect routing. Cutover/rollback preserves in-flight protocol state; more replicas do not establish safe scaling. Marches/gathering remain together until participant recovery is verified.

## Scheduling, calculations and integrations

Persist server-time deadlines and aggregate versions; use bounded catch-up rather than per-player timers/unbounded replay. Starting/cancelling/accelerating work changes deadlines and economics atomically. Scheduler, foreground and reconnect use the same owner transition/stable identity; the owner locks and rechecks actual due time, generation/version and earlier-activity ordering before committing.

Scheduler reads restricted discovery metadata and owner-advertised capabilities. Finite horizons, head retries, per-owner/request/pool budgets bound discovery, not arbitrary-backlog latency. Health counts are bounded observations/lower bounds. Due-cursor indexes need an operator migration window; runtime permission checks supplement grants, not cluster-wide CONNECT/HBA/network isolation. Unsupported/failed work stays durable; alliance research, marches/gathering, World expiry, effects, event finality and integration retries retain their owners until migrated.

Combat stays in the gameplay authority. Isolated calculations use immutable snapshots, bounded CPU/concurrency/queues/memory and return proposals; the owner checks versions, epoch and idempotency before applying results. Preserve Java numeric/rounding/order/random behavior with differential vectors, deterministic replay and invariants. Alternative languages require separate review. Planned TypeScript bots use authenticated commands, quotas and a kill switch; NPCs remain simulation-owned.

RabbitMQ/CloudAMQP remains target infrastructure, not a Scheduler/Mail dependency. Commit outbox with state; consumers deduplicate and commit owned effects before acknowledgment, with bounded ordering/retries/dead letters/queue budgets. BullMQ is an optional separately adopted persistent-Redis alternative, not a second event path or exactly-once guarantee.

Mail Workers acknowledge one realm's committed queues after global gift projection or signed Chat receipt commit. Their global mutation scope is only `mail_gift_log.isOpened`/`receiveTime`; this table has no kingdom column. Queue locking also needs narrow timestamp UPDATE privileges. Relays delete acknowledged intents only; lost acknowledgments replay durable values without cross-database exactly-once claims.

Local delivery is default. External mode disables only matching realm pollers; drain consumers for cutover/rollback, preserving queues/receipts and avoiding deliberate dual consumers. Missing Chat configuration disables its consumer, without rerouting pending work locally. Distinct credentials/realm bindings are checked before/during delivery; provisioning credentials never enter runtime processes.

## Identity, Chat and media

Target Firebase Guest/provider linking preserves internal identity and realm characters. Client `loginFlag`, realm IDs and cached authentication do not establish authorization. Preserve native SFS/TCP types/order; HTTP/WS adapters use explicit tickets/contracts. Reconnect restores committed state and validates session ownership.

Chat owns message persistence/authorization, cursors, deduplication, signed updates and retention; Share owns the social feed. Target global/alliance retention archives after one day and deletes after seven days from sending, including archives. Redis fan-out is ephemeral. Chat/Server/external Workers share `CHAT_SECRET`; operation-specific mailbox signatures cover realm and owner fields.

API media supports authenticated JPEG/PNG input, JPEG re-encoding, immutable sequence receipts and SDK-presigned reads. Redis tickets bind realm upload/confirmation purposes; confirmation has no public gateway route. Replacement archives the old receipt/deletes its JPEG, defaults to three days and retries cleanup. Discovery/upload body limits are 64/2112 KiB.

`S3_ENDPOINT` is for API storage traffic; `S3_PUBLIC_ENDPOINT` signs client reads. Local service DNS avoids host-port hairpin routing. PostgreSQL avatar journals/per-owner revisions and signed Chat consumers order replay independently of clocks/sequence wrap. Moderation is an operator CLI. Media survives Chat loss with pending publication intents. GIFs, background transforms, orphan collection and the full pending/validated/ready lifecycle remain planned.

## Operator commands, payments and clients

Planned Admin submits versioned commands with operator, reason, scope and before/after audit. Rules move through draft, validation/simulation and versioned publication; accepted calculations retain their version. Rollback must respect persisted/in-flight state.

Target Stripe packages cost USD $1–$5. API creates orders/verifies signed webhooks; realm commands grant through ledger/idempotent receipts. Reconcile duplicates, delay, reordering, refunds and uncertain outcomes; redirects/client claims never prove payment.

Planned R2 Lua/native updates use immutable signed manifests/objects, hash/package/certificate/version checks, temporary download and recoverable activation. Preserve Android consent, signing identity, Guest recovery and progress; downloading is not installation. Flutter/Dart has no replacement deadline; SSR remains a separate experiment.

## Deployment and networking

Production target: European 16 GB single-node Kubernetes VPS for API/media, gateway, realm workloads, coordination and Workers; Pages for landing/docs/Admin, Vercel for experimental SSR, Neon, managed Redis/MongoDB, CloudAMQP, Firebase, Stripe and R2. Provider plans/regions, Chat/Bot hosting, private object storage, observability capacity and runtime remain open. A single VPS is one failure domain; the two-realm resource budget is unverified.

Target domains are `opencok.com`, `docs.opencok.com`, `admin.opencok.com`, `game.opencok.com`, `api.opencok.com`, without verified DNS/hosting. Traefik handles current HTTP/realm TCP ingress; Kong HTTP/WSS policies remain targets. SFS requires reachable per-realm TCP; browsers connect to backend WSS. Cloudflare HTTP proxying is not a TCP compatibility assumption.

Ingress allowlists discovery, public Chat metadata, signed uploads, JPEG reads and fixed-prefix CDN paths. Local services include API/Server/Chat, PostgreSQL/setup, MongoDB, Redis, ZooKeeper, MinIO/CDN, Maple and inspection tools. Explicit external database/cache/object endpoints need not depend on local containers. Chat uses direct development WebSocket port 8083. Mail Workers/Scheduler retain restricted opt-in boundaries across service profiles.

`env` injects validated API/realm configuration from one root `.env`, without app-local files or ambient Bun dotenv loading; Scheduler/Workers consume explicit environments. Local containers/outbound connectivity do not establish production compatibility or Kubernetes readiness.

## Observability, failures and promotion

API/Server/Chat use Evlog through Core with filtered local Maple logs/traces, controlled exceptions, durations and process metrics. Traefik exports filtered access logs/HTTP metrics over OTLP; ingress tracing stays disabled. Maple is optional at startup and has no native automatic alerting; private/loopback exposure and production capacity still need verification. The previous Compose port mapping alone did not enforce loopback access.

Correlate operation start/result/duration and prepared/committed/delivered effects. Telemetry is derived, not durable economic audit: Evelog is the audit concept, Elasticsearch optional search, and Firebase telemetry/FCM replace neither state nor delivery. Grafana/Loki/Prometheus/Axiom/Sentry remain suspended for these signals.

Writer loss stops mutations; uncertain commits resolve through receipts. Broker loss retains bounded outbox work. Optional Chat/media/telemetry/search fails promptly without blocking core gameplay; failed calculations leave recoverable reservations, never fabricated victory. Readiness, backlog exhaustion and durable delivery are distinct observations.

Before activation/promotion, prove stale/wrong-owner denial, real-entrypoint recovery, retry/reordering safety, dependency loss, drain/reconnect and isolated restore with pinned clocks/rules/RNG. Native rendering requires device/emulator evidence; record client/resource/protocol/schema/rule compatibility per artifact. Preserve valid accounts/progress through migrations and rollback.

Budget simultaneous two-realm peaks/recovery: command/calculation p99, CPU/RSS, event-loop delay, pools, queue age, deadline lateness, reconnect and provider RTT/quotas, including combat/media/infrastructure headroom. Establish SLO/RPO/RTO and incident ownership; VPS snapshots omit remote databases/objects/rules/secrets, so backups must cover them consistently. Administrative tools remain private operator surfaces. More processes or a 16 GB target prove neither performance nor availability.

Complete remaining domain extraction, ownership/dependency registers and equivalent recovery protocols before Player/World cutover. Scheduler/Workers remain initial restricted slices, not completion of #558 W15–W18. Remaining deadline groups, finer partitioning, provider deployment and capacity are open work.
