export interface GeneralLevelDefinition
{
    readonly "id": number;
    readonly "level": number;
    readonly "experience": number;
    readonly "point": number;
    readonly "exp1": number;
    readonly "point1": number;
}

import type { CatalogTable } from "@opencok/resources/catalog-model";

export type GeneralLevelDefinitionCatalog = CatalogTable<GeneralLevelDefinition>;
