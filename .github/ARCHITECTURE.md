# OpenCoK Architecture

## Purpose and governing decisions

This document defines the target architecture for implementation. OpenCoK is a self-hosted persistent strategy game with isolated realms, shared identity, cities, alliances, marches, gathering, combat, progression, events and native clients. Infrastructure serves durable gameplay, predictable latency and recoverable operations.

The core is a modular TypeScript application with one logical gameplay writer per realm. API, Chat, Scheduler and Workers have separate operational boundaries. Scale across realms first; split authority inside a realm only after measured demand and a proven consistency protocol. Player and World are domain boundaries, not mandatory independent services.

Use Bun for development tooling and Effect for scoped resources and composition. Select the production runtime through protocol, dependency, performance and recovery validation. Runtime selection must preserve numeric behavior and native compatibility.

Authoritative state belongs to a named owner. Every economic effect must be durable, attributable and idempotent. Queues, caches, dashboards and telemetry never determine entitlement. Optional-service outages must not prevent unrelated city and core gameplay operations.

## Technology decisions

| Technology                                         | Architectural role                                                              | Adoption decision                                                  |
| -------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| PostgreSQL                                         | Identity, gameplay, economy, deadlines, receipts, outbox and audit              | Primary durable database                                           |
| Drizzle                                            | PostgreSQL schemas, explicit migrations and adapters                            | Persistence tooling                                                |
| PgBouncer or provider pooler                       | Bound database connections across application replicas                          | Use for production pooling; validate pooling semantics             |
| MongoDB                                            | Chat, social documents and selected retained histories                          | Secondary database with explicit collection ownership              |
| Redis operational                                  | Sessions, discovery projections, presence, rankings and operational projections | Separate from disposable cache; classify durability per key family |
| Redis cache                                        | Disposable, bounded read acceleration                                           | Separate instance when measurements justify caching                |
| RabbitMQ                                           | Asynchronous integrations and background commands                               | Default broker                                                     |
| BullMQ                                             | Specialized background job orchestration                                        | Deferred until a disjoint workload justifies it                    |
| Kubernetes                                         | Production scheduling, service discovery, replica lifecycle and rollout         | Production orchestration                                           |
| Traefik                                            | HTTP, WebSocket and native TCP ingress                                          | Single application ingress layer                                   |
| ZooKeeper                                          | Transitional coordination dependency                                            | Remove after replacement and recovery validation                   |
| MinIO                                              | Development S3-compatible object storage                                        | Development storage                                                |
| Cloudflare R2                                      | Production private media and public release objects                             | Separate private/public buckets and access policies                |
| Maple                                              | Filtered logs and traces                                                        | Diagnostic observability                                           |
| Sentry                                             | Error grouping, release diagnostics and sanitized stack details                 | Error observability                                                |
| Prometheus, Alertmanager, Grafana                  | Metrics, actionable alerts and dashboards                                       | Operational monitoring                                             |
| Unleash                                            | Controlled feature activation by realm, environment and client compatibility    | Feature management                                                 |
| PostGIS                                            | Spatial indexing and geometry queries                                           | Evaluate against integer grid/cell indexing before adoption        |
| ClickHouse                                         | High-volume economic and progression analytics                                  | Later phase when analytical load warrants isolation                |
| pgAdmin 4, mongo-express, Redis Insight, Portainer | Database and container inspection                                               | Private, optional development tools                                |

Do not add Memcached, Nginx per application, Kong, application-managed etcd or Consul without a specific unmet requirement. Kubernetes manages instances; additional proxies do not provide gameplay ownership. RabbitMQ and BullMQ must not become competing delivery paths for the same operation.

## Applications and domain boundaries

| Application boundary | Responsibilities                                                                                                 |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| API                  | Account discovery, authentication integration, realm admission, HTTP endpoints, media access and payment ingress |
| Game Server          | Native TCP/SFS gateway and realm gameplay composition; authenticate, route and apply authoritative commands      |
| Chat                 | Authorized conversations, message persistence, replay, retention and social delivery                             |
| Scheduler            | Discover durable due work and request evaluation from its owner                                                  |
| Workers              | Process committed integration intents, notifications, email, media work and projections                          |
| Admin                | Authenticated operator interface submitting audited commands through application APIs                            |
| Web                  | Browser experience through explicit HTTP/WSS contracts                                                           |
| Bots                 | Controlled authenticated clients for simulation and load evaluation, with quotas and a kill switch               |

Gateway and gameplay may share a deployment initially. Separating the gateway must preserve native session behavior, realm routing and reconnect semantics. Workers and Scheduler cannot acquire gameplay authority or mutate gameplay tables directly.

Domain ownership includes Account/Identity, Player, Economy/Ledger, City/Production, Building, Research, Troops, Equipment, Hero/Dragon, World, Alliance, Tasks/Events, Ranking, Mail, Chat/Share and Media. Each domain owns its rules, contracts and persistence operations. Combat calculations belong to gameplay and do not constitute an independently authoritative service.

Applications compose configuration and concrete adapters. Reusable packages never import applications. Controllers validate transport input and delegate to injected Services. Domain rules remain independent of sockets, brokers, ORM initialization and process startup. DTOs, contracts, validations and wire mappings have explicit owners; avoid universal registries and dependency cycles.

## Persistence and data ownership

Use a global PostgreSQL database for shared identity and global service records, and isolated physical databases per kingdom for gameplay. Scope credentials, connection budgets and migrations per service and realm. Runtime identities cannot change schemas or repair grants. Immediate reads and mutation preconditions use the primary; replicas serve only reads with defined staleness budgets.

| Data                                                            | Durable owner and storage                              | Derived or secondary representation                       |
| --------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------- |
| Accounts and character discovery                                | Global services, PostgreSQL                            | Cached discovery                                          |
| Characters, balances, inventory, city and progression           | Realm domains, PostgreSQL                              | Read-only caches                                          |
| Troops, march reservations, gathering cargo and combat outcomes | Realm authority, PostgreSQL                            | Map projections and rendered reports                      |
| Construction, research, training, quests and event deadlines    | Owning gameplay domain, PostgreSQL                     | Scheduler discovery metadata                              |
| Reward eligibility, ranking finality and claims                 | Realm economy/event owner, PostgreSQL                  | Published boards in Redis                                 |
| In-game mail gifts                                              | PostgreSQL entitlement, claim receipt and ledger       | MongoDB message bodies or rendered reports                |
| Chat and social content                                         | Chat/Share, MongoDB                                    | Ephemeral Redis fan-out                                   |
| Required jobs, email delivery and integration intent            | Owning service, PostgreSQL outbox and receipts         | RabbitMQ transport; redacted execution history in MongoDB |
| Operational cron definitions                                    | Versioned deployment configuration                     | Execution observations                                    |
| Business schedules                                              | Owning service, PostgreSQL                             | Discovery indexes                                         |
| Media and releases                                              | MinIO in development, R2 in production                 | PostgreSQL metadata, access and lifecycle receipts        |
| Rules and catalogs                                              | Versioned maintained artifacts and publication records | Injected runtime data and derived caches                  |
| Analytical events                                               | Committed source events; later ClickHouse projections  | Dashboards and aggregate reports                          |

MongoDB is not a category for unimportant data. Authoritative Chat documents require backups, schema versions, bounded document sizes, indexes and retention. Missing message bodies must not destroy gift entitlement or permit duplicate claims. Use PostgreSQL JSONB for flexible documents that need the same transaction as gameplay state.

Keep a registry of table/collection/key ownership, permitted writers, retention, recovery source and deletion semantics. Database separation does not create atomic cross-database transactions. Use explicit intent, receipts and reconciliation across owners.

PgBouncer or the provider pooler bounds connections across replicas. Validate transaction/session pooling against prepared statements, advisory locks and session state; session-scoped authority cannot rely on an arbitrary pooled backend. Set both connection and active-work budgets per realm. [PgBouncer compatibility](https://www.pgbouncer.org/features.html)

## Realm authority and command processing

Model each realm as an actor-like authority with bounded command admission and explicit ordering for conflicting aggregates. This is an application model, not a requirement for an actor framework or one global queue shared by all realms. Read-only work and pure calculations may execute concurrently; authoritative mutations preserve participant lock order and transaction invariants.

Acquire a monotonically increasing owner epoch in PostgreSQL. Every authoritative transaction verifies the active epoch so a paused or partitioned former owner cannot commit after replacement. Leadership discovery, Kubernetes Leases and Redis locks alone are insufficient. Authority loss stops mutation admission and invalidates pending proposals.

Commands carry realm, authenticated participant, operation identity, contract version and expected aggregate version where applicable. Commit state, economic ledger, operation receipt and outbox atomically. Repeated requests return the recorded outcome; uncertain commits are resolved through receipts instead of speculative retry effects.

Keep Player and World in one transactional authority while their operations share atomic invariants. If future load requires separate writers, define independent epochs, table permissions, durable reservations, acceptance/results and reconciliation first. A timeout is an uncertain outcome, never permission to release possibly consumed troops. Scale realms across machines before introducing this protocol.

## World map, marches and realtime updates

Partition the map into bounded cells for lookup, visibility subscriptions and update fan-out. Persist integer coordinates and occupancy constraints. Candidate discovery does not authorize placement: the owner rechecks occupancy and policy in the committing transaction.

Benchmark grid/cell indexes against PostGIS using representative realm density, viewport queries, nearest-resource searches and alliance territory queries. Adopt PostGIS when geometry/intersection requirements or measured query cost justify it. Use game-coordinate geometry with explicit units, not terrestrial geography. Spatial search remains subject to realm and visibility rules. [PostGIS spatial indexes](https://postgis.net/documentation/faq/spatial-indexes/)

Persist march origin, destination, selected troops/companions, departure time, arrival deadline, state version, reserved costs and pinned rule outcomes. Derive visual position from these values where movement rules permit; avoid writing every animation step. Interception, retargeting and other meaningful transitions produce durable checkpoints. Gathering records recoverable participant cargo and shared-resource consumption.

Subscribe players to authorized visible regions rather than broadcasting every world change to the whole realm. Limit subscription count, viewport size, update rate and outbound buffer size. Filter protected information before publication. Coalesce superseded visual updates while preserving authoritative transitions.

Reconnect uses a consistent snapshot plus versioned subsequent updates. Define the snapshot watermark and replay boundary; detect gaps and request a fresh snapshot when bounded replay is insufficient. Native SFS/TCP and browser HTTP/WSS adapters preserve their own wire contracts. Backend improvements must not assume native clients support new messages or WebSocket replacement.

## Time, progression and combat

Persist server-time deadlines and aggregate versions. A scheduler discovers indexed due work within bounded horizons and asks the owner to evaluate it. Broker delays, Kubernetes CronJobs and cron triggers are wake-up mechanisms, not proof that a reward is due.

Start, cancellation and acceleration update costs and deadlines atomically. Foreground commands, reconnect and Scheduler use the same transition identity. Recheck eligibility, due time, generation and predecessor ordering under the owner transaction. Use bounded catch-up after downtime rather than one timer per player or unbounded replay.

Settle production at rate/effect changes before applying new bonuses. Preserve fractional accumulation, collection caps and already earned balances. Event closure and ranking finality use explicit cutoff rules, durable eligibility and idempotent reward claims.

Combat runs deterministic calculations from immutable snapshots in a bounded worker pool. Record rule version, numeric bindings and reproducible random outcomes. The realm owner checks epoch, input versions and reservations before applying losses, rewards and reports. Worker failure leaves recoverable work; it cannot fabricate victory or free troops prematurely. Preserve native numeric width, rounding and ordering with differential vectors and replay tests.

## Messaging and background work

RabbitMQ is the default transport for committed integration events and asynchronous commands. Publish through an outbox, use publisher confirms and mandatory routing with returned-message handling, and acknowledge consumption only after owned effects and deduplication receipts commit. Use durable queues and persistent messages; choose quorum queues with independent nodes when replicated durability is required. [RabbitMQ reliability](https://www.rabbitmq.com/docs/reliability)

Delivery is at least once. Define ordering per aggregate, bounded concurrency, retry backoff, attempt limits, dead-letter inspection and controlled replay. Include operation identity, realm, schema version and tracing context. Avoid carrying unnecessary private payloads. Monitor oldest pending work as well as queue depth.

Broker outages retain durable intent. Enforce admission/backlog limits before storage exhaustion and expose pending/unavailable states truthfully. For external email or other irreversible integrations, use provider idempotency when available and reconcile uncertain results; a local receipt alone cannot guarantee exactly-once external delivery.

BullMQ is optional only for a clearly separate job class with demonstrated scheduling or orchestration benefits. For a Redis-backed adoption, use dedicated persistent Redis with no eviction and recovery tests; never use the disposable cache instance. Required business intent still belongs to its durable owner. [BullMQ production guidance](https://docs.bullmq.io/guide/going-to-production)

## Redis and caching

Separate operational Redis from disposable read cache. Inventory every operational key family: source of truth, lifetime, rebuild procedure, persistence needs and behavior after loss. Sessions may require reauthentication after loss; cached rankings must be rebuildable from committed economic/event records. No gameplay progress or unique configuration may exist only in Redis.

Use a separate cache instance with bounded memory, explicit eviction, TTLs, jitter, stampede protection and invalidation after commit. Include realm and relevant data/rule version in keys. Do not use cached balances or stale replicas to authorize spending. Logical Redis database numbers do not isolate memory, eviction or instance failure. [Redis eviction](https://redis.io/docs/latest/develop/reference/eviction/)

Redis presence and Pub/Sub are ephemeral signals. Durable Chat replay and authoritative gameplay recovery use their owners. Memcached is not part of the target unless a measured requirement warrants another cache technology.

## Identity, social systems and operator access

Keep internal account identity stable across Firebase Guest/provider linking, reconnects and client updates. Realm selection and client flags do not establish authorization. Validate session ownership, realm membership, command scope and character limits server-side.

Chat owns conversation authorization, durable messages, cursors, deduplication and retention. Alliance membership and roles gate access; reconnect must revalidate authorization. Share owns feed visibility. Define retention per collection; global/alliance messages archive after one day and delete after seven days from sending, including archives. Retention cleanup is independent of gameplay deadlines.

Admin submits versioned commands with operator identity, reason, scope and before/after audit. Direct dashboard edits to gameplay databases are not an administration workflow. Separate authentication, operator authorization and service credentials; privileged operations require least privilege and auditable outcomes.

## Live operations and compatibility

Use Unleash to activate features by environment, realm and validated client compatibility. Release first to controlled test realms, then expand based on operational evidence. Define stable evaluation context, cached last-known configuration and safe defaults during feature-service outages. [Unleash activation strategies](https://docs.getunleash.io/concepts/activation-strategies)

Flags control admission to features, not retroactive outcomes. Persist the accepted rule/configuration version with marches, battles, purchases and event participation. A kill switch stops new work while existing work completes or follows a documented recovery path. Avoid player-level competitive experiments that grant unequal economic rules inside the same realm.

Maintain catalogs as typed versioned artifacts with one authoring source. Preserve native identifiers, aliases, numeric widths and wire order; unknown client-only content remains unavailable until behavior is established. Catalog validation covers references, collisions, coverage and semantic consumers. Original resource inputs remain outside runtime dependencies.

Track supported client/resource/protocol/schema/rule combinations. Native device or emulator validation is required for release compatibility. Signed immutable release manifests and objects use hash, package, certificate and version checks, temporary downloads and recoverable activation. Preserve account recovery and saved progress through updates.

## Media, storage and payments

Use MinIO for development and Cloudflare R2 for production through S3-compatible adapters. Verify signing, CORS, object metadata, lifecycle and deletion parity. Separate private uploads and receipts from public release assets. Keep metadata and access decisions in PostgreSQL.

Authenticated media flows validate type and size, re-encode supported images, enforce replacement eligibility and record immutable receipts. Cleanup is retryable; missing Chat publication must not lose accepted media. GIF processing and other transforms use bounded Workers and explicit resource limits.

R2 stores objects; public CDN delivery uses a custom domain and explicit cache policy. Immutable versioned keys avoid stale release replacement. Private media requires authenticated or purpose-bound signed access and must not inherit public bucket policies. [R2 public access and caching](https://developers.cloudflare.com/r2/buckets/public-buckets/)

Payment APIs create orders and verify signed provider webhooks. Stripe is the payment integration target. Client redirects do not prove payment. Apply grants through realm commands with ledger receipts, handling duplicates, reordering, refunds and uncertain outcomes through reconciliation.

## Deployment and networking

Use Compose for ordinary development and Kubernetes for production, with a representative Kubernetes validation environment before rollout. Traefik terminates and routes HTTP/WSS and exposes native TCP entrypoints. Kubernetes Services/DNS provide service discovery; Leases may coordinate leadership candidates while PostgreSQL enforces mutation authority. [Kubernetes Leases](https://kubernetes.io/docs/concepts/architecture/leases/)

Remove ZooKeeper only after registration, session expiry, startup admission, ownership loss and reconnect semantics have replacements. Do not introduce an application-managed coordination cluster merely to replace it. Nginx per application and additional API gateways require a demonstrated routing or serving requirement.

Set resource requests/limits, startup/readiness checks, shutdown drains and restricted service identities. Scale API, Chat and Workers independently within storage and queue budgets. Scale gameplay by realm placement; adding replicas cannot create concurrent authoritative writers. Native TCP sessions require explicit drain and reconnect handling, not just HTTP readiness.

Keep durable stores and brokers independently operated or managed where practical. Providers and regions must satisfy measured latency, quotas, recovery and cost; self-hosting remains supported. A European 16 GB single-node VPS is a capacity candidate, not an availability or performance guarantee. Separate nodes/failure domains are required for actual redundancy. Cloudflare HTTP proxying does not imply support for native game TCP.

Development inspection tools are optional private profiles: pgAdmin 4, mongo-express, Redis Insight and Portainer. Administrative UIs stay off public ingress. Portainer access is privileged; versioned manifests remain the deployment source of truth. Configuration is validated and injected, with isolated development/production credentials and narrowly scoped secrets.

## Observability and analytics

Maple owns filtered logs and traces. Sentry owns grouped exceptions, release correlation and sanitized stack diagnostics; avoid duplicate tracing pipelines by default. Validate SDK behavior against the production runtime and restrict source-map access. Exporters must redact credentials, player payloads and message bodies and meet [security requirements](SECURITY.md).

Prometheus collects bounded-cardinality metrics, Grafana presents dashboards, and Alertmanager routes actionable alerts. Do not label metrics by player or operation ID. Track command and combat latency, event-loop delay, CPU/memory, connection pools, queue age, deadline lateness, reconnect failures, authority loss and pending rewards. Test the alert delivery path. [Prometheus alerting](https://prometheus.io/docs/alerting/latest/overview/)

Correlate prepared, committed and delivered work with operation/trace identifiers in controlled diagnostics. Economic ledger and audit receipts remain durable application records, independent of log retention. Optional observability outages cannot block gameplay.

Start analytics with bounded PostgreSQL queries and aggregates. Adopt ClickHouse when event volume or analytical queries interfere with transactional workloads. Analyze currency sources/sinks, reward anomalies, progression funnels and combat distributions from committed events. Define schema evolution, deduplication, lateness, retention and privacy before ingestion. Analytical findings never directly establish balance or reward entitlement. [ClickHouse gaming analytics](https://clickhouse.com/industries/gaming)

## Recovery, validation and adoption

Define SLOs, tolerated data loss (RPO), recovery time (RTO) and incident ownership before production promotion. Backups cover PostgreSQL, non-reconstructible MongoDB documents, private objects, rules and required configuration; replicas and VPS snapshots alone are insufficient. Test isolated restoration and reconciliation across stores. Versioned objects and deletion policies must support the recovery plan.

Validate stale-owner denial, duplicate/reordered commands, uncertain commits, broker loss, cache loss, worker crashes, deadline catch-up, march return, reward finality, native reconnect and graceful drain. Exercise two-realm peaks and restart recovery with pinned clocks, rules and random outcomes. Measure p99 latency and backlog recovery alongside throughput.

Implement in this order:

1. Establish domain ownership, PostgreSQL transactions, fencing, ledger, deadlines, outbox and recovery contracts.
2. Build bounded realm command processing, deterministic combat execution, map cells and compatible snapshot/delta recovery.
3. Introduce RabbitMQ delivery and isolated secondary document storage with reconciliation and restore tests.
4. Add pooling, metrics/alerts, Sentry and controlled feature rollout; introduce disposable cache only for measured workloads.
5. Validate Kubernetes routing, native sessions, drains and authority replacement, then remove ZooKeeper dependencies.
6. Validate R2 private/public separation and signed client distribution before production release.
7. Evaluate PostGIS and ClickHouse against representative query and analytical workloads; adopt only with evidence.

This sequence does not authorize destructive migrations. Every schema or ownership change needs a bounded rollout, in-flight-state handling and a rollback/forward-recovery procedure that preserves valid progress. Changes to deployed behavior require the corresponding unit, integration, contract, recovery and native-client evidence.
