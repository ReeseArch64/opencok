# Domain migration register

Parent: [#558](https://github.com/ReeseArch64/opencok/issues/558). Convention: [ADR-0016](../docs/decisions/0016-adopt-domain-owned-package-layout.md).

This register accounts for all 64 original package directories, including four retired packages and the store-to-shop rename. The current tree has 62 package workspaces, including offline `catalog-tools` added in #598 and the implemented balance foundation in `economy` added in #611. Confirmed entries reproduce maintainer decisions; proposed entries require disposition review. No proposed row claims completed extraction, service deployment or verified client support.

## Existing package disposition review

Counts describe maintained TypeScript/JavaScript source under `src` and named test files, not handwritten behavioral size. Config-only workspaces can be valid. Counts start from the stack through #579; migrated rows are updated with their slice; reproduce detailed file/dependency evidence with `bun --no-env-file tests/architecture/inventory.ts`.

| Original package | Current source / tests | Responsibility                                                                                                                                                                                                 | Disposition and boundary                                                                                                                                                                                                                           | Review                   |
| ---------------- | ---------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| `account`        |                  7 / 2 | Global account reads, lifecycle and account-to-character linkage.                                                                                                                                              | Implemented reservation/activation and discovery slice in #607; authentication remains in identity and realm character initialization belongs to player after #609.                                                                                | Implemented in #607      |
| `alliance`       |                  0 / 0 | Membership, permissions, help, gifts, research and alliance coordination.                                                                                                                                      | Populate from current alliance Services/Rules/Repositories/Contracts/Mappers; split `alliance-territory` or `alliance-events` if cohesion/size requires. Preserve participant-lock ordering and shared research effects.                           | Proposed; pending review |
| `api`            |                  8 / 0 | Existing HTTP routing/compatibility adapters.                                                                                                                                                                  | Retain as bounded API adapter package or move app-only routing into `apps/api`; move media/auth use cases to owners. Do not make it a second application layer containing all domains.                                                             | Proposed; pending review |
| `api-client`     |                  0 / 0 | Typed clients for real public/internal API contracts.                                                                                                                                                          | Defer any unimplemented capability until a concrete consumer/use case is approved. Populate only for actual consumers and implemented endpoints, not speculative SDKs; no database imports.                                                        | Proposed; pending review |
| `api-contracts`  |                  0 / 0 | Versioned HTTP API requests/responses and boundary validators.                                                                                                                                                 | Populate HTTP-specific contracts; keep domain ports local and integration envelopes separately owned. Avoid duplicating the entire domain model.                                                                                                   | Proposed; pending review |
| `base`           |                  0 / 0 | Domain base classes. Populate only from concrete domain needs.                                                                                                                                                 | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                             | Confirmed in #567/#568   |
| `billing`        |                  0 / 0 | Orders, billing and provider reconciliation.                                                                                                                                                                   | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                             | Confirmed in #567/#568   |
| `building`       |                  0 / 0 | Named building definitions, prerequisites, costs, levels, stars and construction policies/use cases.                                                                                                           | Populate current building/construction code and typed catalogs; city coordinates the aggregate. Do not keep this empty while `services/construction` owns everything.                                                                              | Proposed; pending review |
| `campaigns`      |                  0 / 0 | Bounded campaign/event orchestration and publication.                                                                                                                                                          | Populate current campaign-related code; split independent event families instead of absorbing every event in the game.                                                                                                                             | Proposed; pending review |
| `city`           |                  0 / 0 | City aggregate/context, cross-mechanic atomic coordination and bootstrap projection.                                                                                                                           | Populate existing CityProgressionContext/Factory/coordinator pieces. Delegate buildings, research, military, equipment and production to their packages.                                                                                           | Proposed; pending review |
| `combat`         |                  0 / 0 | Pure battle models, calculations, deterministic replay and result contracts.                                                                                                                                   | Populate only implemented/extracted mechanics; separate computation from result application. Package required where real code exists, standalone app optional.                                                                                     | Proposed; pending review |
| `command`        |                  0 / 0 | Explicit command registration/routing/envelopes and execution boundary contracts.                                                                                                                              | Populate reusable routing responsibilities now mixed with generic GameService/transport; domain command behavior stays in domain Services.                                                                                                         | Proposed; pending review |
| `config`         |                  0 / 0 | Shared TypeScript/tool configuration.                                                                                                                                                                          | Retain; this is not an unused runtime package just because it lacks `src`. Do not move secrets or ambient runtime configuration here.                                                                                                              | Proposed; pending review |
| `connection`     |                 20 / 0 | Existing TCP/SFS and Chat transport code.                                                                                                                                                                      | Separate into bounded game transport and `chat-transport` ownership; keep session/backpressure behavior. Rename only after imports migrate.                                                                                                        | Proposed; pending review |
| `constants`      |                  6 / 0 | Current native bindings/compatibility values.                                                                                                                                                                  | Gradually move domain-specific values to owned bindings under ADR-0016. Retain genuinely shared constants; do not replace one large generic package with another.                                                                                  | Proposed; pending review |
| `contexts`       |                  0 / 0 | Reserved for the web application. Leave this package unchanged in the backend decomposition.                                                                                                                   | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                             | Confirmed in #567/#568   |
| `contracts`      |                198 / 0 | Current mixed ports, wire models and responses.                                                                                                                                                                | Redistribute to domain contracts, protocol adapters, `api-contracts` and bounded integration contracts. Temporary re-exports only, with removal criteria; no replacement mega-contract package.                                                    | Proposed; pending review |
| `controllers`    |                 29 / 1 | Existing thin HTTP/SFS/Chat Controllers.                                                                                                                                                                       | Redistribute into approved domain adapter locations or bounded transport packages, maintaining constructor injection. ADR-0016 now permits domain-local Controllers; preserve compatibility while migrating.                                       | Proposed; pending review |
| `core`           |                 14 / 7 | Existing runtime, resources, logging, telemetry and worker lifecycle.                                                                                                                                          | Separate into `runtime` and `observability` as cohesion warrants; leave minimal compatibility exports temporarily. No domain logic.                                                                                                                | Proposed; pending review |
| `custom`         |                  0 / 0 | No intended responsibility. Remove the unused workspace.                                                                                                                                                       | Retired in #568                                                                                                                                                                                                                                    | Confirmed in #567/#568   |
| `decorators`     |                  0 / 0 | Retain for planned decorator use. No decorators are introduced by this decision; existing DTO conventions still apply.                                                                                         | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                             | Confirmed in #567/#568   |
| `dragon`         |                 21 / 0 | Named dragon archetypes and full dragon-specific progression/talents/validation/mapping.                                                                                                                       | Extend existing ownership by migrating remaining dragon workflows from global layers. Keep towers/events separate if their mechanics warrant an independent package.                                                                               | Proposed; pending review |
| `drizzle`        |                865 / 8 | PostgreSQL pools, schemas, migrations and setup.                                                                                                                                                               | Retain technology package initially. Keep domain query implementations in owned repositories; group schema ownership without a big-bang schema/package rename. Large schema inventory is not evidence of many behavioral responsibilities.         | Proposed; pending review |
| `dtos`           |                  3 / 0 | Current create/update inputs.                                                                                                                                                                                  | Move into owning domains/API boundaries under ADR-0016, with temporary aliases. Queries/responses are contracts, not DTO classes.                                                                                                                  | Proposed; pending review |
| `email`          |                  0 / 0 | Outbound email integration and templates for actual product use cases.                                                                                                                                         | Defer any unimplemented capability until a concrete consumer/use case is approved. Populate only when actual implementation/use is confirmed; otherwise explicitly deferred, not silently deleted or implemented with a new provider.              | Proposed; pending review |
| `enums`          |                 24 / 0 | Current shared/domain semantic enums.                                                                                                                                                                          | Keep compatibility initially; colocate domain-only identities with approved domain contracts later. Truly shared finite protocol alternatives stay bounded.                                                                                        | Proposed; pending review |
| `env`            |                 15 / 6 | Validated injectable process environment.                                                                                                                                                                      | Retain, add app-specific schemas only for implemented processes; one root configuration source, no copied `.env` files.                                                                                                                            | Proposed; pending review |
| `errors`         |                  4 / 0 | Stable cross-cutting failure classifications.                                                                                                                                                                  | Retain small; move mechanic-specific failures to owners where appropriate. Do not leak private payloads through errors.                                                                                                                            | Proposed; pending review |
| `events`         |                  0 / 0 | Versioned integration-event contracts and ownership documentation.                                                                                                                                             | Proposed place for event contracts; domain-internal events stay local. Do not mix event definitions, broker clients and every event handler.                                                                                                       | Proposed; pending review |
| `generators`     |                  0 / 0 | Classes for generating monsters, construction, messages and other concrete outputs. This is not restricted to offline catalog tooling. Generation does not itself grant authority to persist gameplay effects. | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                             | Confirmed in #567/#568   |
| `guard`          |                  0 / 0 | Authentication and authorization at transport entrypoints.                                                                                                                                                     | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                             | Confirmed in #567/#568   |
| `helpers`        |                  0 / 0 | English placeholders, as specified by the maintainer. Populate when a concrete consumer establishes the required interface.                                                                                    | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                             | Confirmed in #567/#568   |
| `hero`           |                237 / 0 | Named hero/general definitions and core owned progression.                                                                                                                                                     | Preserve reference model and move remaining domain-specific consumers. Review separate hero events/rankings for medium-package boundaries; eliminate broad dependency cycles, not just paths.                                                      | Proposed; pending review |
| `i18n`           |                  0 / 0 | Localization-key resolution and typed references for actual consumers.                                                                                                                                         | Defer any unimplemented capability until a concrete consumer/use case is approved. Distinguish runtime localization from offline client-name discovery. Do not ship private client localization bundles or use locale text as persistent identity. | Proposed; pending review |
| `identity`       |                 14 / 0 | Authentication, tickets, signing and trusted identity boundaries.                                                                                                                                              | Retain and bound; move account lifecycle out. Preserve purpose separation, expiry, authorization and optional integration behavior.                                                                                                                | Proposed; pending review |
| `kvk`            |                  0 / 0 | Cross-realm gameplay protocols and approved KvK mechanics.                                                                                                                                                     | Defer any unimplemented capability until a concrete consumer/use case is approved. Define with maintainer; populate only supported code. Existing unsupported cross-realm behavior must remain unsupported until its owner/protocol exists.        | Proposed; pending review |
| `ledger`         |                  2 / 1 | Mutation/receipt/outbox contracts, posting validation and owned tests after #613.                                                                                                                              | Extend current posting code for genuine shared invariants; do not turn it into a separate network balance service by default.                                                                                                                      | Proposed; pending review |
| `mappings`       |                108 / 1 | Current global serializers/projections.                                                                                                                                                                        | Redistribute by domain and protocol; no global mapper index importing every mechanic. Preserve field types/order and conditional omission.                                                                                                         | Proposed; pending review |
| `messages`       |                 13 / 1 | SFS framing, Java/legacy encoding, response values and shared wire/schema validation after #617.                                                                                                               | Retain or deliberately rename `protocol-sfs`; not a broker package. Keep numerical and field-order compatibility.                                                                                                                                  | Proposed; pending review |
| `middlewares`    |                  0 / 0 | HTTP/transport interception, including request context.                                                                                                                                                        | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                             | Confirmed in #567/#568   |
| `mongoose`       |                  1 / 0 | Current MongoDB Chat archive adapter, using the `mongodb` driver.                                                                                                                                              | Assign to bounded document-storage/Chat archive adapter; rename only with evidence. Do not adopt Mongoose merely because of the current directory name.                                                                                            | Proposed; pending review |
| `notifications`  |                  0 / 0 | Delivery intents/channels and owned delivery state.                                                                                                                                                            | Populate current notification/integration responsibilities. In-session SFS delivery stays with gateway transport; FCM/external delivery is worker work. No direct gameplay grants.                                                                 | Proposed; pending review |
| `npc`            |                  0 / 0 | Named NPC/monster archetypes and owned behavior policies.                                                                                                                                                      | Populate definitions and supported NPC behavior; clarify monster/NPC family boundaries. Spatial admission/spawn coordination belongs to world authority/population. Not authenticated player bots.                                                 | Proposed; pending review |
| `payments`       |                  0 / 0 | Idempotent delivery of purchased benefits to the realm. Economic grants remain under the realm authority.                                                                                                      | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                             | Confirmed in #567/#568   |
| `player`         |                 17 / 6 | Character provisioning, profile/preferences, experience and bounded player progression.                                                                                                                        | Preferences in #595/#603 and character provisioning in #609; other profile work remains. Keep wallet/inventory and mechanics in their own packages; global account != character.                                                                   | Proposed; pending review |
| `policy`         |                  7 / 4 | Content matching, reserved-name rules, bounded file/worker adapters and the maintained word dictionary.                                                                                                        | Implemented in #589; five compatibility paths retired in #590. Player nickname mutations remain separate.                                                                                                                                          | Confirmed in #567/#568   |
| `prompts`        |                  0 / 0 | No current use. Remove the unused workspace.                                                                                                                                                                   | Retired in #568                                                                                                                                                                                                                                    | Confirmed in #567/#568   |
| `queues`         |                  0 / 0 | Persistent timed-activity lifecycle, dispatch contracts and shared queue invariants.                                                                                                                           | Populate current timed-activity mechanism; keep economic completion inside owned transactions. Transport queues and broker clients are distinct infrastructure responsibilities.                                                                   | Proposed; pending review |
| `ranking`        |                  0 / 0 | Common ranking contracts, exact arithmetic, tie-breaking, publication/finality primitives and bounded ranking use cases.                                                                                       | Populate existing code; move large event-specific families to their event packages. A projection may be asynchronous; prize funding remains authoritative.                                                                                         | Proposed; pending review |
| `repositories`   |                174 / 0 | Current global persistence implementations.                                                                                                                                                                    | Redistribute by domain and approved write ownership; retain schema/pool plumbing in `drizzle`. Remove compatibility exports only after callers migrate.                                                                                            | Proposed; pending review |
| `resources`      |               1373 / 9 | Current gameplay definitions, generated catalog records, provenance and import tools.                                                                                                                          | Distribute definitions/tables to domain owners and tooling to `catalog-tools`. Keep a bounded temporary compatibility facade. Do not rename all of it to one giant `game-data` package.                                                            | Proposed; pending review |
| `robot`          |                  0 / 0 | Remove the unused package. A future robot application will consume domain packages directly; do not scaffold or rename an application in this slice.                                                           | Retired in #568                                                                                                                                                                                                                                    | Confirmed in #567/#568   |
| `rules`          |                159 / 3 | Current global gameplay rules plus Java compatibility helpers.                                                                                                                                                 | Move mechanics to owners; extract bounded `legacy-compat` primitives for factual shared numeric/text behavior. Pure rules remain pure.                                                                                                             | Proposed; pending review |
| `scripts`        |                  0 / 0 | Remove the unused workspace. Existing application/package script directories are unrelated and remain intact.                                                                                                  | Retired in #568                                                                                                                                                                                                                                    | Confirmed in #567/#568   |
| `services`       |                166 / 0 | Current global application workflows.                                                                                                                                                                          | Redistribute feature by feature into medium domains; replace broad GameService dispatch with explicit routing and narrow Services. Do not rename the package and preserve its monolith.                                                            | Proposed; pending review |
| `share`          |                  0 / 0 | Social sharing, including battle reports and related content.                                                                                                                                                  | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                             | Confirmed in #567/#568   |
| `skins`          |                  0 / 0 | Proposed cosmetic definitions, ownership/application and presentation mapping.                                                                                                                                 | Populate existing city/avatar/cosmetic responsibilities only where semantically confirmed; paid media uploads stay in media, not skins.                                                                                                            | Proposed; pending review |
| `storage`        |                 23 / 0 | Current Redis, coordination, S3, ranking and other adapters.                                                                                                                                                   | Split by owned purpose: sessions/coordination, media, ranking caches and domain adapters. Avoid a universal persistence utility package.                                                                                                           | Proposed; pending review |
| `store`          |                  9 / 1 | Renamed to `shop`; owns mall/NPC trading contracts, rules, mappings, Services and repository adapters.                                                                                                         | Renamed in #568; gameplay slice and caller retirement in #593                                                                                                                                                                                      | Confirmed in #567/#568   |
| `tasks`          |                  0 / 0 | Player quests, event missions and related progression. Background work belongs to jobs, not this package; no new jobs workspace is implied.                                                                    | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                             | Confirmed in #567/#568   |
| `troops`         |                  0 / 0 | Named troop definitions, owned troop state, training/healing/fortification policies.                                                                                                                           | Populate current military code. Split `military-care` or equivalent only when needed; reservations coordinate with marches, not unrestricted world writes.                                                                                         | Proposed; pending review |
| `utils`          |                  0 / 0 | Formatting tools, such as input/display masks.                                                                                                                                                                 | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                             | Confirmed in #567/#568   |
| `validations`    |                 73 / 1 | Current mixed definition/request/media validators.                                                                                                                                                             | Move to owning domain or boundary; shared validation primitives remain small. Sharp/image processing must not become an import dependency of pure gameplay validators.                                                                             | Proposed; pending review |
| `webhooks`       |                  0 / 0 | Provider webhook transport, signature/replay boundary and dispatch.                                                                                                                                            | Defer any unimplemented capability until a concrete consumer/use case is approved. Populate actual payment/integration adapters as implemented. Domain lifecycle remains billing/payments; avoid duplicated generic webhook business logic.        | Proposed; pending review |

## First vertical migration candidates

These candidates use existing modules and confirmed meanings. They are review units, not permission to omit the rest of the inventory. The current composing authority remains `apps/server` unless stated otherwise. Create a new package only when its implementation moves.

| Slice             | Existing evidence                                                                          | Proposed owner              | Required verification and remaining decisions                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------ | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Content policy    | `resources/src/nickname-words.ts`, `resources/data/badwords.json`, nickname matching rules | `policy`                    | Implemented in #589 with relocated tests, immutable fixture hashes and packaged loader checks. Compatibility paths retired in #590.             |
| Shop              | Shop Services, rules, repositories, contracts and mappings                                 | `shop`                      | Gameplay slice in #593; catalog authoring remains pending. Event exchanges and paid entitlements stay distinct.                                 |
| Player missions   | Quests and target-task modules across global layers                                        | `tasks`                     | Initialization, claim/retry, timed progression and restart. Event score/finality may remain event-owned; no background jobs in tasks.           |
| Buildings         | Building catalogs, construction Services/rules and contracts                               | `building`                  | Catalog parity, city progression, timed economy. Preserve city transaction coordination; semantic identities still need client-backed evidence. |
| Research          | Research rules/Services and their catalog consumers                                        | `research` (new candidate)  | Progression/unlocks, completion and rollback. Review shared effects/requirements before moving.                                                 |
| Troops            | Training, hospital, fortification and military modules                                     | `troops`                    | Progression, hospital and march reservation tests. Preserve coordinated realm-owned debits.                                                     |
| Media and postbox | Existing GameService workflows                                                             | `media` / `mail` candidates | Reuse #552/#553 and avatar/mail suites; do not duplicate their work.                                                                            |
| World recovery    | Population/march jobs in server composition                                                | Domain extraction pending   | #572/#574 tests plus world persistence/process recovery. These jobs do not establish a player/world authority split.                            |

## Catalog and command review

The reproducible inventory records maintained files, current workspace owners and reverse import evidence. Future owners remain explicitly unreviewed until each vertical slice records its decision. Catalog membership is declared in `enums/src/gameplay-catalog.ts`; building definitions additionally live under `resources/src/buildings`. Native catalog identifiers remain distinct from semantic identities. Never invent a class or English identity from an opaque ID.

Gameplay command ownership is spread across GameService dispatch, domain command lists, Controllers and enums. Record declaration/dispatch evidence and unresolved registrations before claiming complete command coverage; a string found in source does not prove a working handler. Test-to-source import paths identify candidate suites, not complete behavioral coverage.

## Required per-slice evidence

| Field         | Required record before cutover                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------- |
| Current files | Source, catalogs, tests, adapters and application wiring; retain unresolved entries explicitly. |
| Destination   | Confirmed package and responsibility path, plus current and intended composing application.     |
| Consumers     | Direct callers/public exports and runtime/type dependency changes; no new cyclic edges.         |
| Behavior      | Unit, wire, persistence, recovery and artifact checks; record client-track limits.              |
| Compatibility | One implementation/source of truth; bounded re-exports only where needed.                       |
| Removal       | Named owner and linked removal issue for every facade; remove only after callers/tests migrate. |

## Open work

- Confirm the proposed package dispositions above; retain deferred capabilities explicitly.
- Assign every module/catalog/command to a reviewed vertical slice, including unresolved records.
- Finish dependency guardrail CI registration in #578 and eliminate baseline debt during migrations.
- Establish W02 baselines before performance claims; coordinate login evidence with #560–#562.
- Prepare separate process-authority and named-definition decisions before changing those boundaries.
- Continue W04–W21 and verify the full umbrella acceptance matrix before closing #558.

## Content-policy vertical slice (#589)

Composing app: `apps/server`. Domain owner: `policy`. Runtime authority remains the
realm. Direct workspace dependents added: `rules`, `resources`, `services` and
`apps/server`. No new external dependency or policy-to-horizontal-layer edge.

| Previous source                                                                | Policy destination                                                                      | Migration state                                                                           |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `rules/src/nickname-words.ts`                                                  | `policy/src/rules/nickname-words.ts`                                                    | Implementation moved; old path retired in #590                                            |
| `rules/src/nickname-reserved.ts`                                               | `policy/src/rules/nickname-reserved.ts`                                                 | Implementation moved; old path retired in #590                                            |
| `rules/src/java-nickname-characters.ts`                                        | `policy/src/rules/java-nickname-characters.ts`                                          | Unchanged Java nickname properties; old path retired in #590                              |
| `rules/src/nickname.ts` text validation/trim                                   | `policy/src/rules/nickname-text.ts`                                                     | One implementation; mixed nickname entrypoint retains trim re-export for player migration |
| `resources/src/nickname-words.ts`                                              | `policy/src/services/nickname-word-filter.ts`, `policy/src/resources/nickname-words.ts` | State and file adapter separated; old public path retired in #590                         |
| `resources/src/nickname-reserved.ts`                                           | `policy/src/resources/nickname-reserved.ts`                                             | Worker adapter moved; old path retired in #590                                            |
| `resources/data/badwords.json` and provenance README                           | `policy/src/resources/data/`                                                            | One maintained dictionary, byte-identical; build asset path updated                       |
| Resource filter tests and server word/replacement/reserved-only tests/fixtures | `policy/tests/`                                                                         | Relocated with unchanged vectors; root test discovery includes the package                |

Direct consumers use policy in server nickname composition/filter tests, service
`dragon-progression` and `red-packets`, and the resource Rules loader. The five old
module paths were removed in #590 after verifying no maintained import consumers. The remaining trim re-export is
used by `rules/nickname-change`, repositories `nickname`, `nickname-lock`,
`nickname-change`, `celebrity`, and service `celebrity`; their player-domain moves
remain under #558. Server command tests retain orchestration assertions rather
than introducing a reverse dependency from policy tests into server/game services.

## Shop vertical slice (#593)

Domain owner: `shop`. Composing app: `apps/server`. Runtime authority: the existing
realm process. Production dependent: `apps/server`; no horizontal package imports
shop. Package-local tests compose the existing inventory planner as a development
dependency, without adding a production Service-to-Service import.

| Previous source                                          | Shop destination             | Ownership and callers                                                                      |
| -------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------ |
| `contracts/src/shops.ts`, `contracts/src/trade.ts`       | `shop/src/contracts/`        | Shop state and persistence ports; shop Services/repositories/mappings/tests                |
| `rules/src/shops.ts`                                     | `shop/src/rules/shops.ts`    | Eligibility, counters, prices and schedules; shop and NPC trade Services, mapper and tests |
| `mappings/src/shops.ts`                                  | `shop/src/mappings/shops.ts` | Native offer wire fields; shop Service and tests                                           |
| `services/src/shops.ts`, `services/src/trade.ts`         | `shop/src/services/`         | Mall and NPC trade commands; server composition and integration harnesses                  |
| `repositories/src/shops.ts`, `repositories/src/trade.ts` | `shop/src/repositories/`     | Atomic shop/trade persistence; server composition and integration harnesses                |
| `apps/server/test/shops.test.ts`                         | `shop/tests/shops.test.ts`   | Existing eight behavior tests and vectors; root package test discovery                     |

All eight former source entrypoints are retired in this slice after migrating
maintained callers. A temporary facade is unnecessary once those callers have
moved; retaining horizontal re-exports would create new workspace cycles. The
architecture guard verifies that no new cycle or baseline exception is introduced.
Direct callers outside shop are server `realm-composition`, integration
`shops`, `shop-trade-recovery`, `continued-cost`, `campaign-producers`, and their
`support/shops` and `support/continued-cost` harnesses. No ignored reference or
client artifact participates in runtime resolution.

The injected `InventoryGrantPlanner` preserves the existing shared planner's
signature and implementation. Shop and trade keep their original grant/cost
arguments, transaction boundaries and failure paths. Shared inventory primitives,
Drizzle schemas, `shop_new`/`trade` catalog authoring and the generic command router
remain in their current packages for later W06/W14 slices. This is not completion
of all shop catalog ownership or the umbrella issue.

The package README maps the seven maintained native commands and verification
suites. Two Services remain below the ADR-0016 400–600-line review trigger; the
largest pure rule file is 356 lines. No performance improvement is claimed from
these moves. No database, client payload, price or account migration is required.

## Player profile-preference slice (#595)

Owner: `player`. Composing app: `apps/server`. The generic command router delegates
to a callback supplied by the app; it does not import player. The database adapter
uses the maintained Drizzle database type directly. Player has no production
horizontal Service/repository dependency and no reverse package import.

| Previous source or responsibility                                  | Destination                                      | Maintained consumers                                                        |
| ------------------------------------------------------------------ | ------------------------------------------------ | --------------------------------------------------------------------------- |
| `contracts/game` preference field and update port                  | `player/src/contracts/profile-preferences.ts`    | Player Service, repository and tests                                        |
| `services/src/profile-preferences.ts`                              | `player/src/services/profile-preferences.ts`     | Realm composition; generic router through injected callback                 |
| Seven native command names                                         | `player/src/enums/profile-preference-command.ts` | Player Service; generic router retains exact dispatch strings               |
| `repositories/src/profile-preferences.ts` and `Database` forwarder | `player/src/repositories/profile-preferences.ts` | Realm composition, mutation-foundation integration and player tests         |
| `apps/server/test/profile-preferences.test.ts`                     | `player/tests/profile-preferences.test.ts`       | Root package suite; original twelve scenarios plus boundary rejection cases |

Both old source paths and the general store mutation are retired after callers
migrate. Removing the repository forwarder and its type back-reference also removes
two pre-existing module-cycle edges; the architecture baseline shrinks from 178 to
176 entries. No new exception or dependency version is introduced. The existing
seven fields, transaction operations and native responses remain unchanged.

This slice implements player preferences under the issue's stated domain boundary;
it does not imply that all proposed player responsibilities or every package
proposal received separate semantic review. Provisioning, nicknames, public profile,
push settings, progression, shared inventory and actual process/DB fencing remain
tracked by #558. Existing row-level ownership checks are preserved, not presented
as proof of the future authority design.

## Offline client binding discovery (#598)

`catalog-tools` is the first implemented additional package from #558's proposed
bounded destinations. It owns read-only discovery, input validation, linkage and
coverage diagnostics, a CLI and synthetic tests under ADR-0018. It has no composing
runtime app or production dependencies; its parser/toolchain versions already
exist in the workspace. Existing resource importers have not moved yet.

The discovery manifest lives with the `dragon` domain and covers its complete
existing named base roster, including unavailable Vildrin. Other catalog families,
all maintained-file semantic assignments, cross-release semantic review and final
consumer cutovers remain pending. The generic tool reports every unassigned catalog
and row in its supplied inventory; a partial inventory cannot establish W01 or W14
completion. No client source or bulk localization is versioned or needed in CI.

## Offline catalog importer slice (#601)

Owner: `catalog-tools`; no composing runtime application. The six old
`resources/scripts` modules are retired after moving CLI entrypoints to
`catalog-tools/scripts`, conversion and named-record adapters to
`catalog-tools/src/mappings`, and writing to `catalog-tools/src/generators`.
The catalog generator receives explicit resource/Hero destinations; CLI defaults
still target the original maintained locations. The building generator also takes
an explicit destination, with the original building directory as CLI default.

Import-specific automation and named-record assertions move to tool tests.
Runtime Hero/Dragon roster, compatibility and automation catalog assertions stay
in resources. This avoids a reverse resource-to-tool dependency. Tool-only enum
and Hero dependencies are development dependencies using existing workspace
versions. No runtime catalog, provenance, native binding or player state changes.

The fixture XML adapter and building compatibility conversion stay with resources
until their runtime/test callers migrate. This slice does not complete exhaustive
catalog ownership or named-definition migration. Synthetic output baselines and
the existing package/architecture suites are the cutover gates.

## Player push-preference slice (#603)

Owner: `player`; composing app: `apps/server`. The generic router receives
`GameServices.playerPreferences`, a structural port for standalone commands,
configuration reads and conditional news initialization. There is no horizontal
Service/repository import into player and no reverse production import through
a compatibility facade.

| Previous source or responsibility                    | Player destination                                           | Consumers                                                 |
| ---------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| `contracts/game` push input/store operations         | `contracts/push-preferences`                                 | Player Service/repositories and relocated tests           |
| `dtos/profile/update-push-preference.dto`            | `dtos/update-push-preference.dto`                            | Player Service                                            |
| Generic GameService push commands and initialization | `services/push-preferences`, `enums/push-preference-command` | App-injected router/login callback; player tests          |
| Broad Database configuration snapshot                | `repositories/push-preferences-snapshot`                     | Realm composition and cross-component configuration tests |
| `repositories/push-preferences` explicit mutation    | `repositories/push-preferences`                              | Realm composition and player/PG tests                     |
| Broad Database world-news insertion                  | `repositories/world-news-preference`                         | Realm composition and player/PG tests                     |
| Server push command, adapter and news tests          | `player/tests`                                               | Root package suite                                        |

All three broad Database entrypoints, their GameStore methods, the old setter
module and old DTO path are retired after callers migrate. Unused fixture members
are removed from other command tests. Login and configuration adapter tests stay
with server because they exercise shared switch/cache/feature orchestration too.
The configuration snapshot response contract and bootstrap wire mapper/schema
remain shared: both login and standalone preference reads use their single
implementation. No native ID/default/wire/schema change is part of the move.

This preserves the current realm authority. PostgreSQL verification exercises its
existing fencing, concurrency, rollback and restart behavior, not the unimplemented
player/world authority split. Player provisioning, nicknames, public profile,
progression and other W06 responsibilities remain open.

Removing the broad Database setter and its type back-reference also removes two
pre-existing module-cycle edges. The architecture baseline shrinks from 176 to
174 entries; no new exception is added.

## Repository database-type foundation (#605)

`drizzle/src/contracts/database.ts` owns type-only aliases derived from its existing
constructors: `DatabaseClient<Role>`, `DatabaseConnection<Role>` and
`DatabaseConnections`. No new runtime abstraction or persistence implementation is
introduced. 112 horizontal repositories, nine Hero repositories and two shop
repositories stop indexing connection types through the broad `Database` facade.
An inline import type in red-packets is included; applications and explicit test
fixtures may still compose the facade while its runtime decomposition continues.

All 123 edited modules emit identical JavaScript before/after type erasure. The
normal server bundle and copied policy asset also retain their exact bytes. Type
checks cover the affected adapters and consuming apps. Repository code, SQL,
transaction isolation, locking, authority and public runtime exports are unchanged.

The architecture guard rejects direct and transitive facade dependencies from
repository implementation paths, including type imports and intermediary contract
re-exports. Removing the type back-references eliminates 65 facade-related cyclic
edges and nine other edges that no longer participate in those strongly connected
components. Only those 74 reviewed cycle entries are removed: the baseline falls
from 174 to 100, with no new exception. The nine indirect edges concern the existing
mail window/presentation/intents, profile-alliance and ranking-building paths;
their runtime imports remain intact.

This is a dependency foundation for W06-W12, not completion of their domain
ownership or retirement of the broad runtime facade. The remaining baseline debt
and the full package/file/catalog/command disposition remain #558 work.

## Global account provisioning (#607)

Seven source modules now belong to `account`: reader/store contracts, create DTO,
Controller, Service, account reader and global reservation repository. All callers
migrate and their horizontal predecessors are retired. The API no longer depends
directly on horizontal Services or repositories. Shared account/realm protocol,
validation and hash implementations remain single sources; realm seeds and grants
moved to player in #609. See [account](account/README.md)
for preserved behavior, dependencies, tests and rollback. This does not complete
all W06 domains or introduce ADR-0017 process ownership.

## Realm character provisioning (#609)

Player now owns the character seed/creator contract, unchanged starter rules,
Service, Controller, transactional writer and its injected transaction port.
The original seed test moves to player; creation boundary tests run in the root
package suite. All maintained consumers migrate and both horizontal provisioning
aggregates retire. `apps/server/src/character-provisioning.ts` binds current
world-allocation, fence and mutation-record collaborators; callbacks receive the
same transaction and current realm authority. Player has no runtime dependency
on horizontal repositories. Account/realm protocol contracts and hashes remain
shared; global reservations stay in account. This preserves the current atomic
player/world initialization and does not implement W17/W18 process cutover.
See [player](player/README.md) for compatibility, tests and rollback.

## Economy balance foundation (#611)

`economy` is an implemented additional package required by #558 W06, with four
source modules and one test file. It owns the existing fourteen-asset allowlist,
balance plan and transactional debit/credit adapter. Realm composition injects the
same mutation executor; the returned adapter body remains byte-identical. The old
horizontal source is retired after all callers migrate. Shared posting validation
stays in ledger, and receipt/epoch/outbox ownership remains in the current realm.
Domain tests cover valid and invalid plans; the existing cross-component PostgreSQL
mutation foundation integration remains in server tests. See [economy](economy/README.md)
for boundaries, verification and rollback. Inventory, reservations and the remaining
economic consumers still require extraction; this is not completion of W06.

## Activity economic coordination and contracts (#613)

Economy now has eight source modules and two test files: the balance foundation
plus InventoryItem/InventoryFields, ActivityEconomy, the ActivityLedger port and
the extracted debit/activity adapter. Eleven existing Services use the domain
adapter. The original functions retain their behavior; InventoryPlanner adds two
saved-balance readers using the original row conversion. No economy source/test
imports horizontal contracts or Services.

Ledger owns the original shared mutation command/result/posting/event interfaces
and its unchanged posting-boundary test. All maintained type consumers migrate;
`contracts/mutation` and the former inventory/activity type exports are retired.
This removes the reverse ledger-to-contracts dependency while keeping ledger a
small primitive package. Shared inventory/activity state and remaining planners
stay tracked under #558. The six reviewed stale cycle edges are removed from the
architecture baseline, 100 to 94; no new exception is added. See
[economy](economy/README.md) and [ledger](ledger/README.md) for verification and rollback.

## Pure inventory rules (#615)

Economy has ten source modules and four test files after taking ownership of
inventory count validation, goods lookup, pricing, recipes and weighted draws.
Its narrow InventoryCatalogs port accepts the existing goods map without a reverse
dependency on horizontal rules. All maintained callers move to the owned path and
the original module is retired. Existing rule test behavior remains identical;
additional catalog boundary coverage preserves native string IDs and errors.
The resource catalog test declares economy as a development dependency and shop
declares its direct runtime dependency. No new
architecture exception, saved-state change or process authority is introduced.
Full InventoryPlanner and inventory persistence remain tracked under #558.

## Shared protocol validation (#617)

Messages owns the four existing shared response/wire validation modules and one
boundary test suite (thirteen source modules total). Every maintained consumer
uses the canonical messages entrypoints; old contracts, validations and mappings
paths are retired without facades. This allows domain schemas and serializers to
use protocol primitives without depending back on the horizontal owners.

Scalar widths, recursive shapes, byte limits, native tags, floating-point values,
prototype keys and original field identity/order remain unchanged. Zod uses the
already pinned catalog version. Domain-specific response schemas and mappings
remain with their current owners until their own slices migrate. See
[messages](messages/README.md) for boundaries, parity evidence and rollback.
