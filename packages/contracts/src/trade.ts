import type { InventoryPlan, InventoryState } from "./inventory.ts";
import type { MutationCommand } from "./mutation.ts";

export interface TradeState
{
    trade: string;
    time: bigint;
    num: number;
    superValue: number;
}

export type TradeExecutor = (
    input: MutationCommand,
    plan: (
        inventory: InventoryState,
        trade: TradeState,
        now: number,
    ) => Promise<{ inventory: InventoryPlan; trade: TradeState; }>,
) => Promise<Buffer>;
