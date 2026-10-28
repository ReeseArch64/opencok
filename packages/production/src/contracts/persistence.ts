import type { Row } from "@opencok/contracts/rows";
import type { InventoryState } from "@opencok/contracts/inventory";
import type { InventoryExecutor } from "@opencok/economy/contracts/inventory-planning";
import type {
    InventoryTransaction,
    InventoryTransactionExecutor,
} from "@opencok/economy/repositories/inventory-transaction";
import type { MutationResult } from "@opencok/ledger/contracts/mutation";
import type { ActivityEconomy } from "@opencok/economy/contracts/activity-economy";
import type { ProductionRate } from "./production.ts";

export type MutationTransaction = InventoryTransaction;

export interface ProductionPreparation
{
    recordAction?:
        import("@opencok/economy/repositories/inventory-transaction").InventoryPreparation[
            "recordAction"
        ];
    prepare(
        tx: MutationTransaction,
        owner: string,
        now: bigint,
    ): Promise<(building: Row, from: bigint) => Promise<readonly ProductionRate[]>>;
}

export interface ProductionPersistenceRuntime
{
    execute: InventoryTransactionExecutor;
    inventory(
        tx: InventoryTransaction,
        owner: string,
        plan: Parameters<InventoryExecutor<InventoryState>>[1],
        reason: string,
    ): Promise<MutationResult>;
}

export type ProductionChangeBoundary = (
    tx: InventoryTransaction,
    owner: string,
    now: bigint,
    change: () => Promise<void>,
    deleted: readonly string[],
    economy: ActivityEconomy,
) => Promise<void>;
