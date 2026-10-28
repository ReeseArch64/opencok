export interface AllianceQuestColorranDefinition
{
    readonly "id": number;
    readonly "color": number;
    readonly "rate"?: number;
    readonly "systemRate"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type AllianceQuestColorranDefinitionCatalog = CatalogTable<AllianceQuestColorranDefinition>;
