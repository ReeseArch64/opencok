export interface MonsterSiegeDefinition
{
    readonly "id": number;
    readonly "servertime": readonly number[];
    readonly "time": number;
    readonly "monster": readonly (readonly number[])[];
    readonly "armyrate": number;
    readonly "target": number;
    readonly "marchrate": number;
    readonly "score": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type MonsterSiegeDefinitionCatalog = CatalogTable<MonsterSiegeDefinition>;
