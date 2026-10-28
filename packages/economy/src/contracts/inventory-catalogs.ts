export type InventoryRule = Record<string, string>;

export interface InventoryCatalogs
{
    goods: ReadonlyMap<string, InventoryRule>;
}
