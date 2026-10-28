import type { InventoryState } from "@opencok/contracts/inventory";
import type {
    InventoryExecutor,
    InventoryPlan,
} from "@opencok/economy/contracts/inventory-planning";
import type {
    InventoryPreparation,
    InventoryTransactionRuntime,
} from "@opencok/economy/repositories/inventory-transaction";
import {
    createInventoryExecutor,
    executeInventoryTransaction,
} from "@opencok/economy/repositories/inventory";
import type { MutationResult } from "@opencok/ledger/contracts/mutation";
import { createMutationExecutor, type MutationTransaction } from "./mutation.ts";
import type { RealmAuthority } from "./realm-authority.ts";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import { readPlayerEffects } from "./power.ts";
import { mergeInventoryConfirmation } from "./inventory-confirmation";

const runtime: InventoryTransactionRuntime<InventoryState> = {
    extendState: (tx, profile, state) => ({
        ...state,
        effects: () => readPlayerEffects(tx, profile, true),
    }),
    mergeConfirmation: mergeInventoryConfirmation,
};

export function createRealmInventoryExecutor(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
    now = Date.now,
    preparation?: InventoryPreparation,
): InventoryExecutor<InventoryState>
{
    return createInventoryExecutor(
        createMutationExecutor(db, authority, now),
        runtime,
        now,
        preparation,
    );
}

export function executeRealmInventoryTransaction(
    tx: MutationTransaction,
    owner: string,
    plan: Parameters<InventoryExecutor<InventoryState>>[1],
    reason: string,
    useEffect?: InventoryState["useEffect"],
    recordAction?: InventoryState["recordAction"],
    confirmed?: (plan: InventoryPlan) => Promise<MutationResult | undefined>,
)
{
    return executeInventoryTransaction(
        tx,
        runtime,
        owner,
        plan,
        reason,
        useEffect,
        recordAction,
        confirmed,
    );
}
