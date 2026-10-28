# Troops

This package owns training, healing and fortification workflows extracted in
[#645](https://github.com/ReeseArch64/opencok/issues/645), under #558 W07 and
ADR-0016. It contains 11 source modules and one owned test file. Its largest
behavioral implementation is below 350 lines.

## Ownership and composition

| Responsibility                                                         | Source                                                       |
| ---------------------------------------------------------------------- | ------------------------------------------------------------ |
| Training, dismissal and completion                                     | `services/training.ts`                                       |
| Healing, wounded dismissal and completion                              | `services/hospital.ts`                                       |
| Fortification building, destruction and completion                     | `services/fortifications.ts`                                 |
| Capacity, troop selection, prerequisites, costs and reservation bounds | `rules/capacity.ts`, `rules/military.ts`                     |
| Native military snapshots                                              | `mappings/military.ts`                                       |
| Response shapes and schemas                                            | `contracts/responses/military.ts`, `validations/military.ts` |
| Command strings, structural city plans and completion hooks            | `enums/command.ts`, `contracts/context.ts`                   |
| Ordered bounded reads and aggregate writes                             | `repositories/progression.ts`                                |

The realm constructs these domains in `apps/server/src/composition/troops.ts`.
Constructors receive the existing target-task and expedition callbacks. Hero scoring
remains on the city plan. The shared `CommandDomain` supplies exact command matching;
prepare/apply functions retain their bound callback contract.

The app injects `TroopsRepository` with the existing realm transaction and owner.
City calls its army, hospital and wall reads/writes in the original order and retains
aggregate owner, duplicate, quantity and deadline validation. The adapter's
`write*Validated` methods require that validated plan; they are not independent
command entrypoints. Each read retains its owner predicate, identity ordering and
1025-row bound. No method opens another transaction or acquires a global connection.

`MilitaryMapper` supplies login and reconnect projections through the shared
`MilitaryProjection` structural contract. Realm composition binds the original Rules
instance. Generic GameService callers exercising these paths must supply the port
or use `createRealmGameService`; unrelated command tests can retain the generic
Service. No horizontal Service imports this package and no cycle exception is added.

## Preserved behavior

Training uses queue types 1, 8, 9, 10 and 17; healing uses 3; fortifications use 2.
Both `fort.destory` and `fort.destroy` remain accepted. Quantity conservation,
training/healing capacity reservations, power limits, prerequisites, discount and
payment order, special-item costs, cancel/refund, restoration/rescheduling,
completion timestamps, scoring and production settlement retain their algorithms.
Saved activity payloads, deadlines, SQL upsert targets and native integer/float/long
tags and field ordering remain unchanged.

## Transitional dependencies

`rules/military.ts` retains only `unitPower` and `cityBuildingParameter`. The former
still serves Hero general skills and city power reservations; the latter serves
alliance help. Troops calls those singular implementations until their consumers
can move without reverse workspace cycles. #558 W07/W08/W09/W20 tracks retirement.
The former shared `militaryBoolean` parser also served dragon-tower purchases; it is
now named `progressionBoolean` in `validations/city-parameters.ts`. Training,
fortifications and the tower use the same exact parser and error contract.

Shared Rules catalogs, army bootstrap serialization in `mappings/bootstrap.ts`,
world/march read/write providers and city aggregate validation remain transitional
dependencies. Named troop definitions and native bindings remain W14 work. This
slice neither completes W07 nor implements a separate player/world authority.

## Verification and recovery

Owned tests exercise definition/queue checks, batch and future-capacity bounds,
quantity conservation, strict boolean inputs, exact deadlines, float tags, snapshot
bounds and command aliases. Existing app tests retain their assertions. PostgreSQL
coverage exercises retry, cancellation, completion, power reservation, overdue food
settlement, Hero/task/expedition scoring and reconnect. An adapter scenario verifies
all three tables roll back together and remain scoped to the bound owner.

Run `bun run --cwd packages/troops test` and `check-types`; root package tests include
the owned suite. Deploy the rebuilt realm against the existing schema/configuration.
No migration, new process or native-client artifact is required. Rollback deploys
the previous realm artifact against the same saved state. Native-device acceptance,
production load and process-authority handoff remain separate #558 work.
