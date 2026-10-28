export type InventoryRule = Record<string, string>;

export interface InventoryCatalogs
{
    goods: ReadonlyMap<string, InventoryRule>;
}

export interface InventoryPlanningCatalogs extends InventoryCatalogs
{
    kingdomId: number;
    materials: ReadonlyMap<string, InventoryRule>;
    items: ReadonlyMap<string, InventoryRule>;
}
