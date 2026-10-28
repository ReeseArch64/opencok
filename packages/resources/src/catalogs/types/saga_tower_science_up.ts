export interface SagaTowerScienceUpDefinition
{
    readonly "id": number;
    readonly "scienceId": number;
    readonly "scienceLv": number;
    readonly "buildingCondition"?: number;
    readonly "wood": bigint;
    readonly "food": bigint;
    readonly "iron": bigint;
    readonly "stone": bigint | number;
    readonly "item"?: number | readonly (readonly number[])[];
    readonly "timeResearch": number;
    readonly "effect"?: number | readonly number[];
    readonly "value"?: number | readonly number[] | string;
    readonly "power": number;
    readonly "scienceCondition"?: readonly (readonly number[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type SagaTowerScienceUpDefinitionCatalog = CatalogTable<SagaTowerScienceUpDefinition>;
