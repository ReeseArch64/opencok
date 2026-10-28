# Player

`@opencok/player` owns character-specific workflows. The first implemented slice
is the seven saved profile preferences migrated in
[#595](https://github.com/ReeseArch64/opencok/issues/595). Push preferences and
login news initialization moved here in
[#603](https://github.com/ReeseArch64/opencok/issues/603), followed by realm
character provisioning in [#609](https://github.com/ReeseArch64/opencok/issues/609).
Nickname, public profile and progression remain later #558 migrations.

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
