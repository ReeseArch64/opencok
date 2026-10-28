export interface DragonSkillExpDefinition
{
    readonly "id": number;
    readonly "level": number;
    readonly "quality": number;
    readonly "experience": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type DragonSkillExpDefinitionCatalog = CatalogTable<DragonSkillExpDefinition>;
