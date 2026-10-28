export interface GeneralStationDefinition
{
    readonly "id": number;
    readonly "build": number;
    readonly "effect": readonly (readonly number[])[] | string;
    readonly "station": number;
    readonly "functionOnline": string;
    readonly "functionTest": string;
    readonly "version": string;
    readonly "speEffect"?: number;
}

import type { CatalogTable } from "@opencok/resources/catalog-model";

export type GeneralStationDefinitionCatalog = CatalogTable<GeneralStationDefinition>;
