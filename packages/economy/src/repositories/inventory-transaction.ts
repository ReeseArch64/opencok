import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import type { MutationCommand, MutationResult } from "@opencok/ledger/contracts/mutation";
import type { InventoryCommandState } from "../contracts/inventory-planning.ts";
import type { InventorySnapshotRow } from "../contracts/inventory-ledger.ts";
import type { ActivityEconomy } from "../contracts/activity-economy.ts";
import type { InventoryFields } from "../contracts/inventory.ts";

type RealmDatabase = DatabaseClient<"kingdom">;

export type InventoryTransaction = Parameters<Parameters<RealmDatabase["transaction"]>[0]>[0];

export type InventoryTransactionExecutor = (
    command: MutationCommand,
    apply: (tx: InventoryTransaction) => Promise<MutationResult>,
) => Promise<Buffer>;

export interface InventoryTransactionRuntime<State extends InventoryCommandState>
{
    extendState(
        tx: InventoryTransaction,
        profile: InventorySnapshotRow,
        state: InventoryCommandState,
    ): State;
    mergeConfirmation(base: MutationResult, confirmed: MutationResult): MutationResult;
}

export interface InventoryPreparation
{
    recordAction?(
        tx: InventoryTransaction,
        owner: string,
        kind: "use" | "compose" | "harvest",
        itemId: string,
        count: number,
        now: bigint,
        economy: ActivityEconomy,
    ): Promise<void>;
    before?(tx: InventoryTransaction, owner: string, now: bigint): Promise<void>;
    useEffect?(
        tx: InventoryTransaction,
        owner: string,
        itemId: string,
        count: number,
        now: bigint,
        economy: ActivityEconomy,
    ): Promise<InventoryFields>;
}
