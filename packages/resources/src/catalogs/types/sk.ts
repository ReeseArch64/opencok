export interface SkDefinition
{
    readonly "id": number;
    readonly "levelMax": number;
    readonly "type": number;
    readonly "source": number;
    readonly "para1"?: number | readonly (readonly number[])[];
    readonly "base"?: number | readonly number[] | string;
    readonly "add"?: number | readonly number[] | string;
    readonly "conditionSkill"?: readonly (readonly number[])[];
    readonly "cdTime"?: number;
    readonly "item"?: number;
    readonly "quantity"?: number;
    readonly "para2"?: number | readonly number[];
    readonly "duration"?: number;
    readonly "para3"?: number;
    readonly "typeValue"?: number;
    readonly "activeskillType"?: number;
    readonly "activeskillIndex"?: number;
    readonly "canBatchUse"?: number;
    readonly "descNumPercent"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type SkDefinitionCatalog = CatalogTable<SkDefinition>;
