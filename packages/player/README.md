# Player

`@opencok/player` owns character-specific workflows. The first implemented slice
is the seven saved profile preferences migrated in
[#595](https://github.com/ReeseArch64/opencok/issues/595). Provisioning, nickname,
public profile, push settings and progression remain later #558 migrations.

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
