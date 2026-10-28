export interface ForeignCivilizationBaseDefinition
{
    readonly "id": number;
    readonly "civilizationType": number;
    readonly "chapter": number;
    readonly "levelMax": number;
    readonly "hide": number;
    readonly "civilizationName": number;
    readonly "civilizationIcon": string;
    readonly "chapterName": number;
    readonly "chapterIcon": string;
    readonly "scienceName": number;
    readonly "description": number;
    readonly "icon": string;
    readonly "position": readonly number[];
    readonly "relation"?: number | readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ForeignCivilizationBaseDefinitionCatalog = CatalogTable<
    ForeignCivilizationBaseDefinition
>;
