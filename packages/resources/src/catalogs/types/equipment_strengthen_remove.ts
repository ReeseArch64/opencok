export interface EquipmentStrengthenRemoveDefinition
{
    readonly "id": number;
    readonly "equipmentId": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type EquipmentStrengthenRemoveDefinitionCatalog = CatalogTable<
    EquipmentStrengthenRemoveDefinition
>;
