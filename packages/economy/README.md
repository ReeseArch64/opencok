# Economy

`economy` owns wallet/resource balance mutations under
[#611](https://github.com/ReeseArch64/opencok/issues/611), part of #558 W06.
This first implementation extracts the existing balance adapter; inventory
planning, item operations, production and reservation protocols remain subsequent
work. It does not create a network service or a second mutation authority.

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
it into economy. The shared inventory/timed-activity state/planning contracts and
remaining InventoryPlanner implementation still await their domain migrations.

Seven tests pass with identical 57 assertions against the original and extracted
adapter. The function bodies are unchanged apart from the structural ledger type
and delegation of the two saved-balance reads. PostgreSQL inventory, campaign
producer and timed-economy suites verify grant/receipt rollback, campaign effects,
production, recovery and ownership loss. The source graph removes four cyclic
module edges and two cyclic workspace edges (baseline 100 to 94); other baseline
debt remains explicit. There is no schema, default or authority change.
