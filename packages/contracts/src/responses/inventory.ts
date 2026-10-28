import type { InventoryFields } from "@opencok/economy/contracts/inventory";

export interface InventoryCommandResponse
{
    body: InventoryFields;
    pushes: { command: string; body: InventoryFields; }[];
}
