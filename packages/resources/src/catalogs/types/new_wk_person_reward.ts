export interface NewWkPersonRewardDefinition
{
    readonly "id": number;
    readonly "stage": number;
    readonly "castleMin": number;
    readonly "castleMax": number;
    readonly "target": number;
    readonly "reward": number;
    readonly "type": number;
    readonly "scienceQuest"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type NewWkPersonRewardDefinitionCatalog = CatalogTable<NewWkPersonRewardDefinition>;
