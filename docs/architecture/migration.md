# Migration design and implementation evidence

Detailed reference for the [architecture overview](../../.github/ARCHITECTURE.md).
Section numbers match that overview. Target designs and historical evidence below
do not establish implementation or production readiness. Component runbooks and
[the migration evidence](../migration-validation.md) track current behavior.

## 15. Sequence of evolution and pending decisions

1. **Contracts and core:** stabilize login, city, persistent construction, and the map;
   create differential tests and synthetic scenarios per client version.
2. **Modular server:** consolidate domains and adapters; separate Chat, the
   shared API with media, and workers, with connection and resource limits.
3. **PostgreSQL migration:** map types and 64-bit integers, IDs, timestamps, balances,
   queue sentinels, and transactions; rehearse copying and reconciliation. Do not merely
   replace the driver or maintain informal dual writes with MariaDB.
4. **Data cutover:** copy with a backup, verify counts and invariants, synchronize the
   final delta in a controlled window, and choose a single writer. Rolling back after
   new writes requires planned reconciliation.
5. **Dashboard and edge:** publish WWW/Docs/Admin on Pages and Web Game on Vercel;
   integrate Firebase, auditing, and rule versioning; enable Kong and API contracts.
6. **Controlled production:** validate Kubernetes, replication, backups, failover,
   observability, and load before expanding realms and bot populations.
7. **Independent experiments:** evolve the web port and measure the need for MongoDB,
   Elasticsearch, complementary BullMQ, and a future computation engine only through a new reviewed decision. Evaluate the
   Flutter client alongside the current APK; validate the Lua/native updater and R2
   distribution before enabling updates.

Decisions still open: numerical validation and Combat TypeScript benchmark; SSR
framework/adapter at Vercel; Neon, Redis.io, MongoDB Cluster, and CloudAMQP plans and
regions; Chat/bot hosting; storage of other objects; observability backend; validation
of the 16 GB VPS and admission capacity for both default kingdoms; eventual migration from Combat
TypeScript to Rust/Go; complementary use of BullMQ and version/fork of Konga;
feasibility of the Lua/native bridge, APK signing identity and scope/rendering of the
eventual Flutter client. The Auth, payment, R2 releases, and core hosting providers
defined in this document do not remain open.

Clients in `mobile/` and references in `legacy/` maintain separation between
original inputs, patches, and installation artifacts. Extracted originals and keys are
read-only; builds use separate area. Private materials, player data and credentials do
not go into the code or diagrams. No step in this document authorizes progress reset,
migration execution or deployment.

### 15.1. PostgreSQL database package

`packages/drizzle` is the application's PostgreSQL persistence package. Its maintained
Drizzle schemas in `src/schema` are the source of truth: 782 tables and 6,381 fields,
with one module per table. The package root exposes a typed PostgreSQL client, and
`schema/global` / `schema/kingdom` provide the corresponding role-specific models.

The default physical databases are `opencok_global`, `opencok_kingdom_1` and
`opencok_kingdom_2`, with configured kingdom IDs 1 and 2. The global database contains
`opencok_global`, `opencok_pay` and `opencok_chat` (115 tables). Both kingdom databases
contain the same `opencok_kingdom` namespace (667 tables each). One set of kingdom
table modules and migrations serves every configured kingdom; there are no per-ID
schema copies. Table/field names and values remain stable. Database names and
credentials are configuration. Pools and local transactions belong to one physical database; there
is no cross-database atomic commit. The future chat service/storage transition is a
separate domain change.

Standard Drizzle Kit generation maintains independent PostgreSQL migrations and
snapshots per role. The migration command applies only pending SQL using Drizzle's
journal and serializes deployments with a PostgreSQL advisory lock. Generated SQL statement breakpoints are disabled to
keep migrations comment-free. Removing historical breakpoint comments changes file
hashes but not SQL statements or journal timestamps; existing applied migration
records are retained, and no migration history or player data is reset. It refuses a
database containing the other role's application schemas. New kingdoms apply the same
kingdom migrations to separate databases. Default setup creates missing configured
databases and applies pending migrations. Typed connection routing selects a kingdom
by validated ID. Namespace-renaming migrations preserve existing PostgreSQL records;
physical database names can be overridden for existing deployments. No schema generation reads another engine's
SQL, and no transfer/checkpoint/comparison infrastructure is part of the runtime.

Schemas use PostgreSQL builders, declared keys/checks, native identities/sequences,
exact bigint/numeric handling and a minimal bytea Buffer adapter. Calendar-string
columns retain their existing text/value contracts, including sentinel values, with
inline format/calendar checks. Changing those data contracts requires its own domain
migration. Automatic application update timestamps use Drizzle's onUpdate callback;
explicit SQL writers must supply the required update fields. Text comparisons use
the database's PostgreSQL collation and ordinary SQL operators. `mail.rewardId` is
an explicit exception: the application still reads/writes a string, while its
Drizzle adapter stores UTF-8 `bytea` to preserve embedded NUL characters. The
incremental kingdom migration converts existing text without interpreting escapes;
raw SQL writers use UTF-8 bytes. This enables lossless legacy data import without
removing characters or adding player-specific exceptions to application code.

Unit tests, one snapshot per table, and PostgreSQL persistence E2E cover the complete
schema, defaults/constraints, transactions, migration repeatability, realm isolation
and restart. The [package guide](../../packages/drizzle/README.md) documents imports,
generation/migration commands, data representations and verification.

### 15.2. Shared server environment

`packages/env` owns server environment configuration validated with Zod and inferred
TypeScript types. It locates the workspace root from its own module and loads only the root `.env`, independently of the working
directory. Explicit process/CI variables override file values. The file is optional
for CI and offline tooling; each operation requires the settings it actually needs.
The root `.env.example` documents the supported keys; private env files are ignored.
Validation reports variable names without exposing supplied values.

Effect applications consume `EnvironmentLive` and `readEnvironment` through
`@opencok/env/effect`; configuration failures occur inside their startup Effect.
Database/offline consumers can still import `env` / `requireEnv` from
`@opencok/env` for general settings
and `@opencok/env/database` for database-only settings, instead of reading configuration
directly from `process.env`. Each subpath validates and exposes only its domain.
The package does not mutate `process.env` and must not be imported into browser/mobile bundles. Runtime composition passes
validated settings to adapters. Bun's root configuration disables automatic dotenv
variants; the Drizzle package links that configuration for package-local invocation
and pins Drizzle Kit's own dotenv loader to the same root file. See the
[environment guide](../../packages/env/README.md) for commands and deployment assumptions.

### 15.3. First PostgreSQL server migration slice

`apps/server` now contains the first port of the working Bun `apps/new-server`
experiment: SFS/TCP transport for mobile 12.06.0, existing-account authentication,
city bootstrap, deferred login data and base-world viewport reads. Transport,
compatibility DTOs and the persistence adapter remain colocated for this initial
slice; shared package extraction can follow once contracts stabilize.

The adapter implements explicit read interfaces using existing `@opencok/drizzle`
tables, with separate global/selected-kingdom connections. Snapshot transactions
are read-only, repeatable read and UTC. Redis session keys and ZooKeeper ephemeral
registrations include the kingdom ID; map rows come from the selected PostgreSQL
database rather than the experiment's shared `world1` hash. Runtime setup does not
apply migrations or provision player state.

Public player summary queries can read a second explicitly configured realm through
`GAME_PLAYER_KINGDOMS`. The global account directory routes missing numeric player
IDs to the authoritative database; each realm uses its own read-only snapshot.
This grants no cross-realm write authority and does not enable cross-realm gameplay.
Only public fields and required presentation metadata are selected, with a separate
allowlisted wire DTO. Missing routes and dependency failures reject the response;
remote availability does not gate local login readiness. Update markers use the
realm-scoped Redis `player-update` namespace. See the server guide for exact key
format, configuration and legacy compatibility details. This incremental query
work is currently validated with unit tests and synthetic adapters only.

The full `get.user.info` public query also uses configured realm reads. It routes
through the global directory first, with a local-realm fallback only when the
directory has no entry. The selected realm supplies a repeatable-read snapshot of
identity/progression, statistics, general previews, equipment, medals, flowers,
offices and alliance presentation. The observer's authenticated membership controls
alliance capacity visibility. Target identity and realm mismatches reject the query;
no public command grants cross-realm write authority. Legacy getter repairs and
write side effects remain documented gaps in the server guide, not migrated mutations.

Ordinary-realm power, kill and level ranking queries read the requester, bounded
candidates and fallback position in a single read-only repeatable-read transaction.
The rules layer preserves each board's exclusions and candidate-window semantics;
the DTO layer exposes only public ranking fields. These commands read persisted
scores without introducing score writers or Redis ranking state. Fresh snapshots
and deterministic final UID ordering replace the legacy cache lifecycle and
unspecified ties; the server guide records collation and verification limitations.
Alliance power/kill queries follow the same snapshot boundary, aggregating persisted
member statistics and, for candidate power, alliance-science power. Batched science
and video reads supply public presentation. The rules preserve distinct candidate
windows and member-only fallback positions; these reads grant no alliance write
authority and introduce no cache or schema dependency.
The castle board reuses the player-ranking boundary with distinct candidate and
fallback ordering. Its fallback offset uses a SQL window within the snapshot;
construction queues and persisted power are never recalculated by the query.
Material-contribution rankings read the existing contribution table with their own
window and empty-list response contract; score writers and activity resets remain
outside the query boundary.
The `act.score.rank` query reads the existing `SCORE_ACT_RANK_<kingdomId>` Redis list
through the realm cache adapter. This is an opaque published board: strings, duplicates,
empty values and list order remain unchanged. The local authenticated owner and realm
are checked before reading; request parameters cannot select a different realm. Missing
lists and reached command failures return an empty board, matching the reference list
reader's fallback. Invalid data or maintained SFS bounds reject the response instead of
truncating it. The reader does not mutate scores or rebuild/expire the board; the event
publisher remains responsible for its derived-cache lifecycle. No event lifecycle or
`hero.self.rank` in-memory activity/rank-map provider is implied. This extends the accepted
Redis query-cache boundary without adding a schema, service or authoritative ledger.
Focused command/cache units and disposable Redis tests verify realm isolation, exact
opaque strings, bounds, outage fallback and unchanged board contents/expiry.
Global celebrity ranking queries first read the selected realm's global `server_info`
type, accepting the reference normal/test/inner-test/green types before decoding the
selector. A fresh metadata read replaces the reference process-local type cache. The
local authenticated profile is checked before the selected published Redis list is read;
types 1 and 5 share the power list. The cache adapter selects only the bounded reference
range, then the existing legacy JSON decoder reconstructs ordered `rankMap` objects.
Missing lists remain empty, while cache failures and malformed/oversized data reject.
These public derived boards grant no score-write authority and add no lifecycle or TTL.
Command/cache/repository units and disposable PostgreSQL/Redis tests cover category
windows, aliases, fresh realm metadata, exact wire values and dependency failures.
The server guide records keys, bounds, metadata fallback and verification limits.
Dragon Battle ranking queries read the existing global published team list and reverse
sorted-set rank through the runtime cache adapter. The controller supplies the verified
local profile's alliance ID; request parameters select ranges only. Pure rules preserve
Java range decoding/arithmetic, the decoder projects canonical published records with
exact integers, and DTOs preserve the public field widths and conditional wins types.
Sequential list/self reads retain the reference non-atomic snapshot and missing/read
failure fallback. Maintained size bounds reject oversized results; no match, team, score
or reward mutation is introduced. Producer/import lifecycle and lenient noncanonical
JSON parity remain outside this query slice, as detailed in the server guide.
Command/rule/cache units and disposable Redis tests cover range arithmetic, duplicate
rows, own-alliance lookup, public wire types, maintained bounds and read-only state.
Expedition ranking reads use the shared Redis instance with a global realm-pairing
record and lower-realm score/metadata keys. A read-only Lua evaluation revalidates
pairing and returns a consistent bounded board; one retry handles a rematch. The
controller authenticates the local owner, decodes integer-preserving metadata and
projects only public fields. Importing authoritative event state and maintaining
pairings/scores remain separate from the reader; namespace and verification details
are in the server guide. Resource-load queries independently consume the pairing
record's optional canonical `status` enum and never infer a phase from dates or a
match ID. Older pairing records remain valid for ranking, but supply no known phase.

Mailbox category status reads the authenticated recipient's grouped counts with the
owner profile in a read-only repeatable-read snapshot. Contents and reward payloads
stay outside this read interface. Pure rules retain the combined versus selected
category distinctions and numeric widths. The status query grants no mutations.
Mailbox save/cancel commands use a separate recipient-scoped write interface. A locked
owner profile authorizes each realm transaction; conditional saved-flag updates and
durable `mail_update` markers commit together. Marker timestamps never decrease and
only matched owned messages receive markers. The additive kingdom migration supplies
the marker table; category/conversation deletion and redemption remain separate work.
This follows ADR-0002/0005 without dual writes to
Redis. Absolute flag assignments preserve repeat-request state absent intervening
changes; correlation fields do not provide durable command receipts. The server guide
records these limits, compatibility differences and unit-only validation.

The `chat.get.update.mails` reader now consumes those existing realm markers in an
owner-authorized repeatable-read write transaction. It selects inclusive cursor deltas,
joins only message identity/recipient/flags and validates the response before cleanup.
Foreign or missing messages become deletion IDs; foreign markers are removed by exact
owner/ID/observed-time predicates. Aging uses both the requested cursor and its wrapped
signed-Long five-day cutoff, preserving strict boundaries. A fresh same-owner profile
lock coordinates maintained writers. Complete deltas are limited to 10,000 markers;
overflow rejects without partial output or cleanup. Stable UID ordering replaces the
unspecified cache/hash iteration order. SQL failures reject rather than masquerade as
an empty cache result, and cleanup commits atomically after projection, unlike the
reference's independent cache deletions. No schema or cache-key addition is required.
Unit cases are authored but execution of this new reader is deferred by user instruction.

Conversation/type saving uses a separate owner-locked transaction with a recipient
predicate and one set-based update. Rules map client message types and select personal
text or moderation conversations; raw signed saved flags are retained. This command
does not emit synchronization markers or contact chat, matching its legacy behavior.
It loads no message contents and imposes no conversation-size truncation. Wire rules,
transaction failures and ownership are covered by synthetic units only.

Category-only batch deletion and scalar-type conversation deletion now have separate
owned transaction adapters. Category reads aggregate pending-reward counters before
mutation, retain raw numeric label keys and validate the complete reply before deletion.
Auxiliary cleanup follows the selected owned primary rows, while primary deletion keeps
its separate saved/reward predicates. Type deletion ignores saved flags and removes only
the matching type-group pointer. Neither branch invents chat, synchronization or reward
effects absent from its reference path. Nonempty ID batches and sender-selected deletion
remain unavailable until their distinct group/invitation/chat effects are implemented.
The command boundaries reject these scopes before writes; the existing schemas suffice.

Conversation read marking has a pure request/effect contract that preserves ordered
mailbox assignments and chat-service intents. It performs complete prevalidation,
retains conditional versus unconditional status assignments, and does not drop chat
effects when mailbox updates would match no rows. Command dispatch supports only plans
without chat effects, validating the complete correlated success envelope before the
owned transaction. Sender selections and the exact all-peer trigger remain unsupported
before any write until a recoverable private-chat read-state consumer and delivery are
wired. Runtime repository dispatch enforces the same boundary. Public room history is
not that consumer. An independent repository adapter locks the owner, checks
realm/ban state, updates the union of mailbox predicates without fetching bodies and
inserts immutable realm `mail_chat_read_intent` rows in the same transaction. Null
mailbox status is unchanged except for bottle assignments; null sender equality matches
no mail but still emits its raw chat intent. UUID/effect-position keys identify delivery
retries; separate command invocations get fresh identities. Owner-serialized admission
bounds pending events to 1,000 before any write. The additive kingdom migration is
generated only; no runtime worker consumes its chat intents yet. Mailbox-only dispatch
reuses the adapter without creating intents. Future delivery must preserve peer semantics,
effect ordering and idempotent acknowledgment without assuming a cross-database
transaction. Synthetic driver units cover SQL and
rollback; actual database execution, locking and acknowledgment ambiguity are unverified.

Read-status commands share the owner-lock and atomic marker boundary. Individual
unread gift transitions additionally insert a realm `mail_gift_opening` outbox record;
batch marking deliberately omits that event. A lifecycle-owned relay locks bounded
pending batches with `SKIP LOCKED`, updates matching recipient-scoped global gift logs
in a separate transaction, then acknowledges the realm records. Repeat assignments
use immutable event timestamps, allowing retries after global commit or acknowledgment
failure. Missing global log rows are acknowledged without creation. The relay retries
after five seconds and drains before database disposal; pending events never depend
on Redis availability. This implements recoverable logging, not cross-database atomicity
or attachment grants. The additive migration and runtime are unit-verified only.

Ordinary `mail.delete` transactions enforce recipient, exact saved-flag and reward-status
predicates before removing rows. Returned IDs authorize auxiliary-content cleanup and
durable synchronization tombstones. A controller-supplied policy interprets invitation
JSON and group rules while the repository owns the transaction and enforces recipient
predicates on every associated write. Group pointers refresh from remaining messages;
valid move-invitation invalidation stays within the selected realm. All effects roll
back together. Protected messages retain their contents and groups, correcting an
inconsistency in the legacy helper. No new schema is needed; the server guide records
legacy comparator quirks, extra-content import requirements and unit-only evidence.

Mail detail reads use a separate read-write repeatable-read transaction because the
reference removes malformed structured messages. The owner and selected mail rows are
locked; recipient-scoped metadata bounds aggregate payloads before body retrieval.
A controller projection decodes stored content and validates the correlated SFS response
before authorizing owned malformed-row removal. Capacity, missing extra storage and
unresolved decoder forms reject without removal. This path changes no read status,
reward, auxiliary, group or synchronization state. The server guide records the bounded
permissive decoder, remaining syntax/order differences and synthetic unit evidence.

Category mailbox lists use the same owner-locked write boundary because malformed
structured entries can be removed. Metadata bounds the newest-first mailbox window before
loading bodies and reward descriptors; category filtering follows that window. An async
controller projection can request only bounded public sender and translation data. Local
profiles, alliance abbreviations and persisted translations share the mailbox snapshot;
global account routing and configured remote public profiles are separate reads. Only
public identity fields cross this boundary, with no remote writes or cross-database atomicity
claim. Recipient update metadata reuses the realm-scoped player-update service. Missing
optional translations preserve original content; external machine translation remains
unavailable. The server guide records configuration, limits and degraded behavior. Both
category and detail readers validate the wrapped extension response before authorizing
owned primary-row cleanup. SQL, routing, projection and cleanup remain unit-verified only.

Paginated message and conversation reads share the owned mailbox-window boundary with
category listing. `mread.chat` reuses the `mread.batch` selector paths, defaulting only
an absent type to personal conversation. Both retain their actual command name during
complete-response validation before cleanup, including explicit group selections.
Fetching conversation content does not mark it read or write chat-service markers.
Selector predicates run before pagination; categories retain
post-window filtering. Both use the same presentation readers and serializers, with
separate ordinary, category-chat and conversation envelopes. Group selectors use a
separate owner-locked transaction and a scoped preview reader: domain rules select group
families while the repository owns the SQL predicates, whole-group aggregates and
bounded body retrieval. The complete group page supplies sender IDs; only its first
seven groups can request previews or authorize group cleanup. Each preview contains
at most seven messages, with counts computed separately from historical content.
The pure projection validates owned snapshots and the complete correlated response
before returning primary-message/group-key cleanup plans. The adapter independently
restricts those plans to processed groups and owned single-message previews, then
applies them atomically without auxiliary, read/save, reward or synchronization writes.
Existing sender/translation readers are reused; public remote reads do not create
cross-database atomicity. Command, SQL and failure behavior are unit-verified only.
The reference's malformed structured conversation failure is preserved without cleanup;
ordinary malformed detail can authorize owned primary-row removal only after transport
validation. No additional tables, dependencies or external calls are introduced.

V2 new-system-mail synchronization uses a bounded read-only repeatable-read snapshot
of the authenticated recipient and owned anchor. Metadata bounds the complete selected
window before retrieving content and public sender enrichment. The controller preserves
the raw synchronization envelope and timestamp-bucket pagination; no mail/cache mutation
is authorized by this path. The optional last-ID cache follows the existing realm-scoped
Redis adapter and fails closed on dependency errors; missing state widens only owned
selection. Cache-only legacy contents require explicit import into existing authoritative
extra storage. Discarded private-chat projection translation effects and V1 sent-ID
bookkeeping remain separate limitations. Command/cache units and a disposable PostgreSQL
selection/capacity/snapshot test cover the maintained boundary. Native client behavior
and production cache operation remain unverified. See the server guide and issue #219.

Construction, queue settlement and combat remain unavailable. Porting them next
requires PostgreSQL receipts/activity models, atomic resource changes, epoch
fencing and recovery tests before enabling writes. Account provisioning,
controlled player-data cutover and native APK validation remain separate work.
Synthetic TCP tests validate the two PostgreSQL realms, dependencies and unchanged
player state; they do not prove APK rendering. See the [server guide](../../apps/server/README.md)
for configuration, supported commands, limitations and verification.

### 15.4. Local TypeScript stack

The root Compose environment now composes Traefik, the shared Bun discovery API,
one read-only Bun realm server, PostgreSQL, Redis and ZooKeeper. MinIO and its one-shot setup job supply the client CDN. Chat and media/files
have no services or gateway routes in this stage. All services use `all`/`dev`
profiles, including pgAdmin, Redis Insight and Portainer. The broader production architecture remains the target;
this local stack does not establish TLS, Firebase or production readiness.

The API reads global account/mapping tables through existing Drizzle models. It
preserves the three mobile discovery aliases and wire encodings while removing
account reactivation, legacy Redis counters, hardcoded country/server selection,
GeoIP/upload-key setup and unrelated external update metadata. Only existing active
accounts resolve to an existing realm; discovery never provisions or mutates state.
Server-directory metadata is configured separately from bind addresses. The API
exposes liveness and bounded PostgreSQL/Redis readiness with sanitized logs.

Compose is local development only, with direct service values and no host-IP
prefixes on published ports. The root env contains `NODE_ENV`, `DATABASE_ROLE`,
`DATABASE_URL` and the private game-login-secret exception. Application values
still pass the dedicated API/server Zod schemas. Container database URLs are
direct Compose values, separate from the host-side root URL. The authorized
server reference is copied under ignored `data/reference/server`; runtime XML
is mounted from that local copy, without another checkout dependency. Persistent PostgreSQL/Redis/ZooKeeper volumes are
retained; initialization applies pending migrations before app readiness. The
initial active TCP route is `server:9933` for COK1, and discovery advertises the
configured host-facing port. Both kingdom databases retain the shared schema;
activating another server/endpoint requires its own prepared account state.

See the [local stack guide](../../infra/compose/README.md) for profiles, configuration,
private resource mounts and recovery. A disposable Compose test builds images and
exercises PostgreSQL discovery and real SFS login through Traefik, preserving
synthetic state and testing dependency failure without using player databases.

## Nickname persistence and avatar allocation verification

Rename writers that bypass the global name guard are not serialized. The owned rename
store uses this guard for payment and recovery.
Downstream effects remain required before enabling the command. Existing PostgreSQL
authority under ADR-0002 is unchanged; the guard introduces no service or Redis key.

The writer returns the preparation result only after global commit. The global
transaction cannot roll back a committed realm charge. The separate owned rename store
coordinates that charge through durable state; this writer alone provides no
cross-database recovery.

The owned rename store adds a kingdom `nickname_change` journal and a global
`nickname_change_receipt`. Callers supply the authenticated UID, a stable UUID operation
identifier, the already validated name and a safe millisecond timestamp. The store is
an internal persistence port; it does not authorize a client-supplied owner or expose a
new command. It locks the realm profile before inventory or operation rows and rejects
missing, banned or incorrectly routed profiles before charging. One prepared operation
per owner is enforced in both code and a partial unique index. At most 1,000 unconsumed
effect records per owner are admitted. Equivalent target names share the global mutex
across configured kingdoms.

Preparation selects the first owned item 200021 by UUID, consumes one and records the
exact item identity and restoration metadata. This deterministic SQL order makes
duplicate restored stacks explicit. Only a game error from item debit reaches gold;
configuration, inventory SQL and transport failures cannot authorize fallback. The
caller supplies current `goods[200021].type` and `.price`, rather than an item-catalog
substitute. Gold charges preserve the ordinary or exact DMM pool and capture all six
before/after buckets and the original reply total. The signed rename counter increments
with payment, including wrap, while the display name remains unchanged until global
confirmation. Charge, counter and prepared journal commit in one realm transaction.

The protected global transaction then changes account/name mappings and inserts the
receipt. Recovery first locks the profile while reading the journal, resolving an
uncertain realm preparation commit. It subsequently acquires the same name mutex before
reading the global receipt. A matching receipt authorizes the realm name and owned world
point updates; confirmed absence authorizes refund. Lock, read or receipt-identity
failures leave the operation prepared. A lost global commit response cannot justify a
refund by itself. Recovery re-reads terminal state after an uncertain final realm commit,
and completed operation retries preserve the original result without another charge.
Restarts retain the journal and receipt, with no distributed atomic-commit claim.

Refund restores the captured item stack or re-reads the current gold price, parses it
before reaching CN1 state and credits only the selected free bucket. It keeps the
incremented counter and original debit reply total. CN1 requires an explicit available
session provider; an unavailable provider leaves a recoverable prepared charge. Gold
refund metadata includes its own price, ratio, delta and before/after balances. Terminal
journals reserve pending bits 1/2/4/8/16 for alliance, chat, throne, shared-user and
notification delivery respectively; a refund reserves notification delivery only. These
consumers remain separate. The Chat consumer acknowledges bit 2 only after the
authenticated receiver confirms the durable operation. Inventory/gold notification
delivery now acknowledges bit 16 through the persisted delivery stage described below.
Alliance, throne, shared-user and command-level ordering remain pending.

Disposable PostgreSQL integration covers both realms, UCA-equivalent contention,
concurrent retries, item/gold/DMM/CN1 paths, transactional SQL failures, lost commit
responses and restart recovery. The production composition, reserved-pattern matcher,
CN1 session lifecycle, remaining downstream delivery and authenticated command wiring remain pending.
`user.modify.nickName` stays unavailable. Retain both new tables and their migration
history when rolling application code back; unresolved operations require reconciliation
before destructive restoration or pruning. No private input or new dependency is added.

Chat now exposes exact private `POST /_internal/nickname` with its own HMAC protocol
domain and the existing trusted-backend secret. It accepts only owner, kingdom and
operation UUID, never a proposed name. The Chat-owned repository verifies the matching
global rename receipt and current account route while locking the same account row used
by rename and avatar publication. It updates only the projection's user name from the
current global account. Delivery of an older operation therefore converges to the latest
committed name. No avatar projection is created solely for a rename; a later avatar
publication obtains that name from the account once rename receipts exist.

Avatar publication still uses sequence order and exact captured metadata, with one
explicit exception for names after a committed rename. It obtains the account lock
first, then reads the current name and receipt existence in a separate read-committed
statement. A snapshot taken before a blocked account lock cannot authorize an obsolete
name. The receipt owner/kingdom index supports that lookup. Same-sequence retry checks
continue to reject conflicting version, timestamp and platform; delayed higher-sequence
events retain the current committed name. Other profile fields retain their existing
avatar-event semantics. Chat readiness now checks the receipt table as a dependency.

The bounded realm publisher and `NicknameChangeStore.deliverChat` keep the realm owner
and operation locks until publication completes and the Chat bit is cleared in the
local transaction. Failures, deadlines and late results leave it pending. Lost remote
or realm commit responses are safe to retry because the receiver reads current authority
and the realm checks its durable bit. Actual Chat application HTTP, separate service
pools and disposable PostgreSQL prove replay, two-kingdom routing, failure recovery,
account-lock races and restart persistence. This consumer is not yet invoked by an
authenticated rename command or background relay; the complete command remains disabled.

Nickname inventory/gold notifications now have a durable `notificationStage` in the
kingdom journal: zero is unseen, one acknowledges debit and two acknowledges refund.
Additive migration `0009_nickname_notification_delivery` defaults existing records to
zero without changing balances, inventory or names. Item refunds also record their
actual before/after count, including intervening changes, missing-stack recreation and
signed wrap. Existing item refund records without that optional audit field remain
readable. Gold refund snapshots retain their existing price/ratio/bucket audit.

`apps/server/src/nickname-change.ts` composes the owned store, actual goods catalog,
notification mapping and session notification registry. It requires a validated name,
authenticated caller UID and explicit CN1 ratio provider from its future command
orchestrator. It reads type, price and optional item parameters from goods 200021 only.
Preparation commits before attempting the debit notification; that attempt precedes
the protected global identity write. A failed rename commits its refund before the
refund notification. Notification failures do not trigger another charge or refund:
they retain the delivery stage and pending bit. Successful item/gold paths preserve
the reference command names, field order, signed widths and optional reply gold.
DTO classes, Zod schemas and SFS serialization remain in their dedicated packages.

`deliverNotifications` locks the realm owner, operation and reached item row, reads
current authoritative counts/balances, publishes with an abortable deadline and commits
the delivery stage with its local acknowledgment. Current-state publication prevents
old receipts from restoring stale UI values after another mutation. A recipient that
missed debit and reconnects after refund receives the current final state only; the
online path receives both debit and refund. Missing recipients remain pending. Socket
acceptance is not client acknowledgment, and uncertain publication may repeat an
absolute snapshot. No exactly-once network delivery is claimed.

The notification registry now forwards an optional abort signal. Session recipients
check it before and after Redis ownership refresh, preventing timed-out work from
writing an old packet after the realm lock has been released. Durable cursor commit
loss, SQL acknowledgment failure, offline reconciliation, debit/refund ordering, current
DMM/mobile balances, item parameters and restart recovery have actual PostgreSQL and
typed frame evidence. The runtime remains an internal composition; no rename command
or background relay is enabled. The existing mappings workspace dependency is promoted
from development to runtime use without adding a library or changing locked versions.

Negative or restored avatar versions and modulo wrap require a legacy event-ordering
or expected-previous CAS design. Command/rule units and a
disposable PostgreSQL/Redis integration exercise the production allocation runtime,
concurrent requests, atomic rollback, uncertain-commit recovery and mail/cache/chat
retry after restart without fabricating upload receipts. Native client behavior and
the broader topic-7 lifecycle remain unverified. The realm runbook records
configuration, schema, retry boundaries and the supported-version limits.
