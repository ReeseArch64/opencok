# Economy

`economy` owns wallet/resource balance mutations, activity economic coordination
and inventory commands, grants, ledger, rules and responses under #611, #613,
#615, #619, #621 and #623, part of #558 W06. Item persistence, production and
reservation protocols remain subsequent work. These extractions do not create a network service or a second mutation authority.

## Boundaries

- `constants/assets` retains the six profile and eight resource asset names.
- `contracts/balances` defines `EconomyAsset` and `EconomyPlan` without persistence imports.
- `repositories/balance-transaction` defines the injected transactional callback.
- `repositories/balances` locks the owner rows, creates the immutable bigint
  snapshot, validates the plan and writes owned balance changes.

The realm app supplies its existing `createMutationExecutor` with the same
database, authority and clock. Economy does not import horizontal repositories.
The supplied executor retains fencing, idempotent receipts, rollback, ledger and
outbox persistence. `ledger` remains the shared posting-validation primitive;
shared mutation messages now live in `ledger/contracts/mutation` after #613. The old horizontal
`repositories/economy-mutation` path is removed after all maintained callers migrate.

## Preserved behavior

Supported assets are profile gold, paidGold, paidSpecialGold, dmmGold,
dmmPaidGold and dmmPaidSpecialGold; resource wood, stone, iron, food, woodbind,
stonebind, ironbind and foodbind. Missing values default to zero exactly as before.
The adapter locks profile then resource, rejects missing rows, and passes a frozen
snapshot to the planner. It permits at most 256 change entries and rejects unknown
or repeated assets, non-bigint deltas, invalid posting identities, negative balances
and signed-64 overflow before either row is updated. Empty changes skip writes.

The command identity and request bytes are captured before awaiting the executor.
Response bytes and events pass through unchanged. Grant amounts, native IDs,
currencies, starter defaults, SQL and saved schemas are not changed. The entire
returned executor body is byte-identical to its predecessor; only ownership,
contracts/constants and construction change.

## Verification and recovery

Run `bun run --cwd packages/economy test` and `check-types`. Domain tests cover all
fourteen assets, bigint precision, frozen snapshots, null defaults, invalid plans,
partial-plan rejection, missing rows and request-byte capture. Root package tests
include this suite.

`apps/server/integration/mutation-foundation.test.ts` remains a cross-component
integration: disposable PostgreSQL 17.11 verifies concurrent idempotent replay,
ledger/outbox/receipt rollback, competing purchases, two-realm isolation, stale
writers, epoch replacement, lost commit acknowledgment and restart persistence.
It also covers shared mutation machinery and player preferences, so it stays with
the composed server tests. Runtime/domain dependency guards apply to this workspace.

No schema migration, data rewrite, configuration change or client repackaging is
needed. Rollback uses the prior realm artifact against the same saved state.
This preserves the current realm authority; it does not implement the future
player/world process split or prove physical-client/other-track compatibility.

## Activity economic coordination (#613)

`services/activity-economy` owns the existing `debit` and `activityEconomy`
operations. `contracts/activity-ledger` defines the structural planner port;
InventoryPlanner supplies it without an economy-to-Services dependency. Its
resource/asset balance readers use the same legacy row conversion as before.
Gold-pool order remains delegated to the planner, including ordinary and DMM
pools. Resource limits, item delegation, campaign grant cursors, events and native
push fields retain their existing behavior.

`contracts/inventory` owns InventoryItem/InventoryFields, and
`contracts/activity-economy` owns the economic activity port. The shared mutation,
posting and outbox message types belong to `ledger/contracts/mutation`. All
maintained type consumers migrate; the old exports are removed, with no reverse
facades. Economy and ledger no longer depend on the broad contracts package.
This avoids the pre-existing contracts/Hero/Services cycle rather than extending
it into economy. The shared timed-activity contracts and cross-domain power snapshot still await
their domain migrations; inventory command contracts and planning move in #623.

Seven tests pass with identical 57 assertions against the original and extracted
adapter. The function bodies are unchanged apart from the structural ledger type
and delegation of the two saved-balance reads. PostgreSQL inventory, campaign
producer and timed-economy suites verify grant/receipt rollback, campaign effects,
production, recovery and ownership loss. The source graph removes four cyclic
module edges and two cyclic workspace edges (baseline 100 to 94); other baseline
debt remains explicit. There is no schema, default or authority change.

## Inventory rules (#615)

`rules/inventory` owns count and integer validation, catalog lookup, bundle/batch
pricing, recipe selection and weighted draws. `contracts/inventory-catalogs`
requires only a read-only goods map of string-valued rows. The existing loaded
Rules object supplies this port structurally; economy does not import the horizontal
rules package or redefine the maintained catalog data.

All callers in shop, Services, mail reward rules and the resource catalog test use
the owned path. The old horizontal module is removed. Existing three rule tests
move from the server unchanged apart from the import and retain 33 assertions.
An additional catalog test verifies exact string identities (including `001`
versus `1`), row identity, missing/malformed IDs and the original error. Rule
function bodies and native IDs are unchanged. No SQL, transaction, authority,
client package or saved-state change is involved; rollback uses the previous artifact.

## Inventory response boundary (#619)

`mappings/inventory` owns purchase/use/composition responses, changed-item lists,
posting events, durable response encoding/replay and chained push merging.
`mappings/inventory-item` owns the login and grant item projection;
`validations/inventory` and `contracts/responses/inventory` own its schema and
plain response contracts. All callers use the owned paths; old horizontal module
paths and bootstrap item exports are retired.

The item mapper accepts saved row fields at the compatibility boundary and the
narrow goods catalog port. Its String/Number/BigInt conversions inline the exact
previous row-helper operations and defaults. Catalog lookup trims itemId as before,
while the output retains the saved string. Only truthy para1 through para9 are
emitted, in their original order. Generic wire/schema validation comes from
messages; economy does not depend on horizontal mappings, rules or validations.

Four tests pass with the same 32 assertions before and after extraction. They cover
native field order, leading-zero IDs, bigint precision, null/string saved values,
invalid rows, purchase/use/composition shapes, receipt operation IDs, event balances,
primary-body preservation and ordered chained pushes. Schema and response types
retain their shapes. Existing planner/transaction ownership, saved data and process
authority remain unchanged; rollback uses the prior artifact.

## Inventory ledger (#621)

`domain/inventory-ledger` owns item/balance staging, posting records, item lookup,
expiration, grants, consumption, currency pool selection and saved/staged balance
reads. `contracts/inventory-ledger` owns its narrow profile/resource/assets/item
snapshot. The class implements the existing ActivityLedger port; it does not import
horizontal Services, contracts, rules, mappings or repositories.

InventoryPlanner extends this implementation with command, item-effect and
continued-cost coordination. Generic snapshot and catalog parameters preserve its
precise types without coupling economy to cross-domain contracts. The ledger
extraction preserved constructors and transaction call sites; #623 moves the
remaining command behavior behind an injected runtime port.

The six ledger tests pass with 86 identical assertions against the original planner,
the extracted ledger and the inheriting planner. Clock validation and input-item
copying stay in the constructor. Eleven ledger methods retain their emitted bodies
after exact row-helper inlining; the remaining four planner methods and Service
methods are unchanged. Tests preserve the existing partial in-memory plan on failure;
PostgreSQL integration verifies that failed transactions commit none of that plan.

Inventory, campaign producer and timed-economy integrations exercise retries,
receipt/grant rollback, recovery and authority loss through the real subclass and
transaction executor. No schema, saved-data rewrite or writer-authority change is
introduced. Rollback uses the previous realm artifact against the same state.

The ledger is 177 lines with one cohesive item/balance responsibility. The residual
616-line Services inventory module was the next migration target; #623 below
extracts its command behavior. Inventory persistence remains under #558.

## Inventory command ownership (#623)

`services/inventory` owns command validation, request capture, receipt identity
and grants. `services/inventory-planner` owns purchase/use/composition planning;
`services/inventory-grants` owns grant/cost planning. The command state, plan and
executor contracts now belong to economy. The planning catalog adds kingdom ID,
materials and item definitions to the existing goods port.

`contracts/inventory-runtime` injects feature checks, resource bonuses and
confirmed-spending observation. The current `services/inventory-runtime` module
outside economy composes existing power, feature and continued-cost functions with
the owned classes. Its power callback preserves snapshot, world and emperor read
order and the saved decompose-suite field conversion. All maintained consumers use
explicit factories; the old `services/inventory` path is removed. AllianceContext
receives its effects directly instead of reaching through the planner.

Resource response mapping, schema and contract move with the command boundary.
All eighteen native fields retain their order, signed bound balances, bigint
precision, zero defaults and legacy clamping. Shared InventoryState now extends
the owned command state only to add the cross-domain power snapshot callback.
The existing horizontal repository still executes fenced transactions and persists
plans, receipts, postings and outbox together. This is not complete persistence or
process-authority migration, and the composition adapter remains tracked under #558.

Seven baseline command/resource tests retain 53 assertions before and after the
move. Three additional domain tests verify feature short-circuiting, exact runtime
inputs, float32 resource rounding, bigint credit precision, callback order and
failure-before-consumption. Two composed server tests verify real power evaluation,
read order and failure propagation. Existing PostgreSQL scenarios exercise the
factories through inventory, campaign, timed economy, continued cost, item effects,
equipment, alliances and shops. No dependency, schema, saved-state format or writer
authority changes; rollback uses the prior realm artifact with the same data.
