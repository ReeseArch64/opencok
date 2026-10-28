import type { InventoryCommandState, InventoryPlan } from "../contracts/inventory-planning.ts";
import type { InventoryPlanningCatalogs } from "../contracts/inventory-catalogs.ts";
import type { InventoryRuntime } from "../contracts/inventory-runtime.ts";
import { inventoryCount } from "../rules/inventory.ts";
import { InventoryPlanner } from "./inventory-planner.ts";

export function planInventoryGrants<
    State extends InventoryCommandState,
    Catalogs extends InventoryPlanningCatalogs,
>(
    state: State,
    rules: Catalogs,
    runtime: InventoryRuntime<State, Catalogs>,
    grants: readonly { itemId: string; count: number; }[],
    now: number,
    costs: readonly { itemId: string; count: number; }[] = [],
): InventoryPlan
{
    const planner = new InventoryPlanner(
        state,
        rules,
        runtime,
        now,
    );

    for (const cost of costs)
    {
        planner.spendItems(cost.itemId, inventoryCount(cost.count));
    }

    for (const grant of grants)
    {
        planner.add(grant.itemId, grant.count);
    }

    return planner.result({});
}
