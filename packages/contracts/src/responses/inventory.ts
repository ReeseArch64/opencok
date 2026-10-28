import type { InventoryFields } from "../inventory.ts";

export interface InventoryCommandResponse
{
    body: InventoryFields;
    pushes: { command: string; body: InventoryFields; }[];
}
