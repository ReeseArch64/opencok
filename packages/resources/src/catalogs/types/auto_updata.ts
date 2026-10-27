export interface AutoUpdataDefinition {
  readonly "id": number;
  readonly "priority": number;
  readonly "type": number;
  readonly "iosMd5": string;
  readonly "aMd5": string;
  readonly "functionOn": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type AutoUpdataDefinitionCatalog = CatalogTable<AutoUpdataDefinition>;
