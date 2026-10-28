export interface ArmyUpBaseDefinition
{
    readonly "id": number;
    readonly "levelMax": number;
    readonly "army": number;
    readonly "position": number;
    readonly "rate": number;
    readonly "gradeInterval": number;
    readonly "enhance": readonly number[];
    readonly "effect": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ArmyUpBaseDefinitionCatalog = CatalogTable<ArmyUpBaseDefinition>;
