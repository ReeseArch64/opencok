import type { InventoryFields } from "../inventory.ts";

export interface InventoryCommandResponse
{
    body: InventoryFields;
    pushes: { command: string; body: InventoryFields; }[];
}

export interface InventoryItemResponse
{
    readonly uuid: string;
    readonly itemId: string;
    readonly para1?: string;
    readonly para2?: string;
    readonly para3?: string;
    readonly para4?: string;
    readonly para5?: string;
    readonly para6?: string;
    readonly para7?: string;
    readonly para8?: string;
    readonly para9?: string;
    readonly count: number;
    readonly vanishTime: bigint;
}
