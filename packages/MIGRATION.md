# Domain migration register

Parent: [#558](https://github.com/ReeseArch64/opencok/issues/558). Convention: [ADR-0016](../docs/decisions/0016-adopt-domain-owned-package-layout.md).

This register accounts for all 64 original package directories, including four retired packages and the store-to-shop rename. The current tree has 64 package workspaces, including `catalog-tools` (#598), `economy` (#611), `production` (#633) and `research` (#643). Confirmed entries reproduce maintainer decisions; proposed entries require disposition review. No proposed row claims completed extraction, service deployment or verified client support.

## Existing package disposition review

Counts describe maintained TypeScript/JavaScript source under `src` and named test files, not handwritten behavioral size. Config-only workspaces can be valid. Counts start from the stack through #579; migrated rows are updated with their slice; reproduce detailed file/dependency evidence with `bun --no-env-file tests/architecture/inventory.ts`.

| Original package | Current source / tests | Responsibility                                                                                                                                                                                                 | Disposition and boundary                                                                                                                                                                                                                                                                      | Review                   |
| ---------------- | ---------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| `account`        |                  8 / 2 | Global account reads, lifecycle and account-to-character linkage.                                                                                                                                              | Implemented reservation/activation and discovery slice in #607; authentication remains in identity and realm character initialization belongs to player after #609.                                                                                                                           | Implemented in #607      |
| `alliance`       |                  0 / 0 | Membership, permissions, help, gifts, research and alliance coordination.                                                                                                                                      | Populate from current alliance Services/Rules/Repositories/Contracts/Mappers; split `alliance-territory` or `alliance-events` if cohesion/size requires. Preserve participant-lock ordering and shared research effects.                                                                      | Proposed; pending review |
| `api`            |                  8 / 0 | Existing HTTP routing/compatibility adapters.                                                                                                                                                                  | Retain as bounded API adapter package or move app-only routing into `apps/api`; move media/auth use cases to owners. Do not make it a second application layer containing all domains.                                                                                                        | Proposed; pending review |
| `api-client`     |                  0 / 0 | Typed clients for real public/internal API contracts.                                                                                                                                                          | Defer any unimplemented capability until a concrete consumer/use case is approved. Populate only for actual consumers and implemented endpoints, not speculative SDKs; no database imports.                                                                                                   | Proposed; pending review |
| `api-contracts`  |                  0 / 0 | Versioned HTTP API requests/responses and boundary validators.                                                                                                                                                 | Populate HTTP-specific contracts; keep domain ports local and integration envelopes separately owned. Avoid duplicating the entire domain model.                                                                                                                                              | Proposed; pending review |
| `base`           |                  1 / 0 | Domain base classes; shared exact command matching.                                                                                                                                                            | #643 supplies the dependency-free base used by research and legacy city domains.                                                                                                                                                                                                              | Implemented in #643      |
| `billing`        |                  0 / 0 | Orders, billing and provider reconciliation.                                                                                                                                                                   | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                                                                        | Confirmed in #567/#568   |
| `building`       |                 48 / 2 | Typed building catalogs, definition contracts, level/star evaluation and display/legacy mappings.                                                                                                              | #635 owns the catalog/evaluation boundary. Construction Services and city coordination remain W07; semantic archetypes remain W14.                                                                                                                                                            | Partial; #635            |
| `campaigns`      |                  0 / 0 | Bounded campaign/event orchestration and publication.                                                                                                                                                          | Populate current campaign-related code; split independent event families instead of absorbing every event in the game.                                                                                                                                                                        | Proposed; pending review |
| `city`           |                 20 / 3 | Transactional plans, dispatch, bounded snapshots, persistence and bootstrap coordination.                                                                                                                      | #637/#639/#641 own runtime, persistence and bootstrap coordination. Shared ports/aliases, reconnect planning and individual mechanic ownership remain W07–W12/W20 work.                                                                                                                       | Partial; #637/#639/#641  |
| `combat`         |                  0 / 0 | Pure battle models, calculations, deterministic replay and result contracts.                                                                                                                                   | Populate only implemented/extracted mechanics; separate computation from result application. Package required where real code exists, standalone app optional.                                                                                                                                | Proposed; pending review |
| `command`        |                  0 / 0 | Explicit command registration/routing/envelopes and execution boundary contracts.                                                                                                                              | Populate reusable routing responsibilities now mixed with generic GameService/transport; domain command behavior stays in domain Services.                                                                                                                                                    | Proposed; pending review |
| `config`         |                  0 / 0 | Shared TypeScript/tool configuration.                                                                                                                                                                          | Retain; this is not an unused runtime package just because it lacks `src`. Do not move secrets or ambient runtime configuration here.                                                                                                                                                         | Proposed; pending review |
| `connection`     |                 20 / 0 | Existing TCP/SFS and Chat transport code.                                                                                                                                                                      | Separate into bounded game transport and `chat-transport` ownership; keep session/backpressure behavior. Rename only after imports migrate.                                                                                                                                                   | Proposed; pending review |
| `constants`      |                  6 / 0 | Current native bindings/compatibility values.                                                                                                                                                                  | Gradually move domain-specific values to owned bindings under ADR-0016. Retain genuinely shared constants; do not replace one large generic package with another.                                                                                                                             | Proposed; pending review |
| `contexts`       |                  0 / 0 | Reserved for the web application. Leave this package unchanged in the backend decomposition.                                                                                                                   | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                                                                        | Confirmed in #567/#568   |
| `contracts`      |                198 / 0 | Current mixed ports, wire models and responses.                                                                                                                                                                | Redistribute to domain contracts, protocol adapters, `api-contracts` and bounded integration contracts. Temporary re-exports only, with removal criteria; no replacement mega-contract package.                                                                                               | Proposed; pending review |
| `controllers`    |                 29 / 1 | Existing thin HTTP/SFS/Chat Controllers.                                                                                                                                                                       | Redistribute into approved domain adapter locations or bounded transport packages, maintaining constructor injection. ADR-0016 now permits domain-local Controllers; preserve compatibility while migrating.                                                                                  | Proposed; pending review |
| `core`           |                 14 / 7 | Existing runtime, resources, logging, telemetry and worker lifecycle.                                                                                                                                          | Separate into `runtime` and `observability` as cohesion warrants; leave minimal compatibility exports temporarily. No domain logic.                                                                                                                                                           | Proposed; pending review |
| `custom`         |                  0 / 0 | No intended responsibility. Remove the unused workspace.                                                                                                                                                       | Retired in #568                                                                                                                                                                                                                                                                               | Confirmed in #567/#568   |
| `decorators`     |                  0 / 0 | Retain for planned decorator use. No decorators are introduced by this decision; existing DTO conventions still apply.                                                                                         | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                                                                        | Confirmed in #567/#568   |
| `dragon`         |                 21 / 0 | Named dragon archetypes and full dragon-specific progression/talents/validation/mapping.                                                                                                                       | Extend existing ownership by migrating remaining dragon workflows from global layers. Keep towers/events separate if their mechanics warrant an independent package.                                                                                                                          | Proposed; pending review |
| `drizzle`        |                865 / 8 | PostgreSQL pools, schemas, migrations and setup.                                                                                                                                                               | Retain technology package initially. Keep domain query implementations in owned repositories; group schema ownership without a big-bang schema/package rename. Large schema inventory is not evidence of many behavioral responsibilities.                                                    | Proposed; pending review |
| `dtos`           |                  3 / 0 | Current create/update inputs.                                                                                                                                                                                  | Move into owning domains/API boundaries under ADR-0016, with temporary aliases. Queries/responses are contracts, not DTO classes.                                                                                                                                                             | Proposed; pending review |
| `email`          |                  0 / 0 | Outbound email integration and templates for actual product use cases.                                                                                                                                         | Defer any unimplemented capability until a concrete consumer/use case is approved. Populate only when actual implementation/use is confirmed; otherwise explicitly deferred, not silently deleted or implemented with a new provider.                                                         | Proposed; pending review |
| `enums`          |                 24 / 0 | Current shared/domain semantic enums.                                                                                                                                                                          | Keep compatibility initially; colocate domain-only identities with approved domain contracts later. Truly shared finite protocol alternatives stay bounded.                                                                                                                                   | Proposed; pending review |
| `env`            |                 15 / 6 | Validated injectable process environment.                                                                                                                                                                      | Retain, add app-specific schemas only for implemented processes; one root configuration source, no copied `.env` files.                                                                                                                                                                       | Proposed; pending review |
| `errors`         |                  4 / 0 | Stable cross-cutting failure classifications.                                                                                                                                                                  | Retain small; move mechanic-specific failures to owners where appropriate. Do not leak private payloads through errors.                                                                                                                                                                       | Proposed; pending review |
| `events`         |                  0 / 0 | Versioned integration-event contracts and ownership documentation.                                                                                                                                             | Proposed place for event contracts; domain-internal events stay local. Do not mix event definitions, broker clients and every event handler.                                                                                                                                                  | Proposed; pending review |
| `generators`     |                  0 / 0 | Classes for generating monsters, construction, messages and other concrete outputs. This is not restricted to offline catalog tooling. Generation does not itself grant authority to persist gameplay effects. | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                                                                        | Confirmed in #567/#568   |
| `guard`          |                  0 / 0 | Authentication and authorization at transport entrypoints.                                                                                                                                                     | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                                                                        | Confirmed in #567/#568   |
| `helpers`        |                  0 / 0 | English placeholders, as specified by the maintainer. Populate when a concrete consumer establishes the required interface.                                                                                    | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                                                                        | Confirmed in #567/#568   |
| `hero`           |                237 / 0 | Named hero/general definitions and core owned progression.                                                                                                                                                     | Preserve reference model and move remaining domain-specific consumers. Review separate hero events/rankings for medium-package boundaries; eliminate broad dependency cycles, not just paths.                                                                                                 | Proposed; pending review |
| `i18n`           |                  0 / 0 | Localization-key resolution and typed references for actual consumers.                                                                                                                                         | Defer any unimplemented capability until a concrete consumer/use case is approved. Distinguish runtime localization from offline client-name discovery. Do not ship private client localization bundles or use locale text as persistent identity.                                            | Proposed; pending review |
| `identity`       |                 14 / 0 | Authentication, tickets, signing and trusted identity boundaries.                                                                                                                                              | Retain and bound; move account lifecycle out. Preserve purpose separation, expiry, authorization and optional integration behavior.                                                                                                                                                           | Proposed; pending review |
| `kvk`            |                  0 / 0 | Cross-realm gameplay protocols and approved KvK mechanics.                                                                                                                                                     | Defer any unimplemented capability until a concrete consumer/use case is approved. Define with maintainer; populate only supported code. Existing unsupported cross-realm behavior must remain unsupported until its owner/protocol exists.                                                   | Proposed; pending review |
| `ledger`         |                  2 / 1 | Mutation/receipt/outbox contracts, posting validation and owned tests after #613.                                                                                                                              | Extend current posting code for genuine shared invariants; do not turn it into a separate network balance service by default.                                                                                                                                                                 | Proposed; pending review |
| `mappings`       |                108 / 1 | Current global serializers/projections.                                                                                                                                                                        | Redistribute by domain and protocol; no global mapper index importing every mechanic. Preserve field types/order and conditional omission.                                                                                                                                                    | Proposed; pending review |
| `messages`       |                 13 / 1 | SFS framing, Java/legacy encoding, response values and shared wire/schema validation after #617.                                                                                                               | Retain or deliberately rename `protocol-sfs`; not a broker package. Keep numerical and field-order compatibility.                                                                                                                                                                             | Proposed; pending review |
| `middlewares`    |                  0 / 0 | HTTP/transport interception, including request context.                                                                                                                                                        | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                                                                        | Confirmed in #567/#568   |
| `mongoose`       |                  1 / 0 | Current MongoDB Chat archive adapter, using the `mongodb` driver.                                                                                                                                              | Assign to bounded document-storage/Chat archive adapter; rename only with evidence. Do not adopt Mongoose merely because of the current directory name.                                                                                                                                       | Proposed; pending review |
| `notifications`  |                  0 / 0 | Delivery intents/channels and owned delivery state.                                                                                                                                                            | Populate current notification/integration responsibilities. In-session SFS delivery stays with gateway transport; FCM/external delivery is worker work. No direct gameplay grants.                                                                                                            | Proposed; pending review |
| `npc`            |                  0 / 0 | Named NPC/monster archetypes and owned behavior policies.                                                                                                                                                      | Populate definitions and supported NPC behavior; clarify monster/NPC family boundaries. Spatial admission/spawn coordination belongs to world authority/population. Not authenticated player bots.                                                                                            | Proposed; pending review |
| `payments`       |                  0 / 0 | Idempotent delivery of purchased benefits to the realm. Economic grants remain under the realm authority.                                                                                                      | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                                                                        | Confirmed in #567/#568   |
| `player`         |                43 / 20 | Character provisioning, profiles/descriptions, nickname workflows, preferences and bounded player progression.                                                                                                 | Preferences in #595/#603, provisioning in #609 and public profile queries in #627 and celebrity descriptions in #629; nickname workflows in #631; remaining progression ownership is tracked by #558. Keep wallet/inventory and mechanics in their own packages; global account != character. | Proposed; pending review |
| `policy`         |                  7 / 4 | Content matching, reserved-name rules, bounded file/worker adapters and the maintained word dictionary.                                                                                                        | Implemented in #589; five compatibility paths retired in #590. Player nickname mutations remain separate.                                                                                                                                                                                     | Confirmed in #567/#568   |
| `production`     |                  9 / 2 | Building production accounts, accumulation, collection/boosts, rate schedules and atomic city settlement.                                                                                                      | New owned domain in #633 under W07; current realm authority and shared economic transactions remain. Catalog authoring and broader city/building ownership remain tracked separately.                                                                                                         | Implemented in #633      |
| `prompts`        |                  0 / 0 | No current use. Remove the unused workspace.                                                                                                                                                                   | Retired in #568                                                                                                                                                                                                                                                                               | Confirmed in #567/#568   |
| `queues`         |                  0 / 0 | Persistent timed-activity lifecycle, dispatch contracts and shared queue invariants.                                                                                                                           | Populate current timed-activity mechanism; keep economic completion inside owned transactions. Transport queues and broker clients are distinct infrastructure responsibilities.                                                                                                              | Proposed; pending review |
| `ranking`        |                  0 / 0 | Common ranking contracts, exact arithmetic, tie-breaking, publication/finality primitives and bounded ranking use cases.                                                                                       | Populate existing code; move large event-specific families to their event packages. A projection may be asynchronous; prize funding remains authoritative.                                                                                                                                    | Proposed; pending review |
| `repositories`   |                174 / 0 | Current global persistence implementations.                                                                                                                                                                    | Redistribute by domain and approved write ownership; retain schema/pool plumbing in `drizzle`. Remove compatibility exports only after callers migrate.                                                                                                                                       | Proposed; pending review |
| `resources`      |               1373 / 9 | Current gameplay definitions, generated catalog records, provenance and import tools.                                                                                                                          | Distribute definitions/tables to domain owners and tooling to `catalog-tools`. Keep a bounded temporary compatibility facade. Do not rename all of it to one giant `game-data` package.                                                                                                       | Proposed; pending review |
| `robot`          |                  0 / 0 | Remove the unused package. A future robot application will consume domain packages directly; do not scaffold or rename an application in this slice.                                                           | Retired in #568                                                                                                                                                                                                                                                                               | Confirmed in #567/#568   |
| `rules`          |                159 / 3 | Current global gameplay rules plus Java compatibility helpers.                                                                                                                                                 | Move mechanics to owners; extract bounded `legacy-compat` primitives for factual shared numeric/text behavior. Pure rules remain pure.                                                                                                                                                        | Proposed; pending review |
| `scripts`        |                  0 / 0 | Remove the unused workspace. Existing application/package script directories are unrelated and remain intact.                                                                                                  | Retired in #568                                                                                                                                                                                                                                                                               | Confirmed in #567/#568   |
| `services`       |                166 / 0 | Current global application workflows.                                                                                                                                                                          | Redistribute feature by feature into medium domains; replace broad GameService dispatch with explicit routing and narrow Services. Do not rename the package and preserve its monolith.                                                                                                       | Proposed; pending review |
| `share`          |                  0 / 0 | Social sharing, including battle reports and related content.                                                                                                                                                  | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                                                                        | Confirmed in #567/#568   |
| `skins`          |                  0 / 0 | Proposed cosmetic definitions, ownership/application and presentation mapping.                                                                                                                                 | Populate existing city/avatar/cosmetic responsibilities only where semantically confirmed; paid media uploads stay in media, not skins.                                                                                                                                                       | Proposed; pending review |
| `storage`        |                 23 / 0 | Current Redis, coordination, S3, ranking and other adapters.                                                                                                                                                   | Split by owned purpose: sessions/coordination, media, ranking caches and domain adapters. Avoid a universal persistence utility package.                                                                                                                                                      | Proposed; pending review |
| `store`          |                  9 / 1 | Renamed to `shop`; owns mall/NPC trading contracts, rules, mappings, Services and repository adapters.                                                                                                         | Renamed in #568; gameplay slice and caller retirement in #593                                                                                                                                                                                                                                 | Confirmed in #567/#568   |
| `tasks`          |                  0 / 0 | Player quests, event missions and related progression. Background work belongs to jobs, not this package; no new jobs workspace is implied.                                                                    | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                                                                        | Confirmed in #567/#568   |
| `troops`         |                 11 / 1 | Owned troop training, healing, fortification, capacity/rules, mappings, validation and transactional adapters.                                                                                                 | #645 composes existing completion hooks and military login/reconnect projections in the realm. Named definitions, shared power/building helpers and world/march providers remain tracked.                                                                                                     | Implemented in #645      |
| `utils`          |                  0 / 0 | Formatting tools, such as input/display masks.                                                                                                                                                                 | Retain for confirmed scope; move real implementations in tested slices                                                                                                                                                                                                                        | Confirmed in #567/#568   |
| `validations`    |                 73 / 1 | Current mixed definition/request/media validators.                                                                                                                                                             | Move to owning domain or boundary; shared validation primitives remain small. Sharp/image processing must not become an import dependency of pure gameplay validators.                                                                                                                        | Proposed; pending review |
| `webhooks`       |                  0 / 0 | Provider webhook transport, signature/replay boundary and dispatch.                                                                                                                                            | Defer any unimplemented capability until a concrete consumer/use case is approved. Populate actual payment/integration adapters as implemented. Domain lifecycle remains billing/payments; avoid duplicated generic webhook business logic.                                                   | Proposed; pending review |

## First vertical migration candidates

These candidates use existing modules and confirmed meanings. They are review units, not permission to omit the rest of the inventory. The current composing authority remains `apps/server` unless stated otherwise. Create a new package only when its implementation moves.

| Slice             | Existing evidence                                                                                  | Proposed owner              | Required verification and remaining decisions                                                                                                   |
| ----------------- | -------------------------------------------------------------------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Content policy    | `resources/src/nickname-words.ts`, `resources/data/badwords.json`, nickname matching rules         | `policy`                    | Implemented in #589 with relocated tests, immutable fixture hashes and packaged loader checks. Compatibility paths retired in #590.             |
| Shop              | Shop Services, rules, repositories, contracts and mappings                                         | `shop`                      | Gameplay slice in #593; catalog authoring remains pending. Event exchanges and paid entitlements stay distinct.                                 |
| Player missions   | Quests and target-task modules across global layers                                                | `tasks`                     | Initialization, claim/retry, timed progression and restart. Event score/finality may remain event-owned; no background jobs in tasks.           |
| Buildings         | Building catalogs, construction Services/rules and contracts                                       | `building`                  | Catalog parity, city progression, timed economy. Preserve city transaction coordination; semantic identities still need client-backed evidence. |
| Research          | Ordinary/civilization workflows, rules, mappings, validation, contracts and transactional adapters | `research`                  | Implemented in #643; shared catalogs/read providers and semantic definitions remain tracked.                                                    |
| Troops            | Training, hospital, fortification and military modules                                             | `troops`                    | Implemented in #645; shared helpers, catalogs and world/march consumers remain tracked.                                                         |
| Media and postbox | Existing GameService workflows                                                                     | `media` / `mail` candidates | Reuse #552/#553 and avatar/mail suites; do not duplicate their work.                                                                            |
| World recovery    | Population/march jobs in server composition                                                        | Domain extraction pending   | #572/#574 tests plus world persistence/process recovery. These jobs do not establish a player/world authority split.                            |

## Catalog and command review

The reproducible inventory records maintained files, current workspace owners and reverse import evidence. Future owners remain explicitly unreviewed until each vertical slice records its decision. Catalog membership is declared in `enums/src/gameplay-catalog.ts`; building definitions additionally live under `building/src/resources/buildings`. Native catalog identifiers remain distinct from semantic identities. Never invent a class or English identity from an opaque ID.

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
used by the player nickname and celebrity implementations after #629/#631, plus
shared nickname primitives used by Dragon. Policy remains independent of player;
the remaining primitive relocation is tracked by #558.

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

## Inventory response ownership (#619)

Economy now has fourteen source modules and five test files, including inventory
response mappings, the shared login/grant item mapper, item schema and response
contracts. Every maintained consumer uses the domain paths. The old inventory
mapping/response modules and bootstrap item exports are removed. Existing saved-row
conversions are preserved at the compatibility boundary and goods lookups use the
owned narrow catalog port. Shared protocol checks use messages; economy has no
reverse dependency on horizontal mappings, validations or rules. Validations declares
its actual dependency on the owned item schema. Zod uses the existing catalog version.

Before/after vectors verify fields, errors, precise balances, replay and push order.
No schema, save rewrite, native format or authority change occurs. Full inventory
planning and persistence remain under #558; see [economy](economy/README.md).

## Stateful inventory ledger (#621)

Economy has sixteen source modules and six test files after extracting the eleven
existing item/balance ledger methods and their staging fields. The narrow owned
snapshot supplies profile/resource/assets/items; shared InventoryState extends it
with the remaining command/effect fields. InventoryPlanner inherits the domain
ledger while retaining command coordination and the current transaction executor.

Six identical tests (86 assertions) pass against the original planner, extracted
ledger and inheriting planner. Real PostgreSQL suites cover composed retry, rollback,
recovery and fencing. No new dependency, architecture exception, saved-state format
or process authority is introduced. The 177-line ledger is cohesive; the residual
616-line Services module was the next reviewed migration target; #623 extracts
command ownership below while persistence and cross-domain adapters remain tracked.
See [economy](economy/README.md) for the boundary and rollback details.

## Inventory command planning (#623)

Economy has twenty-four source modules and seven test files. InventoryService,
InventoryPlanner, grant planning and command state/plan/executor contracts move
into owned responsibility directories. Resource response mapping/schema/contracts
move with them; maintained callers use the new paths and explicit composition
factories. The old Services inventory module is removed without a reverse facade.

Feature, power and continued-cost dependencies are injected through InventoryRuntime.
The legacy Services runtime adapter retains their existing implementations and read
order. Shared InventoryState extends the owned state only for its power snapshot;
repository transactions and realm authority remain unchanged. AllianceContext
receives shared effects directly. No new dependency cycle exception is permitted.

Seven original command/resource vectors retain 53 assertions; three domain runtime
vectors and two server adapter tests cover ordering, precision and rejection. Real
PostgreSQL integrations verify the composed factories and atomic side effects.
No schema migration or data rewrite is required. #625 below moves inventory
persistence; remaining app composition and process authority work stays under #558. See
[economy](economy/README.md) for verification boundaries and recovery.

## Inventory persistence (#625)

Economy has twenty-six source modules and eight test files. Its inventory repository
now owns snapshot reads, item/balance/cooldown writes, identity validation and posting
chains. The owned transaction contract supplies preparation callbacks, an injected
mutation executor and cross-domain snapshot/confirmation ports. No new dependency
or architecture exception is required.

The existing realm repository adapter supplies fenced execution, lazy power reads
and continued-cost confirmation merging. Maintained consumers use its explicit
realm factory names; the old horizontal inventory module is removed. Shared mutation
infrastructure and the remaining power/confirmation adapters stay tracked under #558.

Six original persistence vectors retain 84 assertions, with three additional port
vectors verifying request capture, callback order and failures. PostgreSQL realm
and chat integration verifies real atomicity, replay and recovery. SQL ordering,
owner predicates, limits, native output and saved data remain unchanged. No migration
or configuration change is required; rollback uses the previous artifacts. See
[economy](economy/README.md) for exact boundaries and verification limits.

## Public profile ownership (#627)

Player has twenty-six source modules and eleven test files. The get.user.info Service,
profile routing/snapshot repository, base mapping, schemas, response/state contracts
and profile presentation rules now live in its responsibility directories. The realm
app composes observer, Hero/alliance and cache providers and owns profile readiness.
GameService delegates; the GameStore/Database query and old horizontal profile mapping,
schema, response and repository paths are removed.

Hero and alliance providers use narrow independent snapshots. The shared equipment
preview is separated from the player aggregate because equipment and activity rewards
also consume it. Alliance presentation, shared numeric/statistics primitives and generic
catalog access remain real dependencies under #558, not backward facades. Zod uses
the already pinned catalog version as a new direct player dependency.

All 41 original composed vectors retain 529 assertions; two owned Service tests and
a real two-realm PostgreSQL scenario cover composition, provider order, routing,
privacy, restart and rejection without realm fallback. Existing SFS core integration
checks startup and realm behavior. No schema, save rewrite, protocol or writer change
is introduced; rollback uses the previous artifact. See [player](player/README.md).

## Celebrity description ownership (#629)

Player owns the celebrity description read/save Service, narrow store/filter contracts
and PostgreSQL repository. Realm composition supplies the existing filter and database
handles; the generic command router delegates without importing player. The old
Services/repositories modules and GameStore/Database methods are removed with all
maintained consumers migrated. Generic startup retains its celebrity table check.

The original sixteen command/repository tests move with the domain and keep their
321 assertions. The actual composition is also exercised against two disposable
PostgreSQL realms, including rollback, locked eligibility revalidation and restart.
There are 29 player source modules and 13 test files. Policy is a declared workspace
development dependency for the moved filter tests; no version changes. No new cycle
exception, schema migration or saved-description conversion is required. See
[player](player/README.md) for preserved behavior and rollback.

## Nickname ownership and shared identity (#631)

Player owns nickname availability and paid change use cases, records, notification
mappings/schemas, pure change/check rules and global/realm nickname persistence.
All maintained consumers leave the former horizontal paths. Realm composition
injects cost-fact/system-mail/shared-user operations into the existing transactions
and keeps the existing recovery loop, authority checks and delivery order.

Canonical account identity lookup moves to account. The chat app injects it into the
chat repository; ranking ingestion receives the owned payment witness decoder.
These ports avoid new reverse dependencies. Alliance task contracts are separated
from the full nickname record/store; shared naming primitives remain shared for
Dragon and other callers. No new cycle exception is added; two resolved violations
are removed, reducing the architecture baseline from 94 to 92.

Seven focused suites and two unchanged vector fixtures move to player. The original
107 cases/30946 assertions, runtime comparisons and real PostgreSQL recovery,
notification, ranking and chat tests verify the migration. Player now has 43 source
modules/20 test files; account has eight source modules. Workspace dependency edges
change for explicit composition, with no version upgrade. Existing operation receipts,
pending deliveries, saved names and schema stay compatible. See [player](player/README.md)
and [account](account/README.md) for rollout, rollback and remaining scope.

## Production ownership (#633)

The new production workspace owns its Service, effect/rate context, fixed-point
settlement rules, rate codec/boost mapping, contracts, production repository and city
mutation boundary. The former horizontal production modules are removed after all
maintained callers migrate. Timed activity lifecycle rules/contracts remain shared.

Realm composition injects inventory planning, fenced mutation/inventory execution and
world decoding. Production has no reverse facade and no import from horizontal Services
or Repositories. The existing city change callback remains inside the same transaction
between old-rate settlement and new-rate generation, including demolition resource
transfers. Upkeep, weakness, effect expiry, Hero and alliance contributions retain their
existing calculations and deadlines.

Production has nine source modules and two test files. Root package tests include it.
The original unit and PostgreSQL cases retain their assertions; mapping tests and
fourteen runtime comparisons supplement integration coverage of city/effect consumers.
No dependency version, database schema, checkpoint format or authority changes. Broader
W07 ownership and W14 named definitions remain incomplete. See
[production](production/README.md) for contracts, validation and rollback.

## Building catalog and evaluation ownership (#635)

Building owns the former building contracts, level/star rules, display mapping,
legacy-record adapter and the complete typed building catalog. The resource loader,
central Rules, city serialization, construction and test consumers use owned paths;
the old horizontal modules and resource export are removed. Catalog-tools retains
authoring orchestration with the new default directory and contract import.

The 48 source modules consist of 41 numeric data modules and seven small contract,
rule, mapper and indexing modules. The original catalog tests move into building,
with boundary cases added separately; root package tests include them. All 50 moved
files (including the original test and provenance) compare identically after import
normalization. The generator keeps the original byte digest after normalizing only
its contract import. No dependency cycle exception or runtime policy change is added.

Construction workflows, cross-mechanic city coordination and named archetypes remain
open under #558. Ownership does not establish completion of W07 or W14. See
[building](building/README.md) for source mapping, compatibility and rollback.

## City transactional coordination (#637)

City owns the runtime Context, ContextFactory and Service, composed in the realm
with existing world-context and campaign/quest/Hero/expedition callbacks. App and
integration constructors use the owned runtime. Shared generic plan/domain ports
avoid new reverse dependency cycles; no implementation is copied and no architecture
exception is added. The former Service/context-factory/function entrypoints are removed.

Two existing Services paths now contain type-only specializations with no runtime
behavior. Their owner is the city migration; #558 W07/W20 tracks their retirement
as their callers move into domains and narrow their contracts. Current callers:

- `services/src/city-progression-context.ts` (53 type consumers):
  packages/services/src/: `anniversary`, `castle-level-event`, `city-cosmetics`, `city-defense`, `city-domain`, `civilization-castle`, `comeback`, `construction`, `continued-cost`, `daily-investment`, `dragon-progression`, `dragon-tower`, `egg-activity`, `equipment`, `gold-eggs-rewards`, `gold-eggs`, `groupbuy`, `hot-item`, `local-campaign`, `lottery`, `military-rank-awards`, `minstrel`, `new-expedition`, `normal-recharge`, `player-effects`, `prayer`, `progression-rewards`, `quests`, `recall-task`, `red-packets`, `seven-day-cycle`, `target-task`, `totem`, `treasure-excavation`, `treasure-map-state`, `treasure-map`, `trouble`, `workshop`, `world-march-companions`, `world-march-runtime`, `world-scout-report`, `world-scout-runtime`, `world-shared-rewards`.
  packages/hero/src/: `services/general-assignments`, `services/general-combat`, `services/general-draws`, `services/general-recovery`, `services/general-skills`, `services/general-turntable`, `services/generals`, `services/hero-score`, `services/legacy-general`, `services/legacy-generals`.

- `services/src/city-domain.ts` (63 type consumers):
  packages/services/src/: `activity-reward`, `alchemist`, `alliance-heart`, `anniversary`, `arena`, `avatar-activation`, `branch-city`, `castle-level-event`, `city-command-domain`, `city-defense`, `civilization-castle`, `comeback`, `construction`, `continued-cost-rewards`, `continued-cost`, `cup-betting`, `daily-investment`, `dragon-progression`, `dragon-talents`, `dragon-tower`, `egg-activity`, `equipment`, `exchange-activity`, `expedition-phase`, `expedition-stage-rewards`, `fragment-exchange`, `gold-eggs`, `groupbuy`, `hot-item`, `lottery`, `lucky-day`, `minstrel`, `monster-exchange`, `new-expedition`, `normal-recharge`, `olympic`, `ordinary-box`, `player-effects`, `player-item-gifts`, `prayer`, `quests`, `recall-task`, `recharge-activity`, `recharge-feedback`, `red-packets`, `regional-recall`, `seasonal-exchange`, `seven-day-cycle`, `shipping-investment`, `special-event`, `target-task`, `totem`, `treasure-map`, `trouble`, `vip-box`, `workshop`, `world-march-runtime`, `world-recreation`, `world-use`.
  packages/hero/src/: `services/general-draws`, `services/generals`, `services/hero-ranking-rewards`, `services/hero-score`.

The shared `CityProgressionPlan<TRules>` declares the existing structural methods;
it does not import Rules or own gameplay implementations. The Context class
implements that port. City-owned tests cover dispatch and ordered callbacks, while
realm units and PostgreSQL scenarios exercise the actual consumers and transaction
behavior. Runtime class comparisons preserve method bodies after explicit dependency
injection and constructor-backed property ordering normalization.

No schema, authority, queue, receipt or outbox change is introduced. City database
repositories, bootstrap projection and remaining mechanic ownership still require
separate W07 work. See [city](city/README.md) for scope and rollback.

## City aggregate persistence (#639)

The horizontal city store is replaced by owned snapshot, validation, write
coordination, aggregate-row and world-target adapters. Realm composition injects
54 readers, 51 writers and world-birth allocation from their existing owners.
No mechanic implementation is copied into city. Each store retains the original
transaction and mutable alliance/quest/cosmetic snapshot context.

All maintained factory callers migrate to the realm composition adapter. The old
repository path is removed; alliance/totem boundary types use a shared generic
contract without a reverse city dependency. Removing the city/totem type cycle
reduces the guardrail baseline from 92 to 90 entries; no exception is added.

Structural comparisons preserve the full read and reconstructed write sequences,
validation, world locks and original collaborator bindings. Dedicated PostgreSQL
coverage verifies an earlier mechanic write, a later ownership failure and complete
rollback; the successful path commits the same aggregate rows. Production settlement,
receipt/outbox transactions, schema and authority remain unchanged.

The handwritten store is split by responsibility instead of expanding the former
1,153-line module. The remaining generic state/plan ports, domain callbacks and
bootstrap projection are still #558 work. See [city](city/README.md#aggregate-persistence-639).

## City bootstrap coordination (#641)

GameService delegates initialization, city-state validation and build-info projection
to the owned city Service/Mapper through a shared structural port. Realm composition
injects the existing power, feature and reconnect collaborators without a reverse
city-to-Services dependency. All app-side construction uses the composed factory;
non-bootstrap player command tests may still instantiate the generic Service.

The serial mechanic initialization, recovery, push order, response precedence,
abort boundaries, clock reads and reconnect callback remain unchanged. Existing
building/user/equipment/research serializers remain with their current owners,
and reconnect planning/persistence still require separate domain work. No cycle
baseline entry is added or removed in this slice.

The missing-state Controller integration moves to the application suite, preserving
its assertions and real Service composition. Owned bootstrap tests add ordering,
abort, state rejection, queue variants and exact-long reconnect coverage. Structural
comparison reconstructs the full original initialization body from the extracted
Service and Mapper and verifies the unchanged GameService workflows.

This does not complete W07 or the city-related process-authority work. See
[city](city/README.md#bootstrap-and-initialization-641) for ports, remaining callers,
compatibility scope and rollback.

## Research ownership (#643)

The new research workspace owns ordinary and civilization workflows, completion
and unlock planning, prerequisites/cost rules, wire Mappers, response validation,
command enums and transactional research adapters. Its 12 source modules and one
test file form a single related domain; existing raw catalogs are not copied.

Realm composition injects target-task/expedition callbacks, the original database
transaction/owner, and reconnect research projection. City retains aggregate
validation and the transaction/production boundary while its ordered research SQL
moves into the owned repository. The ordinary validated-write precondition and
civilization owner check are preserved. Legacy bootstrap/effect aggregate readers
remain shared read-side work; named definitions and bindings remain W14.

Eight horizontal research source paths are removed after all callers migrate.
No compatibility alias or cycle exception is added. The shared command matcher
moves to `base` and is inherited by research and the existing city-domain base.
Legacy city context/domain alias consumers decrease from 58/68 to 56/66.

Existing tests preserve the workflow baseline, and owned tests cover boundary
conditions and native values. A PostgreSQL test verifies rollback of an ordinary
write when a later civilization write rejects a foreign owner. Structural checks
preserve algorithms, schema and reconstructed city query/write ordering. Deployment
and rollback use the same realm schema/data; see [research](research/README.md).

## Troop workflows and aggregate persistence (#645)

The existing troops workspace now owns training, healing and fortification Services,
capacity/selection/prerequisite/cost rules, military Mappers, schemas, response
contracts, command enums and transaction-bound army/hospital/wall adapters. Its 11
source modules and one test file preserve queue identities, native destroy aliases,
cost/refund order, power/capacity reservations, completion scoring and exact deadlines.

Realm composition injects existing task/expedition hooks and military login/reconnect
projections. City retains aggregate validation and the original transaction and
production settlement boundary; ordered bounded reads and serial upserts delegate
to the new repository at their former positions. Six former horizontal source paths
are removed after all maintained callers migrate. The three domain classes no longer
consume the legacy city aliases, reducing their current type consumers to 53/63.

Two functions remain in `rules/military.ts`: `unitPower`, used by Hero general skills,
city power reservations and the owned troop workflows; `cityBuildingParameter`,
used by alliance help and the owned troop-capacity rules. Their implementations stay
singular pending consumer migration under #558 W07/W08/W09/W20. A third shared helper,
the boolean parser also used by dragon-tower purchases, moves from Services/training
to `validations/city-parameters.ts` as `progressionBoolean`, with its behavior intact.

Army bootstrap serialization, shared Rules catalogs, world/march providers and
semantic troop definitions remain W07/W10/W14/W20 work. This slice adds no cycle
exception, authority change or schema migration. See [troops](troops/README.md)
for composition, compatibility, validation and rollback.
