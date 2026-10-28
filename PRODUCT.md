# OpenCoK Product Definition

## Purpose and users

OpenCoK is a reproducible, Docker-based, self-hosted Clash of Kings-compatible
stack for operating, studying and customizing private kingdoms. It combines game
servers, web services, infrastructure, operator tooling and Android integration
without relying on the original online service or undocumented setup procedures.

Operators control deployment and persistent data; developers and researchers
trace protocols and gameplay; contributors maintain independently authored
components, tooling and documentation; players need stable access, persistent
progress and predictable rules.

The default installation has two kingdoms with isolated persistent state and a
shared global service. Both use the same maintained server/database model;
additional kingdoms require configuration, not duplicated implementations.

The goal is a maintainable platform, not a fixed server snapshot: explicit
configuration, version-aware compatibility, reproducible failures and safe recovery
replace missing external services, legacy defaults and fragile manual repairs.

## Product requirements

### Deployment and compatibility

- Start the supported stack from documented container configuration with explicit
  databases, caches, gateways, volumes, ports, health checks and dependencies.
  Service recreation must preserve player, kingdom and media data.
- Give each supported client track a known server configuration, resource set,
  protocol surface and validation status. Recognized tracks are `v5.36.0`,
  `v6.12.20`, `v9.27.0` and `v12.06.0`; recognition alone does not imply support.
- Diagnose missing handlers, incompatible payloads and fallbacks from client,
  protocol, server and persistence evidence. Startup alone is not compatibility;
  handlers, resources and rules are not interchangeable across releases.
- Supply required dependencies locally. Optional RPC, chat, storage or cross-server
  failures must degrade visibly with bounded waits, backoff or circuit breaking,
  never stall login, shared queues or essential gameplay.
- Document configuration, compatibility, backups, migrations, troubleshooting,
  deployment, rollback and recovery. Prefer reversible, targeted corrections over
  broad resets, preserving valid player progress.

### Accounts and progression

Accounts, buildings, research, heroes, equipment and events start in defined states
and follow coherent progression. Development shortcuts must not become player defaults.

- Normal accounts start at player level 1 with a basic level-1 city, 100,000 wood,
  100,000 food and 1,000 gold; stone, iron, silver and crystals start at zero.
  Accelerated catalogs grant no max-level buildings, research, heroes or currency.
- Character creation is authenticated and grants the initial package once per
  identity and realm, with at most two realm characters. Retries never reset progress.
- Hua Mulan is an infantry combat hero with three branching talent trees and a
  level-99 target. Talents have one or ten levels; maximum percentage bonuses
  reach 50%–500%, while flat basic attributes and striking distance retain native
  units. Recruitment and learning consume normal fragments and points. Her art
  uses the close portrait framing of neighboring heroes.
- Other heroes display white rarity without a Legendary ribbon; Hua Mulan retains
  her own rarity and ribbon. Presentation changes preserve ownership, levels,
  talents and assignments.

### Media and security

- Authenticate state-changing operations, validate untrusted input, minimize
  exposed legacy routes and exclude secrets from clients and source control.
- Image uploads use a narrow authenticated API route with explicit size, ownership,
  file validation, storage and delivery rules. Profile uploads use temporary
  realm-issued authorization; reads use SDK-presigned S3 URLs. Replacement defaults
  to a three-day interval, deletes the previous image after success and retains
  its private confirmation receipt.
- Support static images and animated GIFs predictably, with bounded processing
  that preserves discovery availability. Persistent local MinIO is the development
  baseline for the same private S3 interface used by external providers;
  production hosting and configuration remain independent of development Compose.

### Observability

Expose actionable health checks, structured logs, request correlation and useful
errors. Measure latency and resource use, including representative login and gameplay.
Every maintained application operation exposes its start, result, elapsed time and
controlled failure reason. Correlate generated effects to their originating
operation, distinguishing prepared/queued work, committed state and confirmed
delivery. Provide searchable history and visibility into unfinished or slow work.
Exclude credentials, session tokens, device identifiers, payloads, private player
identities and unnecessary player data from reports and telemetry. Operational
telemetry is not authoritative for economic changes or durable audit.

## Gameplay contracts

### Timed activities, production and rewards

- A common persistent queue owns deadlines and lifecycle transitions for
  construction, basic research, training, healing, fortifications, forging and
  workshop jobs, including their costs and completion effects. Other effects
  remain domain-owned. Unavailable domains preserve pending state and reject
  unsupported transitions. Workshop delivery and waiting-list advancement are atomic.
- City production accrues into a capped uncollected buffer; collection credits the
  wallet. Rate changes preserve earned output, and repeated settlement preserves
  fractions. VIP, talents, temporary states and equipment sets share one effect
  calculation; changes preserve previously earned production.
- Quest and sign-in claims use server-owned progress and persisted periods;
  retries cannot repeat rewards.
- Exchange panels own their offers, token bindings and daily refresh budgets.
  Adopt an older shared list only when catalog evidence identifies one panel;
  preserve ambiguous records. A durable UTC day prevents repeated budget resets
  against yesterday's offer checkpoint. Refresh expired quotes before charging.
- Activity entitlements belong to one local character and are consumed once.
  Saved entitlements and configured rewards, never client-supplied rewards or
  payment evidence, establish authority. Costs, actual grants, progression,
  alliance balances and claim receipts commit together. Missing metadata or an
  unavailable authoritative period preserves the entitlement for retry.
- Preserve reward-block order, including ownership checks between general grants
  and experience changes. Experience uses the shared earned bonus and factual
  level cap; retries cannot manufacture progression.

### Placement and shared gathering

- Fresh terrain admission records a known birth allocation phase. Initial
  placement, random relocation and lost-city recreation require that saved phase
  and a complete free native footprint.
- Legacy realms with unknown birth phase retain existing cities and block new
  allocations before charging. Operators may inspect state read-only, then adopt
  a verified phase or declare a future policy. Never infer historical phases from
  missing metadata or reset progress to enable placement. Ownership replacement
  reconstructs occupancy while preserving known policy.
- Resource points accept multiple owned gathering parties without attack or
  exclusive node ownership. Each reserves real troops and companions, respects
  actual slot limits and carries only its earned share of remaining stock.
- Joining, recalling or depleting a point preserves other parties' cargo and
  checkpoints. Full or unavailable targets return the army; unknown legacy
  parties require factual recovery before their state can support admission.
- Cargo and extra rewards remain recoverable after disconnect or restart.
  Pin weighted extra outcomes before return funding; the actual owned return
  credits them once. Retries cannot reroll rewards, reserve troops twice or
  duplicate cargo. Migrated backends preserve historical closures, dormant quotas
  and disabled catalog controls.

### Scouting and consumption competitions

- Scouting quotes neither charge nor reserve an army. Departure consumes configured
  resources and reserves only player-supplied troops and companions. Arrival
  records factual intelligence at permitted visibility, respects protection,
  creates owned report mail and returns the party without invented victory,
  casualties or loot. Reports, notifications, costs and return checkpoints remain
  consistent through replay and restart. Special targets require their actual
  mode actor; an unavailable actor cannot produce an empty success report.
- Consumption rankings use confirmed debits and exact signed 64-bit amounts;
  ties use ascending player identity. Legacy arithmetic overflow must not reverse
  positions. Previews, income, client counters and unverified legacy totals do
  not establish spending. Published entries preserve native kingdom-visibility
  choices. Final prizes require a closed participant cohort and durable
  entitlements; repeated delivery or funded-mail claims cannot duplicate assets.

## Mobile transition

Keep the validated Elex APK while rebuilding the backend. Plan a maintained Lua
adaptation for release checks and updates distributed through Cloudflare R2,
subject to a validated native Android bridge and platform installation requirements.
Preserve account access and progress; downloading an APK does not prove installation.

Evaluate a gradual Flutter/Dart rewrite without making it a gameplay prerequisite
or committing to a replacement date. Existing and future clients share the
authoritative backend and persistent identity. The experimental SSR web client
remains a separate evaluation.

## Priorities and acceptance

1. **Stabilize active clients:** repair screens, handlers, visuals, event gates and
   progression defaults using reproducible evidence.
2. **Remove blocking external assumptions:** inventory missing dependencies and
   provide local replacements or explicit degraded behavior.
3. **Improve performance and recovery:** bound synchronous waits, prevent stale
   player locks, preserve state through restarts and measure representative latency.
4. **Complete media handling:** make routing, limits, validation, persistence and
   required formats reliable without blocking discovery.
5. **Make operations understandable:** keep configuration, version matrices,
   dependencies, backup, migration and recovery procedures actionable.

Success means a new operator can start the documented environment without hidden
repairs; supported clients discover, authenticate and complete core gameplay without
repeated long waits or missing required handlers; persistent state survives service
recreation; compatibility is recorded per client/server version; defects have
reproduction steps, environment details and acceptance criteria; automated checks
validate configuration and contribution rules; releases provide migration,
rollback and recovery paths; secrets and private player data stay out of logs,
issues and source.

## Boundaries

OpenCoK is independent and not endorsed by the original developer, publisher or
other rights holders. Contributors license only their own or authorized work;
third-party code, binaries, art, audio, data and trademarks retain their owners'
terms. Operators and distributors must obtain necessary rights. The project
license grants no permission to redistribute unauthorized third-party material.
Replacement components must be independently authored with documented origin and license.

Non-goals are global-scale recreation of the publisher's commercial infrastructure,
public multi-tenant hosting, compatibility with every historical client, false-success
responses, embedded production credentials, dependency on contributor-owned cloud
accounts, ownership claims over the original game or redistribution rights over
material contributors do not own.

## Product workflow and decisions

GitHub is the system of record: Discussions for questions and early proposals,
Issues for reproducible defects and accepted tasks with acceptance criteria,
Projects for priorities and delivery status, pull requests for reviewed issue-linked
changes, and Wiki for long-lived operational and architectural knowledge.

Before committing to implementation, establish the affected client/server versions,
the player or operator benefit, evidence of behavior before and after, and how to
deploy, observe, reverse and recover the change. Unknown answers require
investigation or discussion first.
