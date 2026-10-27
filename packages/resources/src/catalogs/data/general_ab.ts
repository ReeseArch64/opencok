import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralAbDefinition } from "@opencok/hero/resources/catalogs/types/general_ab";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general_ab.records0.ts";

export const catalog: CatalogTable<GeneralAbDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "general_ab", "start": 0, "count": 137 }],
};
