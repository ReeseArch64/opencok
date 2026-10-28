# Production

`@opencok/production` owns building resource accumulation, collection, boosts and
settlement around city changes after #633, implementing a W07 slice of #558.

| Entrypoint                   | Responsibility                                                                                                       |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `services/production`        | Collection, item/paid boosts and checkpoint commands through an injected inventory planner                           |
| `services/context`           | Production rate schedules and the existing upkeep/weakness settlement needed before those schedules are applied      |
| `rules/settlement`           | Fixed-point accumulation, remainder conservation, capacity and rate changes                                          |
| `mappings/production`        | Persisted rate codec and exact native boost response                                                                 |
| `repositories/production`    | Bounded locked checkpoints, authorized building writes and transactional rate replacement                            |
| `repositories/city-boundary` | Settle old rates before city changes, calculate new rates afterward and transfer earned production during demolition |
| `contracts`                  | Production state/plans/rates and narrow planner, executor, context and city-boundary ports                           |

The realm composes the domain in `composition/production`. It supplies the existing
inventory planner, fenced mutation executor, inventory transaction adapter and world
effect decoder. Rates, snapshots, expenses, resource grants, campaign harvest actions,
receipts and outbox results remain in their original transactions. Production does
not import horizontal Services or Repositories. All maintained consumers move from
the former production paths; there are no reverse re-export facades.

## Preserved behavior

`build.collect` transfers earned resources once and updates the building refresh time.
`building.addOutPut` retains item-versus-gold selection, boost duration/price lookup,
active-boost rejection and the existing collect-before-paid-boost behavior.
`production.settle` updates checkpoints without collecting. Operation IDs, normalized
request bytes, response replay, correlated native replies and signed 64-bit values
retain their existing handling.

Accumulation uses the same fixed-point scale and remainder. A rate transition settles
the old interval first; expiry boundaries split history without retroactive credit.
Capacity reductions retain already earned production. Schedules and aggregates remain
bounded at 256, owner predicates and checkpoint monotonicity stay enforced, and invalid
writes roll back with the economic mutation.

The context keeps the existing effect timeline, alliance research deadlines, Hero
building contributions, boost expiry, troop upkeep, starvation/weakness settlement and
rate/capacity rounding. Its world decoder is injected; the calculations are unchanged.
The city boundary runs before/after the existing change callback in the same transaction,
including final earned resources for demolished buildings.

## Validation and compatibility

The original four timed-economy unit tests retain 26 assertions after separating the
three production cases from the shared activity lifecycle case. New mapping tests
exercise exact decimal persistence, malformed input rejection, native Long fields and
item/paid response ordering. Fourteen runtime comparisons verify the original rules,
mapper, context, Service and repositories after explicit port substitutions.

The original PostgreSQL timed-economy test retains 45 assertions covering concurrency,
rollback, checkpoint restart, receipt replay, boosts and ownership loss. Production's
city-boundary consumers are exercised by construction, research, military, alliance,
advanced recovery, trouble, Hero assignment, player effect and lucky-day integrations.
Composed SFS startup, package tests, architecture checks, scoped types and realm build
validate application wiring. These checks do not establish physical-client rendering
or production-load performance.

This workspace adds only existing pinned workspace dependencies and Drizzle ORM 0.45.4.
No dependency version, schema, saved checkpoint, rate encoding, economic authority or
process changes. Deploy or roll back the realm artifact against the same data; retain
normal backups. No new configuration, conversion or downtime procedure is required.
Broader building/research/troop ownership, named definitions, scheduler isolation and
player/world authority cutover remain separate #558 work.
