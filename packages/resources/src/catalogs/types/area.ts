export interface AreaDefinition
{
    readonly "id": number;
    readonly "positionX": readonly number[];
    readonly "positionY": readonly number[];
    readonly "idWonder": number;
    readonly "idTower": readonly number[];
    readonly "xyTower": readonly (readonly number[])[];
    readonly "idStatus": readonly number[];
    readonly "timeFresh": number;
    readonly "numFresh": number;
    readonly "timePeace": number;
    readonly "timeFire": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type AreaDefinitionCatalog = CatalogTable<AreaDefinition>;
