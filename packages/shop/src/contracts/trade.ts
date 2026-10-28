import type { InventoryPlan, InventoryState } from "@opencok/contracts/inventory";
import type { MutationCommand } from "@opencok/contracts/mutation";

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
