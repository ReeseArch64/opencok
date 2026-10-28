import type { InventoryCommandState } from "@opencok/economy/contracts/inventory-planning";
import type { PlayerEffectSnapshot } from "./power.ts";

export interface InventoryState extends InventoryCommandState
{
    effects(): Promise<PlayerEffectSnapshot>;
}
