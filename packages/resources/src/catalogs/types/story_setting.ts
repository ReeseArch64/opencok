export interface StorySettingDefinition
{
    readonly "id": number;
    readonly "group": number;
    readonly "type": number;
    readonly "set": number;
    readonly "para1"?: number;
    readonly "target": number;
    readonly "rewards": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type StorySettingDefinitionCatalog = CatalogTable<StorySettingDefinition>;
