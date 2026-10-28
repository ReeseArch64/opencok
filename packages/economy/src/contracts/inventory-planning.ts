import type { InventoryLedgerState, InventorySnapshotRow } from "./inventory-ledger.ts";
import type { InventoryItem, InventoryFields } from "./inventory.ts";
import type {
    MutationCommand,
    MutationResult,
    EconomyPosting,
    MutationEvent,
} from "@opencok/ledger/contracts/mutation";

export interface InventoryCommandState extends InventoryLedgerState
{
    recordAction?(
        kind: "use" | "compose" | "harvest",
        itemId: string,
        count: number,
        economy: import("@opencok/economy/contracts/activity-economy").ActivityEconomy,
    ): Promise<void>;
    useEffect?(
        itemId: string,
        count: number,
        economy: import("@opencok/economy/contracts/activity-economy").ActivityEconomy,
    ): Promise<InventoryFields>;
    cooldowns: ReadonlyMap<string, bigint>;
    buildings: readonly InventorySnapshotRow[];
}

export interface InventoryPlan extends MutationResult
{
    confirmedSpending?(postings: readonly EconomyPosting[]): MutationEvent | undefined;
    assets?: Readonly<Record<string, bigint>>;
    postings: readonly EconomyPosting[];
    items: readonly InventoryItem[];
    profile: Readonly<Record<string, bigint>>;
    resource: Readonly<Record<string, bigint>>;
    cooldowns: ReadonlyMap<string, bigint>;
}

export type InventoryExecutor<State extends InventoryCommandState = InventoryCommandState> = (
    command: MutationCommand,
    plan: (state: State) => Promise<InventoryPlan>,
) => Promise<Buffer>;
