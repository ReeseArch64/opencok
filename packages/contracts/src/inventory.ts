import type { InventoryLedgerState } from "@opencok/economy/contracts/inventory-ledger";
import type { InventoryItem, InventoryFields } from "@opencok/economy/contracts/inventory";
import type {
    MutationCommand,
    MutationResult,
    EconomyPosting,
    MutationEvent,
} from "@opencok/ledger/contracts/mutation";
import type { Row } from "./rows.ts";
import type { PlayerEffectSnapshot } from "./power.ts";

export interface InventoryState extends InventoryLedgerState
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
    buildings: readonly Row[];
    effects(): Promise<PlayerEffectSnapshot>;
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

export type InventoryExecutor = (
    command: MutationCommand,
    plan: (state: InventoryState) => Promise<InventoryPlan>,
) => Promise<Buffer>;
