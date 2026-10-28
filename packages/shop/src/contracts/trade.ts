import type { InventoryState } from "@opencok/contracts/inventory";
import type { InventoryPlan } from "@opencok/economy/contracts/inventory-planning";
import type { MutationCommand } from "@opencok/ledger/contracts/mutation";

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
