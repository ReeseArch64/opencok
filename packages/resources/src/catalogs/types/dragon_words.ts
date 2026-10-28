export interface DragonWordsDefinition
{
    readonly "id": number;
    readonly "tag"?: number;
    readonly "name": number;
    readonly "description": number;
    readonly "type": number;
    readonly "classify": number;
    readonly "show": number;
    readonly "classifyName": number;
    readonly "order"?: number;
    readonly "activateArray": readonly number[];
    readonly "buildingLevel": number;
    readonly "para1": number | readonly number[];
    readonly "num1": number;
    readonly "dialog1": number;
    readonly "para2": number | readonly number[];
    readonly "num2": number;
    readonly "dialog2": number;
    readonly "para3"?: number | readonly number[];
    readonly "num3"?: number;
    readonly "dialog3"?: number;
    readonly "time"?: number;
    readonly "condition"?: number;
    readonly "para4"?: number | readonly number[];
    readonly "num4"?: number;
    readonly "dialog4"?: number;
    readonly "para5"?: number | readonly number[];
    readonly "num5"?: number;
    readonly "dialog5"?: number;
    readonly "para6"?: number | readonly number[];
    readonly "num6"?: number;
    readonly "dialog6"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type DragonWordsDefinitionCatalog = CatalogTable<DragonWordsDefinition>;
