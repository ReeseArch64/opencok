# OpenCoK Product Definition

## Product statement

OpenCoK is a self-hosted environment for running, studying, maintaining, and
customizing a private Clash of Kings-compatible game stack. It brings the game
server, web services, infrastructure dependencies, operator tooling, and
compatible Android client integration into a reproducible Docker-based system.

The project exists to make a private kingdom practical to operate locally or
on infrastructure controlled by its operator. It should replace undocumented,
fragile setup procedures with explicit configuration, persistent storage,
observable services, and version-aware compatibility work.

The default installation configures two kingdoms with isolated persistent state and
a shared global service. Both kingdoms use the same maintained server/database model;
adding a kingdom changes configuration rather than duplicating its implementation.

## The problem

The available game components were designed around an external production
ecosystem. Running them independently exposes several classes of problems:

- services expect unavailable global, chat, storage, and cross-server systems;
- clients and servers may disagree about commands, payloads, resources, and
  gameplay rules;
- legacy defaults can unlock or initialize accounts incorrectly;
- timeouts and missing dependencies can block player queues and login flows;
- local gateway, persistence, media, and networking behavior is incomplete;
- failures are difficult to reproduce without structured logs and documented
  evidence;
- different client releases require distinct resources and compatibility
  decisions.

OpenCoK provides the engineering and operational layer needed to understand
and address these problems without depending on the original online service.

## Product vision

An operator should be able to prepare an authorized client, start the stack,
create or access a kingdom, and play through the supported experience without
relying on undocumented external services. Developers should be able to trace
a client action through the gateway and backend, reproduce failures, add
compatible handlers, and verify changes without corrupting player progress.

The long-term product is a maintainable private-server platform rather than a
single fixed server snapshot. Deployments should be reproducible, behavior
should be configurable, and compatibility decisions should be documented per
version.

## Intended users

- **Server operators** who want to host a private kingdom on infrastructure
  they control.
- **Developers and researchers** investigating client/server protocols,
  compatibility, gameplay systems, and legacy service behavior.
- **Contributors** improving deployment, reliability, documentation, testing,
  and independently authored replacement components.
- **Players in an operator-managed environment** who need a stable client,
  persistent progress, and predictable game behavior.

## Core product outcomes

### Reproducible self-hosting

The complete supported stack should start from documented configuration using
containers. Required databases, caches, gateways, services, volumes, ports,
health checks, and startup dependencies must be explicit. Recreating a service
must not erase persistent player or media data.

### Client/server compatibility

Each supported client track must have a known server configuration, resource
set, and protocol surface. Missing handlers, incompatible payloads, and client
fallback behavior must be diagnosed from evidence and resolved deliberately.
The repository currently recognizes `v5.36.0`, `v6.12.20`, `v9.27.0`, and `v12.06.0`
compatibility tracks; a version is considered supported only when its required
components and validation status are documented.

### Playable and coherent progression

Accounts, buildings, heroes, equipment, events, and other systems should begin
in a defined state and follow the intended progression rules. Development
shortcuts must not silently become player defaults. Fixes must preserve valid
player progress and avoid broad database resets when a targeted migration or
compatibility correction is possible.

The normal account preset starts at player level 1 with a basic level-1 city,
100,000 wood, 100,000 food and 1,000 gold. Stone, iron, silver and crystals
start at zero. Accelerated catalog settings do not grant max-level buildings,
research, heroes or currency. Character creation is authenticated and grants
this package once per identity and realm, with at most two realm characters.
Existing progression is never reset by retrying account creation.

Hua Mulan is an infantry combat hero with three branching talent trees and a
level-99 progression target. Each talent has one or ten levels. Percentage
bonuses should reach 50%–500% at their maximum, with flat basic attributes and
striking distance retaining their native units. Her art uses the same close
portrait framing as neighboring heroes. Recruitment and learning consume the
normal fragment and point budgets.
The client presents every other hero with white rarity and no Legendary ribbon;
Hua Mulan retains her own rarity and ribbon. This presentation does not reset
existing ownership, levels, talents or assignments.

### Reliable local operation

Essential gameplay must not stall because an optional external dependency is
offline. Required services should be supplied or configured locally. Optional
features should fail quickly and visibly through bounded timeouts, backoff,
circuit breaking, or an explicit degraded mode instead of blocking shared
request queues.

### Safe media handling

Player image uploads should use a narrow authenticated route with explicit
size, ownership, file validation, storage, and delivery rules. Profile images use temporary realm-issued authorization for API uploads and
SDK-presigned S3 URLs for reads, with
a default three-day replacement interval. A successful replacement removes the previous
image while retaining its private confirmation receipt. Static images
and animated GIFs should behave predictably. Local persistent MinIO storage provides the development baseline through the
same private S3 interface used by external storage providers. Production hosting
and configuration remain independent of the development Compose environment.

### Observable behavior

Operators and contributors need actionable health checks, structured logs,
request correlation, and useful error responses. Performance work should use
measured latency and resource data. Reports must omit credentials, session
tokens, device identifiers, and unnecessary player information.

## Functional scope

OpenCoK includes or coordinates the following product areas:

- containerized game-server and supporting-service execution;
- HTTP gateway, discovery, API, and media routing;
- database, cache, coordination, and durable-volume configuration;
- Android client connectivity and version compatibility;
- gameplay command handlers and server-side rules;
- resource and configuration data organized by compatible release;
- account initialization, progression, and migrations;
- local networking and operator-controlled remote deployment;
- health checks, diagnostics, logs, backups, and recovery guidance;
- development tooling, automated checks, and release promotion;
- documentation for installation, operation, troubleshooting, and
  contribution.

### Timed activities and city production

The common queue mechanism owns persistent deadlines and lifecycle transitions.
Construction, basic research, training, healing, fortifications, equipment forging
and workshop jobs apply their costs and completion effects through that mechanism. Other domain-specific
effects are delivered with their own systems. Unavailable domains must preserve
pending state and reject unsupported transitions. Ordinary city production accrues into a capped
uncollected buffer; collection credits the wallet. Rate changes preserve output
already earned, and repeated settlement preserves fractional output.

Quest and sign-in rewards are claimed from server-owned progress and persisted
periods. Repeating an action cannot repeat its reward. VIP, talents, temporary
states and equipment sets contribute through one effect calculation; changes
preserve production earned before the change. Workshop completion delivers items
and advances its waiting list atomically.

Independent exchange panels own their offer lists, token bindings and daily refresh
budgets. Adopt an older shared list only when its catalog evidence identifies one
panel; preserve ambiguous records instead of guessing their owner. A durable UTC
day prevents a budget from resetting repeatedly while its offer checkpoint still
belongs to yesterday. Expired quotes must be refreshed before a new claim can
charge the player.

Activity reward entitlements belong to one local character and are consumed once.
The saved entitlement and configured reward establish authority; a client cannot
supply its own reward or payment evidence. Costs, actual grants, progression,
shared alliance balances and claim receipts commit together. Missing metadata or
an unavailable authoritative period preserves the entitlement for a later retry.
Reward blocks retain their configured order, including ownership checks between
general grants and experience changes. Experience uses the shared earned bonus
and factual level cap; retries cannot manufacture additional progression.

### Resident placement and shared gathering

Fresh terrain admission establishes a known birth allocation phase. Initial
character placement, random relocation and lost-city recreation require that
saved phase and a complete free native footprint. An imported legacy realm with
unknown birth phase preserves its existing cities and blocks new allocations
before charging the player. Operators can inspect the state read-only and then
explicitly adopt a verified phase or declare a future placement policy. The
system cannot infer an unknown historical phase from missing metadata or reset
player progression to make placement succeed. Ownership replacement reconstructs
current occupancy while retaining the known policy.

Shared resource points support multiple owned gathering parties without an
attack or exclusive ownership of the node. Each party reserves real troops and
companions, respects the actual slot limit and carries only its earned share of
remaining stock. Joining, recalling and depleting a point preserve other parties'
owned cargo and checkpoints. Full or unavailable targets return their army;
unknown legacy parties require factual recovery before admission can use their
state.

Resource cargo and extra rewards remain recoverable after disconnect or restart.
Weighted extra outcomes are pinned before return funding, and the actual owned
return credits them once. Retrying a request cannot reroll a reward, reserve the
same troops twice or repeat cargo. Existing historical closures, dormant quotas
and disabled catalog controls remain effective after their backend is migrated.

### Ordinary scouting

Scouting is an intelligence action. Its quotation does not charge or reserve an
army. Actual departure consumes the configured resources and reserves only the
troops and companions supplied by the player. Arrival records factual information
at the allowed visibility level, respects protection, creates owned report mail
and returns the party without inventing a victory, casualties or loot. Reports,
notifications, costs and return checkpoints remain consistent through replay and
restart. A special target requires its actual mode actor before intelligence can
be produced; an unavailable actor cannot become an empty success report.

### Consumption competitions

Consumption rankings use confirmed debits and exact signed 64-bit amounts.
Equal totals use ascending player identity. Arithmetic overflow in a legacy
ranking helper must not reverse earned positions. Previews, income, client
counters and unverified legacy totals do not establish competitive spending.
The player's native kingdom-visibility choice remains part of each published
entry. Final prizes require a closed participant cohort and durable entitlements;
repeating delivery or claiming a funded mail cannot grant the same assets again.

## Mobile client transition

Keep the validated Elex APK as the transitional mobile client while the backend
is rebuilt. Plan a maintained Lua adaptation to check releases and coordinate
updates distributed through Cloudflare R2, subject to a validated native Android
bridge and platform installation requirements. Preserve account access and
player progress throughout updates; downloading an APK is not proof that an
update was installed.

Evaluate a gradual rewrite of the game client in Flutter/Dart as a longer-term
option, without making it a prerequisite for current gameplay or committing to
a replacement date. The existing APK and a future client must share the same
authoritative backend and persistent player identity. The experimental SSR web
client remains a separate evaluation. Technical boundaries, delivery, and
validation belong in [the architecture](.github/ARCHITECTURE.md#27-transition-client-r2-update-and-possible-flutter-rewrite).

## Current product priorities

1. **Stabilize the active client experience.** Resolve broken screens,
   incomplete handlers, visual defects, event gates, and progression defaults
   using reproducible evidence from the client and server.
2. **Remove blocking external assumptions.** Inventory unavailable RPC, cache,
   chat, cross-server, and other dependencies; provide local replacements or
   explicit degraded behavior.
3. **Improve performance and recovery.** Bound synchronous waits, prevent stale
   player locks, preserve data across restarts, and measure representative
   login and gameplay latency.
4. **Complete the media path.** Fix gateway routing and limits, validate and
   persist uploads and support the required image formats within the shared API,
   with bounded processing that preserves discovery availability.
5. **Make operations understandable.** Document configuration, version
   matrices, service dependencies, backups, migrations, troubleshooting, and
   deployment expectations.

## Product principles

- **Self-hosted by default:** operators retain control of runtime services and
  persistent data.
- **Compatibility is verified:** a successful startup does not prove that a
  client feature works.
- **Evidence precedes fixes:** correlate client behavior, protocol traffic,
  server logs, configuration, and persisted state before changing data.
- **Preserve player state:** prefer reversible, targeted corrections and
  migrations.
- **Secure boundaries:** authenticate state-changing operations, validate
  untrusted input, minimize exposed legacy routes, and keep secrets out of
  clients and source control.
- **Optional services degrade safely:** an unavailable nonessential feature
  should not block the kingdom.
- **Version differences remain explicit:** do not assume that handlers,
  resources, or rules are interchangeable across releases.
- **Operations are documented:** a feature is incomplete until an operator can
  configure, observe, back up, and recover it.

## Non-goals

OpenCoK does not aim to:

- recreate the original publisher's commercial infrastructure at global
  scale;
- provide a public multi-tenant hosting service;
- guarantee compatibility with every historical client build;
- hide unresolved failures behind false-success responses;
- embed production credentials or depend on contributor-owned cloud accounts;
- claim ownership of the original game, its trademarks, or third-party assets;
- grant redistribution rights for material the contributors do not own.

## Legal and content boundaries

OpenCoK is an independent project and is not affiliated with or endorsed by
the original game's developer, publisher, or other rights holders. Project
contributors can license only material they created or are authorized to use.
Third-party code, binaries, artwork, audio, data, trademarks, and other assets
remain subject to their respective owners' terms.

Each operator and distributor is responsible for obtaining the rights required
for the components they use. The repository's [LICENSE](LICENSE) does not grant
permission to distribute unauthorized third-party material. Replacement
components should be independently authored and should document their origin
and license.

## Success criteria

The product is progressing when:

- a new operator can start a documented environment without undocumented
  manual repair;
- supported clients connect through a defined discovery and authentication
  flow;
- core gameplay actions complete without repeated long waits or missing
  required handlers;
- player, kingdom, and media state survives routine service recreation;
- defects include reproducible steps, environment details, and acceptance
  criteria;
- compatibility status is recorded per client/server version;
- secrets and private player data remain outside logs, issues, and source;
- automated checks validate repository configuration and contribution rules;
- releases have an explicit migration, rollback, and recovery path.

## Product and community workflow

GitHub is the system of record for product work:

- **Discussions** are used for questions, early proposals, and community
  conversations.
- **Issues** describe reproducible defects, accepted enhancements, and concrete
  tasks with clear acceptance criteria.
- **Projects** tracks priority and delivery status across the backlog.
- **Pull requests** implement reviewed changes and link to their issues.
- **Wiki** stores long-lived operational and architectural knowledge.

The contribution process, branch rules, and commit conventions are defined in
[`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md). Community interactions
are governed by [`.github/CODE_OF_CONDUCT.md`](.github/CODE_OF_CONDUCT.md).

## Decision standard

Product decisions should answer four questions:

1. Which client and server versions does this affect?
2. What player or operator outcome improves?
3. What evidence proves the behavior before and after the change?
4. How can an operator deploy, observe, reverse, and recover the change?

If these answers are unknown, the work begins as an investigation or
discussion before becoming an implementation commitment.
