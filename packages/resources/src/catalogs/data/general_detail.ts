import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralDetailDefinition } from "@opencok/hero/resources/catalogs/types/general_detail";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general_detail.records0.ts";

export const catalog: CatalogTable<GeneralDetailDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "general_detail", "start": 0, "count": 214 }],
};
