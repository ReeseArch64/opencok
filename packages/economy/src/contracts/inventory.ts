export interface InventoryItem
{
    uuid: string;
    itemId: string;
    count: number;
    value: number;
    vanishTime: bigint;
}

export type InventoryFields = Record<string, { type: number; value: unknown; }>;
