import type { InventoryCommandState, InventoryPlan } from "./inventory-planning.ts";
import type { InventoryPlanningCatalogs } from "./inventory-catalogs.ts";
import type { InventoryItem } from "./inventory.ts";

export type InventoryResourceEffect = 100 | 101 | 102 | 103 | 104 | 158 | 159 | 160;

export interface InventoryRuntime<
    State extends InventoryCommandState,
    Catalogs extends InventoryPlanningCatalogs,
>
{
    feature(
        rules: Catalogs,
        key: string,
        context: { kingdomId: number; version: string; now: number; },
    ): boolean;
    resourceBonus(
        state: State,
        rules: Catalogs,
        now: number,
        id: InventoryResourceEffect,
    ): Promise<number>;
    confirmedSpending(
        state: State,
        rules: Catalogs,
        now: number,
        items: readonly InventoryItem[],
    ): InventoryPlan["confirmedSpending"];
}
