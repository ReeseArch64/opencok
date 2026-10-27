export interface DragonTalentExpDefinition {
  readonly "id": number;
  readonly "baseId": number;
  readonly "point": number;
  readonly "experience": number;
  readonly "expAdd": number;
  readonly "items": readonly (readonly number[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type DragonTalentExpDefinitionCatalog = CatalogTable<DragonTalentExpDefinition>;
