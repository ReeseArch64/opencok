# Player

`@opencok/player` owns character-specific workflows. The first implemented slice
is the seven saved profile preferences migrated in
[#595](https://github.com/ReeseArch64/opencok/issues/595). Provisioning, nickname,
public profile and progression remain later #558 migrations. Push preferences and
login news initialization are also owned here after
[#603](https://github.com/ReeseArch64/opencok/issues/603).

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
