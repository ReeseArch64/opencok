import type { InventoryState } from "@opencok/contracts/inventory";
import type { Rules } from "@opencok/rules/game";
import type { InventoryPlanner } from "@opencok/economy/services/inventory-planner";
import type { WorldPowerEffect } from "@opencok/contracts/power";

export type ProductionPlanner = (
    state: InventoryState,
    now: number,
) => InventoryPlanner<InventoryState, Rules>;

export interface ProductionEffectProviders
{
    worldPowerEffects?(kingdomId?: number): Promise<ReadonlyMap<string, string>>;
    emperorVersion?(kingdomId?: number): Promise<number | null | undefined>;
}

export type ProductionWorldDecoder = (records: ReadonlyMap<string, string>) => WorldPowerEffect[];
