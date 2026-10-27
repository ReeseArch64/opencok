# Advanced progression, local events and world acceptance

[Issue 385](https://github.com/ReeseArch64/opencok/issues/385) covers topics 25–27.
The integrated implementation and its detailed migration history remain in the
[domain inventory](advanced-progression-events-world.md). This matrix records the
completion boundary for each requested criterion. It does not substitute a passing
command for an economic transition, combat result or native-device observation.

## Criteria and evidence

| Issue criterion                                                                    | Maintained behavior                                                                                                               | Executable evidence                                                                                                             |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Dragon lifecycle, feeding, levels, skills, travel, dedicated resources and effects | Owned dragon rows, server-generated outcomes, pinned travel rewards, skill ownership and production effect boundaries             | `dragon-progression.test.ts`, `world-march-companions.test.ts`, `advanced-progression-recovery.test.ts`                         |
| Civilization research, costs, prerequisites, queues, effects and reconnect         | Type-19 queues, paid-cost snapshots, completion/cancel/acceleration, persisted science levels and old-effect settlement           | `civilization-science.test.ts`, `advanced-progression-recovery.test.ts`                                                         |
| Civilization castle and totem ownership/interactions                               | Owned native footprints, placement/move/settlement, expiry/status delivery, recycling and preserved actor claims                  | `civilization-castle.test.ts`, `totem.test.ts`, `advanced-world-placement.test.ts`                                              |
| Local schedules, enrollment, authoritative scores and period isolation             | Saved hero/expedition calendars, confirmed score producers, minigame enrollment and period-scoped awards                          | `hero-calendar.test.ts`, `hero-score.test.ts`, `expedition-calendar.test.ts`, `minstrel.test.ts`, `campaign-producers.test.ts`  |
| Lottery/minigame outcomes and atomic rewards, retries and restart                  | Server draws, saved grids/chests/positions, period counters, one-time owned rewards and recovery                                  | `lottery.test.ts`, `gold-eggs.test.ts`, `egg-activity.test.ts`, `advanced-progression-recovery.test.ts`                         |
| Campaign/arena validated combat integration or explicit unavailability             | Owned admission/preferences and authorized result adapters; an absent validated engine cannot create a win, losses or rewards     | `arena.test.ts`, `dragon-tower.test.ts`, `dragon-battle-ranking.test.ts` and the native unavailable responses in `core.test.ts` |
| Troop reservation, movement, gathering, return, acceleration and teleport          | Fenced owned parties, troop conservation, pinned cargo, source geometry, real costs and versioned transitions                     | `world-march-runtime.test.ts`, `world-march-companions.test.ts`, `world-shared-resource.test.ts`                                |
| Durable transitions, world interests and reconnect                                 | Atomic receipts/ledger/outbox, deadline recovery, private scout reports, current-viewer delivery and fresh process/pool ownership | `world-process.test.ts`, `world-scout-wire.test.ts`, `advanced-progression-recovery.test.ts`                                    |
| Synthetic unit/PostgreSQL concurrency and recovery, lint/format/types              | Disposable databases and synthetic state; no running player realm is used                                                         | Commands below and the detailed domain suites linked in the inventory                                                           |
| Operator documentation and independent native acceptance                           | Additive migration/recovery guidance and a separate device task with exact compatibility evidence requirements                    | This record, the domain inventory, resident-world runbooks and [issue 521](https://github.com/ReeseArch64/opencok/issues/521)   |

Test filenames in the table refer to `apps/server/integration/`. Pure domain and
wire arithmetic tests also live under `apps/server/test/`. The world inventory
separately enumerates [all 50 source handler identities](world-handler-coverage.md),
including their actual specialized target/admission-engine prerequisites. A point
type, disabled control or historical calendar never supplies a missing actor or
validated battle engine. Those unavailable variants retain their documented gates.

## Placement ownership correction

Civilization castle and totem placement previously checked terrain, point type
and resource amount without rejecting every saved claim on a type-zero cell.
Synthetic native-width tests reproduced both an owned-cell overwrite and a
pending-march overwrite before the correction.

Placement now rejects saved owners, march owners and alliance territory. Under
the existing realm fence, resident-world advisory lock and point row locks, the
repository also resolves pending resident march footprints, active world bosses
and barbarian actor records. The service checks every requested cell before
charging or writing its new actor. This extra claim query is limited to the two
placement command families; ordinary march/query consumers retain their existing
state reads.

The regression covers all four cells of a 1201-wide native footprint. Each
rejection preserves complete profile, resource, inventory, world, castle, totem,
actor, receipt, ledger, outbox and mail snapshots. Removing the synthetic blocking
evidence permits the normal paid placement. The production code does not remove
claims or repair orphaned actors to force a placement. Operators must reconcile
inconsistent saved actors from their factual history.

## Replacement-owner recovery

The combined recovery fixture leaves a paid civilization queue, an actual saved
lottery chest and a pinned dragon travel entitlement in one synthetic account.
A new PostgreSQL pool, replacement realm epoch and newly composed production,
progression and activity adapters reconstruct them without relying on the old
service instances. Research completes once; lottery choices remain pinned; dragon
rewards deliver the exact saved goods and dedicated dragon-food/gold quantities.
The fixture's imported entitlement is explicit test setup, not a public grant or
client-submitted outcome.

An injected outbox failure restores the entire unclaimed dragon entitlement and
all economic state. Concurrent retries then grant it once. Old owners cannot
write or replay a committed operation. Separate receipt-failure cases restore
feeding payments, research costs/queues and lottery costs/draw state together.
These checks establish fresh-adapter and epoch recovery. The existing killed
process world test establishes independent process recovery and interested-viewer
delivery; the two forms of evidence are not conflated.

The actual native TCP scout scenario uses width 1201, matching the resident map
layout. It verifies provisioning, login, quotation, inspection, paid noncombat
scouting, private mail and troop return with the configured native point identity.
It remains a synthetic protocol test, not native APK execution.

## Reproduction

Run from the repository root with Docker available. Dependencies use the frozen
workspace lockfile. All PostgreSQL/Redis/ZooKeeper fixtures are disposable.

```sh
bun run --cwd apps/server test
bun run test:packages
bun --no-env-file test \
  apps/server/integration/advanced-world-placement.test.ts \
  apps/server/integration/advanced-progression-recovery.test.ts \
  apps/server/integration/dragon-progression.test.ts \
  apps/server/integration/civilization-science.test.ts \
  apps/server/integration/civilization-castle.test.ts \
  apps/server/integration/totem.test.ts \
  apps/server/integration/lottery.test.ts \
  apps/server/integration/arena.test.ts \
  apps/server/integration/dragon-tower.test.ts
bun --no-env-file test \
  apps/server/integration/hero-calendar.test.ts \
  apps/server/integration/hero-score.test.ts \
  apps/server/integration/expedition-calendar.test.ts \
  apps/server/integration/minstrel.test.ts \
  apps/server/integration/gold-eggs.test.ts \
  apps/server/integration/egg-activity.test.ts \
  apps/server/integration/campaign-producers.test.ts
bun --no-env-file test \
  apps/server/integration/world-march-runtime.test.ts \
  apps/server/integration/world-march-companions.test.ts \
  apps/server/integration/world-shared-resource.test.ts \
  apps/server/integration/world-scout-wire.test.ts \
  apps/server/integration/world-process.test.ts
bun run lint
bun run format:check
bun run --cwd apps/server check-types
bun run --cwd packages/contracts check-types
bun run --cwd packages/repositories check-types
bun run --cwd packages/services check-types
```

Earlier acceptance checkpoints remain in the domain inventory. Counts from
overlapping checkpoints must not be added to claim a new suite total.

### Completion checkpoint, 2026-10-27

The isolated worktree started from `origin/develop` at `de722934`. The placement
correction is `58819cc5`; the dependent acceptance layer adds fresh-adapter
recovery, native-width scout traffic and native-width totem expiry. No running
realm, original mobile input or private reference was modified.

| Check                                         | Passed | Assertions | Evidence boundary                                                                                                     |
| --------------------------------------------- | ------ | ---------- | --------------------------------------------------------------------------------------------------------------------- |
| Complete server units                         | 1,620  | 277,799    | 302 files, one snapshot, zero failures                                                                                |
| Package and catalogue contracts               | 70     | 534,341    | Boundaries, mappings and maintained catalogue isolation                                                               |
| Progression and recovery integration          | 26     | 294        | Nine files covering dragons, science, castles, totems, lottery, arena and tower                                       |
| Events and authoritative score integration    | 29     | 271        | Seven files covering calendars, scores, minigames, eggs and campaign producers                                        |
| World and native/process recovery integration | 19     | 236        | Five files covering marches, companions, shared gathering, actual 1201-width TCP scouting and killed-process recovery |
| Expanded native totem subset                  | 2      | 64         | Placement protection plus exact four-cell cleanup at expiry; overlaps the progression group                           |

Lint, formatting, diff checks and server/contracts/repositories/services type
checks passed. Device evidence remains the separate open task below.

## Operator rollout and remaining device work

This completion introduces no migration, runtime dependency or environment
setting. Apply the maintained global/kingdom migration histories with the
existing migrator; do not reuse draft migration numbers or skip module tables.
The world, totem, arena and expedition foundation migrations are `0018`–`0021`;
later calendar, score, reward and supply migrations remain part of that same
published history. Back up state and its receipts, ledger, outbox and checkpoints
together before an authorized rollout. No deployment or active-realm data change
is part of this implementation.

Keep native map width aligned with saved terrain, and preserve the known birth
phase or use the explicit [operator adoption](resident-world-birth.md) procedure.
Historical event dates, closed switches and future opening clocks are factual
gates, not permission to rewrite dates or invent scores. Rollback must retain
actors, entitlements, queues, reservations, receipts and pending deliveries. The
older placement binary lacks the new protection; disable placement before
rolling back rather than deleting the records that reveal a claim.

[Issue 521](https://github.com/ReeseArch64/opencok/issues/521) remains open for real
12.06.0 APK/device acceptance. It requires authorized build/patch fingerprints,
device/server identities, visible interactions and sanitized reconnect/restart
evidence for these families. Other client releases remain unverified. Original
mobile inputs and keys stay read-only; prepared artifacts and device observations
belong to that separate task. Tracking it satisfies the issue's independent
acceptance requirement without claiming that device execution already passed.
