export interface EquipmentSmeltDefinition
{
    readonly "id": number;
    readonly "quantity": number;
    readonly "goodsId": number;
    readonly "smeltEquipment": number | readonly number[];
    readonly "strengthen": number;
    readonly "type": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type EquipmentSmeltDefinitionCatalog = CatalogTable<EquipmentSmeltDefinition>;
