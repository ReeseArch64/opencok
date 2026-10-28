export interface CheckpointDefinition
{
    readonly "id": number;
    readonly "level": number;
    readonly "birthPoint": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type CheckpointDefinitionCatalog = CatalogTable<CheckpointDefinition>;
