export interface GeneralRandomNumDefinition
{
    readonly "id": number;
    readonly "generalId": number;
    readonly "effectNum": number;
    readonly "nowMin": number;
    readonly "nowMax": number;
    readonly "randomMin": number;
    readonly "randomMax": number;
    readonly "limitCount": number;
    readonly "mostCount": number;
}

import type { CatalogTable } from "@opencok/resources/catalog-model";

export type GeneralRandomNumDefinitionCatalog = CatalogTable<GeneralRandomNumDefinition>;
