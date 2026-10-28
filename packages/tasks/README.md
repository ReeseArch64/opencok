# Player quests

Tasks owns ordinary/main, story, daily, legacy daily and sign-in quests after
[#653](https://github.com/ReeseArch64/opencok/issues/653), under
[ADR-0016](../../docs/decisions/0016-adopt-domain-owned-package-layout.md).
Target missions are owned after #655 and recall missions after #657. Other
event-specific workflows remain in their current owners for later #558 slices. Background work belongs to jobs.

## Responsibilities and composition

`services/quests` specializes Base's activity lifecycle and composes commands,
reward grants and pending-plan progression. `rules/progression` owns eligibility,
counts, daily selection, periods and level rewards; `rules/changes` owns delta
selection. `mappings/quests` preserves native field order and main string IDs versus
numeric story/daily IDs. The fourteen command names live in `enums/command`.

`apps/server/src/composition/quests.ts` injects the actual shared record readers,
numeric/reconnect algorithms, target-task and campaign callbacks, mail encoding,
reward previews and Equipment factory. Tasks imports no broad Contracts, Rules,
Services, Mappings or Repositories package. Structural ports retain the existing
row-shaped catalog/state boundaries; semantic definitions remain #558 W14 work.
The command dispatcher is approximately 500 lines; its one responsibility is the
existing fourteen-command protocol, with rewards and progression separated.

`repositories/progression` receives the current realm transaction, owner and
system-mail insertion adapter from `composition/quest-persistence.ts`. It owns task
reads, quest snapshot reads and writes, including alliance refresh compare-and-set,
mail ordering, ownership validation before delta filtering, 256-row batches,
daily type keys, resets, sign-in state and alliance box locking. City delegates at
the same points in its aggregate snapshot/write sequence. The repository remains
one cohesive transaction adapter; it does not open a competing transaction.

No process, writer authority, schema, saved key, reward identity or native wire
behavior changes. Daily rollover uses the existing five-minute boundary and
materializes completed unclaimed daily rewards through the same mail writer.

## Compatibility and retirement

Tasks owns the following remaining facades, tracked by #558 W20. Migrate consumers
to constructor ports or owned imports, verify public exports and remove each facade
when no maintained consumer remains. There is one implementation of each algorithm.

- `services/src/quests.ts` binds owned classes to existing realm helpers and exports
  `grantRewards` and `refreshQuests`. Its nine direct consumers are server composition
  `city` and `equipment`; Hero Services `general-draws` and `general-skills`; shared
  Services `hot-item`, `lottery`, `minstrel`, `prayer` and `world-scout-runtime`.
  The adapter still consumes the legacy City context and equipment creation facade.
- `contracts/src/city-progression.ts` imports and re-exports `QuestState`/`QuestWrite`.
  There are no external direct named imports of those aliases; aggregate interfaces
  in that same module still embed both. Retire the aliases with the remaining
  aggregate-contract boundary and public-export audit.
- `contracts/src/reconnect.ts` re-exports `ReconnectTask`/`ReconnectTaskPlan`.
  Direct consumers are `mappings/src/reconnect.ts` and `rules/src/reconnect-tasks.ts`;
  the reconnect aggregate also uses the owned plan internally.
- Rules `reconnect-tasks.ts` and `reconnect-task-counts.ts` re-export their former
  context types for server tests `reconnect-tasks.test.ts` and
  `reconnect-task-counts.test.ts`, respectively. Move these imports with the remaining
  reconnect algorithm ownership review before deleting the aliases.

The previous quest Rules, Mappings and Repository modules are removed after all
callers migrate. The real system-mail contract now belongs to
[Mail](../mail/README.md); its shared Contracts facade remains tracked separately.

## Verification and recovery

Run `bun --no-env-file test packages/tasks/tests`, root package/architecture suites,
Tasks and affected workspace type checks, root lint/format and the realm build.
Existing app quest tests exercise real catalogs and composition. PostgreSQL quest,
anniversary and merge-campaign scenarios cover repeat claims, replay, rollover mail,
rollback and statement timeouts. Owned tests cover delta identity/duplicates,
wire field order/types, boundary selection and bound policy helpers.

The migration comparison checks 27 structures: original runtime bodies, complete
City snapshot/writer flows, moved declarations, command order, period arithmetic and
task SQL. The synthetic `benchmark-quest-writes.ts` keeps zero writes for nine
unchanged initialization stages versus 9,252 simulated unfiltered writes; this is
not a production latency claim. Native-device and production-load acceptance remain
separate. Deploy or roll back the realm artifact against the same persisted quests,
mail, inventory, receipts and outbox; no data conversion is required.

## Target missions (#655)

Target missions add 17 source modules and one test file, bringing Tasks to 36 source
modules and two test files. Access reads the existing pending state; progression
owns target recording and period recovery; rewards own repeated native reward
aggregation and claims. `TargetTaskDomain` owns the five existing commands and uses
the same optional verified payment gateway. `TargetTaskPolicy` owns schedule,
weighted/fixed selection and quantity bounds. The payment identity class retains
the canonical owner/event hash; publication validates and sends the same owned
payload to `push.target.task`.

The native Mapper, response interfaces and Zod schema move together. Domain enums
retain exact command names; the supported native type set remains explicit pending
semantic definition work. Services remain below 350 lines individually. Numeric,
feature, recall, native reward and mail algorithms are actual injected collaborators,
not copied implementations. Realm composition for construction, research, troops
and ordinary quests now receives the owned bound progress callback from
`apps/server/src/composition/target-task.ts`.

`TargetTaskRepository` receives the current transaction and owner through
`composition/target-task-persistence.ts`. Notes and task rows retain their lock
order, 65-row read sentinel/64-row limit, server opening timestamp, owner and period
validation, reset order and missing-row rejection. City delegates at the original
snapshot/write positions. Expired rewards still use the same quest mail plan and
transaction. No payment provider or authority is created; absent gateway remains
closed, and accepted proofs retain owner/event, exchange and time checks.

### Target source ownership

| Former module                                                                                             | Owned destination                                                                          | Composition and verification                                          |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `services/src/target-task.ts`                                                                             | `services/target-{access,rewards,progression,task,publication}` and `rules/target-payment` | Realm target factory/publication; target and recall app/PG suites     |
| `rules/src/target-task.ts`                                                                                | `rules/target-task`, `constants/target-types`, `validations/target-failure`                | Injected numeric policy; target/operator app and owned policy tests   |
| `repositories/src/target-task.ts`                                                                         | `repositories/target-task`                                                                 | Realm persistence factory and City adapter; target/consumer PG suites |
| `contracts/src/target-task.ts`                                                                            | `contracts/target-task` plus bounded target context/runtime ports                          | Shared type facade; affected workspace types                          |
| `contracts/src/responses/target-task.ts`, `validations/src/target-task.ts`, `mappings/src/target-task.ts` | Tasks response contract, validation and Mapper                                             | Owned/app wire tests and realm target command composition             |

### Target compatibility and retirement

Tasks owns these temporary bindings under #558 W20. Migrate their listed consumers,
verify exports and remove the facade when no maintained import needs it:

- `services/src/target-task.ts` exports only the bound `recordTargetTask` callback.
  Remaining callers are shared Services `quests.ts` and `world-march-runtime.ts`.
  Their eventual runtime ports must receive the existing owned callback. The
  adapter still consumes the legacy City context type.
- `rules/src/target-task.ts` exports only bound `targetSchedule`, consumed by
  `rules/src/activity-operators.ts`. Remove it when operator composition injects
  the owned schedule policy or its numeric runtime.
- `contracts/src/target-task.ts` re-exports state/write/payment declarations.
  `contracts/src/city-progression.ts` embeds state and write through import-type
  expressions. No external named payment-gateway alias import remains. Remove this
  facade with the aggregate-contract and public-export audit.

The former target Repository, Mapper, validation and response paths are removed
after all callers migrate. Thirty structural comparisons preserve original bodies,
five declarations, schema, constants, command order and complete City flows. The
existing 10-test/64-assertion unit and eight-test/63-assertion PostgreSQL baselines
cover target/recall/operator behavior, paid/replayed claims and expiry mail. Five
owned tests add 33 assertions for selection, progress gates/clamps, identity bounds,
wire validation and publication. Rollback uses the previous artifact against the
same target notes/tasks, mail, inventory, receipts and outbox; no data conversion,
configuration change or production-performance claim is introduced.

## Recall missions (#657)

Recall missions add 11 source modules and one test file, bringing Tasks to 47 source
modules and three tests. `RecallTaskAccess` reads enabled/pending state;
`RecallTaskProgression` records mission counters; `RecallTaskDomain` owns the three
existing commands, initialization, login counts and claims. Its command implementation
stays below 350 lines. The native Mapper, three response interfaces and two schemas
move together. No rules are copied from shared regional recall or reward algorithms.

`apps/server/src/composition/recall-task.ts` binds the actual country/eligibility,
numeric, event timestamp, reward preview/grant and status callbacks. Target app
composition receives its owned bound `recordRecallTask`. Region-recall campaign
workflows remain separate. Progress preserves the inclusive end instant, bigint
saturation, pending updates and completed-row gates. Initialization preserves castle
stars, country, native quantity expression and login counters 26/27. Claiming keeps
the same reward/status milestone scan order and pending claim suppression.

`RecallTaskRepository` receives the current transaction and owner from realm
persistence composition. It preserves ordered task locks, the 65-row sentinel,
64-row bound, conditional registration-country lookup (type 2 first), notes/row
validation and reset/update ordering. City delegates at the original aggregate
positions. Numeric ports are now shared as `QuestNumericRuntime` and
`QuestPersistenceValueRuntime` in `contracts/runtime`; the former target-only type
names had no external consumers, and both owned target policy/repository use the
shared ports. Ordinary quest and target runtime contract shapes remain identical.

| Former module                                          | Owned destination                                                                    | Composition and verification                                       |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `services/src/recall-task.ts`                          | `services/recall-{access,progression,task}` and `enums/recall-command`               | Realm factory, target callback and recall/prayer integration tests |
| `repositories/src/recall-task.ts`                      | `repositories/recall-task`                                                           | Realm persistence factory and City adapter; PostgreSQL suites      |
| `contracts/src/recall-task.ts`                         | `contracts/recall-task` plus bounded context/runtime ports                           | City aggregate facade and affected type checks                     |
| Shared recall response, validation and mapping modules | `contracts/responses/recall-task`, `validations/recall-task`, `mappings/recall-task` | Owned wire tests and app/PG protocol scenarios                     |

### Recall compatibility and retirement

Tasks owns the remaining aliases under #558 W20. `services/src/recall-task.ts`
exports only a bound `recordRecallTask` for `services/src/target-task.ts`; migrate
that legacy target adapter to an app-injected recall callback before removing the
facade. `contracts/src/recall-task.ts` re-exports state/write types embedded through
import-type expressions in `contracts/src/city-progression.ts`; remove that facade
with the aggregate-contract and public-export audit. The old repository, mapping,
validation and response modules have no maintained consumers and are removed.

Verification includes 25 structural comparisons of original runtime bodies,
complete City flows, five recall declarations, two schemas, command order and
unchanged numeric contracts/target classes. Four new tests add 30 assertions for
inclusive expiry, pending counters, login recovery, milestone ordering and wire
shapes. Existing reference suites retain seven unit tests/39 assertions and 14
PostgreSQL tests/110 assertions across recall, target and prayer. Deploy or roll
back the realm artifact against the same recall notes/tasks, registration, effects,
inventory, receipts and outbox. No schema, configuration, native resource or data
conversion is introduced; native-device and production-load acceptance stay separate.
