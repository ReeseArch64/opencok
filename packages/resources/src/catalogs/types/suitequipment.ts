export interface SuitequipmentDefinition
{
    readonly "id": number;
    readonly "suitId": number;
    readonly "site": number;
    readonly "color": number;
    readonly "forgeRate": number;
    readonly "power": number;
    readonly "level": number;
    readonly "para1": number | readonly number[];
    readonly "num1": number;
    readonly "para2": number | readonly number[];
    readonly "num2": number;
    readonly "para3"?: number | readonly number[];
    readonly "num3"?: number;
    readonly "para4"?: number | readonly number[];
    readonly "num4"?: number;
    readonly "material1": readonly number[];
    readonly "material2": readonly number[];
    readonly "material3": readonly number[];
    readonly "material4": readonly number[];
    readonly "cost": readonly number[];
    readonly "time": number;
    readonly "suitbreakDown": string;
    readonly "suitbreakUp": string;
    readonly "suitbreakK": number;
    readonly "exclusiveHero"?: number;
    readonly "reform"?: number;
    readonly "cotyledons"?: readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type SuitequipmentDefinitionCatalog = CatalogTable<SuitequipmentDefinition>;
