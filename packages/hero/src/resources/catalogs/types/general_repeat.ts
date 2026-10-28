export interface GeneralRepeatDefinition
{
    readonly "id": number;
    readonly "generalId": number;
    readonly "consume": readonly number[];
    readonly "quantity": number;
}

import type { CatalogTable } from "@opencok/resources/catalog-model";

export type GeneralRepeatDefinitionCatalog = CatalogTable<GeneralRepeatDefinition>;
