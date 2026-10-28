export interface EquipmentBagSuitFilterDefinition
{
    readonly "id": number;
    readonly "suitGroup": number;
    readonly "groupName": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type EquipmentBagSuitFilterDefinitionCatalog = CatalogTable<
    EquipmentBagSuitFilterDefinition
>;
