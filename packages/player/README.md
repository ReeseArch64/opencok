# Player

`@opencok/player` owns character-specific workflows. The first implemented slice
is the seven saved profile preferences migrated in
[#595](https://github.com/ReeseArch64/opencok/issues/595). Push preferences and
login news initialization moved here in
[#603](https://github.com/ReeseArch64/opencok/issues/603), followed by realm
character provisioning in [#609](https://github.com/ReeseArch64/opencok/issues/609).
Public profile queries/snapshots moved in #627, celebrity descriptions in #629 and
nickname workflows in #631 below. Remaining progression ownership stays tracked by #558.

| Entrypoint                         | Responsibility                                                      |
| ---------------------------------- | ------------------------------------------------------------------- |
| `contracts/profile-preferences`    | Preference field names and the narrow read/update port              |
| `enums/profile-preference-command` | Exact existing native command names                                 |
| `services/profile-preferences`     | Profile eligibility, value-consumption order and typed replies      |
| `repositories/profile-preferences` | Transactional row locks, owner revalidation and saved-field updates |

`apps/server` constructs `ProfilePreferenceService` with a profile reader and the
repository adapter, then injects its command callback into `GameServices`.
`GameStore` and the general `Database` class no longer own preference mutations.
The old horizontal Service/repository entrypoints are removed after all maintained
callers migrate. There is no production dependency on horizontal Services or
repositories, and no package imports player back through a facade.

The commands are `equip.show`, `medal.show`, `march.soldier.show`, `colorblind.set`,
`equip.scroll`, `banner.set` and `speed.cd.open`. The implementation preserves signed
Int values, Bool scroll metadata, Long banner storage, optional no-op branches,
deferred input consumption after owner locking, repeated timer-flag writes and
unchanged values skipping writes. The app retains correlation and default-success
framing. Unknown commands and missing realm composition reject without reading or
mutating profile state.

Persistence remains the existing read-committed transaction over `userprofile` and
`user_mixed_info`. No schema, saved-row, catalog, price, default or runtime-authority
change is part of this slice. This adapter's current row checks do not establish
ADR-0017 epoch fencing or least-privilege database ownership; those remain W17/W21.
Rollback uses the previous realm artifact against the unchanged saved state.

Run `bun run --cwd packages/player test` and
`bun run --cwd packages/player check-types`. The root package suite includes the
relocated SQL-simulation and wire tests, including rollback, lost acknowledgments,
concurrent fields, invalid selectors and stale/moved/banned players. Disposable
PostgreSQL and composed SFS tests remain in server integration `mutation-foundation`
and `core`. Synthetic v12.06.0 wire coverage does not prove other client tracks or
APK interoperability.

## Push preferences and login initialization

`PushPreferenceService` owns `pushSetting.get`, `parse.push.set` and the conditional
world-news default used by login. `contracts/push-preferences` defines its store
port, `dtos/update-push-preference.dto` describes the validated update, and
`enums/push-preference-command` retains both native names. Persistence lives in
`repositories/push-preferences-snapshot`, `repositories/push-preferences` and
`repositories/world-news-preference`.

Realm composition supplies a profile reader and the three repository adapters,
then injects the Service as `GameServices.playerPreferences`. The generic router
keeps command framing and login feature/switch orchestration. Its former push
methods and the broad Database's preference methods are removed. The login
configuration snapshot contract and shared bootstrap wire mapper/schema remain
single shared implementations while login itself awaits migration; player uses
the same mapper rather than duplicating default/wire logic.

Reads use one repeatable-read, read-only snapshot. Serialization occurs before
default initialization, so the first generated world-news row omits `audio` and a
later persisted row includes it. Initialization retains the existing count and
missing-type conditions and insert-only behavior. Explicit updates retain signed
Int validation, default audio 1, owner row locking, realm/ban revalidation and
insert-or-update semantics. Missing optional storage methods still reject only
when the corresponding operation requires them.

Three existing test files move with the implementation. Cross-component login,
snapshot/switch/cache tests remain in server tests. The real PostgreSQL integration
`apps/server/integration/push-preferences.test.ts` covers two-realm isolation,
concurrent writes, first/saved wire shapes, owner failures, duplicate-insert rollback,
legacy realm epoch replacement and restart persistence. It does not implement the
new player/world authority topology from ADR-0017. Current realm fencing still
wraps the same transactions; defaults, schema and saved rows are unchanged.

## Realm character provisioning

`contracts/character-provisioning`, `rules/character-seed`,
`services/character-provisioning`, `controllers/character-provisioning` and
`repositories/character-provisioning` own realm character initialization after
[#609](https://github.com/ReeseArch64/opencok/issues/609). The starter-rule test
moves with the implementation; focused creation tests cover validation, the
writer-captured clock, replay and rejection of stale/draining owners.

The repository receives `CharacterProvisioningTransactions` from
`apps/server/src/character-provisioning.ts`. That composition binds the existing
world-birth allocator, epoch fence and mutation-record writer to the current realm
authority. Every callback receives the same active database transaction; no callback
starts a separate transaction or process. Player implementation imports neither
horizontal repositories nor applications. The SQL, locks, receipt hash, grant
postings, outbox payload and ordering remain unchanged.

Creation still atomically initializes the profile, inventory balances, starter
city/queues/quests/general, shield and world footprint. It rejects existing
characters/cities and receipt conflicts; replays verify authority before returning
the stored receipt. Captured transaction time controls starter timestamps while
the original reservation controls the request hash. Starter catalogs, IDs, values
and wire types are unchanged. Shared reservation/receipt contracts, schemas and
canonical hashing stay bounded and common to global account and realm workflows.

All maintained callers migrate, including synthetic-player tooling and world
integration fixtures. Former horizontal character seed, repository, Service,
Controller and provisioning aggregate paths are removed without reverse facades.
Global account reservation and activation remain in `account`.

The existing PostgreSQL provisioning integration verifies creation, retries,
restart and owner replacement; world process/scout integrations exercise the
migrated creation path before their gameplay flows. New callback-boundary tests
also ensure a failed fence cannot proceed to locks/reads and a replay never plans
or grants another starter package. These are structural ownership changes, not
ADR-0017 process separation: world footprint writes still share the current realm
transaction. Player/world reservation protocols and least-privilege processes
remain W17/W18/W21 work. No schema, configuration or data migration is required;
rollback uses the previous realm artifact with unchanged persisted state.

## Public profile queries (#627)

`services/public-profile` owns get.user.info: observer eligibility, target validation,
route identity, projection order and routed update markers. Contracts, base response
schemas, mappings and progression/social presentation rules belong to player.
`repositories/public-profile` owns directory routing, table readiness and the bounded
repeatable-read, read-only snapshot. Its alliance reader port receives the same
transaction; there is no independent alliance read or new writer.

The realm composes the Service in `composition/public-profile`, supplying the existing
observer checker, Hero/alliance projections, alliance snapshot reader and cache
markers. GameService only delegates the command; GameStore and Database no longer
expose the public profile query. Realm startup performs the owned readiness check
immediately after the remaining Database checks, before cache/coordination startup.
Hero and alliance projections accept narrow structural snapshots instead of importing
the player-owned aggregate, avoiding reverse dependency cycles.

The shared equipment preview also serves equipment and activity-reward responses.
It remains in explicit equipment-preview mapping/schema/response modules rather than
creating a dependency on player. Alliance-specific projections, shared public numeric
validation, statistics serialization and generic catalog access retain their existing
owners pending the relevant #558 slices. There are no reverse re-export facades.

Preserved behavior includes observer checks before target reads, one server clock,
global-directory routing with local fallback only for absent entries, conflicting
route rejection, exact signed values, field order/types, privacy allowlists and the
same-alliance research suppression. Snapshot reads retain collection limits, explicit
columns, owner predicates, deterministic ordering and read-only transaction settings.
Update markers use the routed realm and replace any provider value only after all
projections complete. Missing markers remain an empty string; provider failures
produce no partial response.

The original 41 composed profile tests pass with the same 529 assertions. Four
mapping/progression/repository/routing test files move into player; two additional
Service tests verify port identity, order, response precedence and failure propagation.
A disposable two-realm PostgreSQL test verifies real routing, privacy, no profile
writes, no fallback from unavailable realms and restart persistence. Composed SFS
core integration verifies application startup and existing realm behavior. These
checks do not prove physical-client rendering or other native-client tracks.

Zod is now a direct dependency using the existing workspace catalog version for the
moved schemas; no dependency version changes. There is no configuration, schema,
saved-data or process-authority change. Rollback uses the previous realm artifact
against the same data.

## Celebrity descriptions (#629)

`CelebrityDescriptionService` owns `celebrity.desc.get` and `celebrity.desc.save`
through narrow store and filter ports. The realm factory injects profile reads,
owned PostgreSQL adapters and the already loaded content filter. GameService only
routes both commands; GameStore and Database no longer expose description methods.
The generic Database startup table inventory still checks celebrity readiness.

Reads preserve the requested realm, authenticated local observer checks, celebrity
eligibility, canonical UID matching and ambiguity rejection. Decoding retains strict
UTF-8, Java trimming/blank semantics and the 65535-byte bound. Saves preserve the
owner-only target, gmFlag 11 gate before input/filter checks, locked profile
revalidation, canonical existing-row selection, filtering order and Java byte
encoding. Existing rows update explicitly; absent rows insert under the owner lock.
Exceptions roll back and do not automatically retry.

Both original command/repository test suites move into player and retain all sixteen
scenarios and 321 assertions. They still compose the generic command router, so
correlation fields and empty push lists remain covered. A disposable two-realm
PostgreSQL test exercises the actual app factory, cross-realm reads, owned writes,
filter failure rollback, stale eligibility revalidation, unrelated-row preservation
and persistence through restart. Existing SFS core integration covers app startup.

The test suites declare policy as a direct workspace development dependency; no
version or production dependency changes. Shared Unicode, Java encoding and trim
primitives retain their current paths pending the corresponding #558 migrations.
No schema, description-byte conversion, authority or process change is introduced.
Deploy or roll back the realm artifact against the same stored descriptions.
Physical-client rendering and production load remain untested.

## Nickname checks, changes and recovery (#631)

`NicknameService` owns `user.check.nickName` and `user.modify.nickName`. It receives
profile/occupation reads, observer validation, loaded word/reserved-name filters,
the durable change callback and a clock through narrow ports. Checks retain the
clock after the profile read; paid changes capture it before the read. Generic
GameService delegates both commands; GameStore/Database no longer expose occupation.

Player owns check/change rules, response schemas/mappings, records and notification
contracts, global name locks/occupation, global nickname writes, realm payment records
and their recovery/delivery operations. Canonical global account resolution belongs
to account and is shared with chat through app-injected identity lookup. Ranking
backfill receives the owned payment decoder through a narrow witness port; it does
not import player. The alliance task rule/delivery uses its own small shared contract
instead of the complete nickname store. Shared length/character/encoding primitives
retain their current paths because Dragon and other domains still use them.

`composition/nickname-persistence` injects the existing cost-fact writer, system-mail
writer and shared-user reader into the original transactions. `composition/nickname`
binds the query/command Service. The existing app recovery/notification workflow,
authority readiness check, CN1 preparation, timeouts and delivery order stay in place.

Preserved behavior includes validation/filter order, Java/Unicode comparison, global
name locks, item/gold debits and ratio-based refunds, operation receipts, ambiguous
alias rejection, pending-effect bits, per-effect retries and notification stages.
No transaction is split, no writer moves between processes and no stored operation
format changes. Existing pending operations remain recoverable and no second debit
is introduced by replay. The account lookup keeps its original errors and row locks.

The original fourteen test suites retain 107 cases and 30946 assertions. Seven
focused suites and their two byte-identical vector fixtures move into player.
Twenty-one runtime comparisons cover moved implementations and explicit adapter
substitutions. PostgreSQL integrations exercise nickname recovery/refunds, chat and
Redis delivery, alliance/shared-user effects, continued-cost witnesses/finality and
replaced owners; chat persistence and composed realm startup are also checked.
The architecture baseline drops from 94 to 92 by retiring two resolved violations;
no new exception is added. Player has 43 source modules and 20 test files.

Player declares account, core and policy as production workspace dependencies;
policy moves from its previous development-only declaration. Chat declares account
for its injected identity lookup. No dependency version changes. Deploy or roll back
realm/chat artifacts together against the same schema and operation records. No new
configuration, data conversion or downtime procedure is needed. Physical native
clients and production-load measurements remain outside this slice.
