export interface DragonTowerCoordDefinition
{
    readonly "id": number;
    readonly "coord1": readonly number[];
    readonly "coord2": readonly number[];
    readonly "coord3": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type DragonTowerCoordDefinitionCatalog = CatalogTable<DragonTowerCoordDefinition>;
