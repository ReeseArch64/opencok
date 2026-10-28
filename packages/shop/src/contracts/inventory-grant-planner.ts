import type { InventoryState } from "@opencok/contracts/inventory";
import type { InventoryPlan } from "@opencok/economy/contracts/inventory-planning";
import type { Rules } from "@opencok/rules/game";

export type InventoryGrantPlanner = (
    state: InventoryState,
    rules: Rules,
    grants: readonly { itemId: string; count: number; }[],
    now: number,
    costs?: readonly { itemId: string; count: number; }[],
) => InventoryPlan;
