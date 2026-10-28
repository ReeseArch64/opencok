import type { MutationCommand, MutationResult, EconomyPosting, MutationEvent } from "./mutation.ts";
import type { Row } from "./rows.ts";
import type { PlayerEffectSnapshot } from "./power.ts";

export interface InventoryItem
{
    uuid: string;
    itemId: string;
    count: number;
    value: number;
    vanishTime: bigint;
}

export interface InventoryState
{
    assets?: Row;
    recordAction?(
        kind: "use" | "compose" | "harvest",
        itemId: string,
        count: number,
        economy: import("./timed-activity").ActivityEconomy,
    ): Promise<void>;
    useEffect?(
        itemId: string,
        count: number,
        economy: import("./timed-activity").ActivityEconomy,
    ): Promise<InventoryFields>;
    profile: Row;
    resource: Row;
    items: readonly InventoryItem[];
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

export type InventoryFields = Record<string, { type: number; value: unknown; }>;
