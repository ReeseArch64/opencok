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

### Reliable local operation

Essential gameplay must not stall because an optional external dependency is
offline. Required services should be supplied or configured locally. Optional
features should fail quickly and visibly through bounded timeouts, backoff,
circuit breaking, or an explicit degraded mode instead of blocking shared
request queues.

### Safe media handling

Player image uploads should use a narrow authenticated route with explicit
size, ownership, file validation, storage, and delivery rules. Static images
and animated GIFs should behave predictably. Local persistent storage is the
baseline; an object store such as Cloudflare R2 may be offered as an optional
adapter without becoming a requirement for local development.

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
Construction, research, troops and other domain-specific completion effects are
delivered with their own systems. Unavailable domains must preserve pending state
and reject unsupported transitions. Ordinary city production accrues into a capped
uncollected buffer; collection credits the wallet. Rate changes preserve output
already earned, and repeated settlement preserves fractional output.

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
