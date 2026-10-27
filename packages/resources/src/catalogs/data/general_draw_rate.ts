import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralDrawRateDefinition } from "@opencok/hero/resources/catalogs/types/general_draw_rate";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general_draw_rate.records0.ts";

export const catalog: CatalogTable<GeneralDrawRateDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "general_draw_rate", "start": 0, "count": 2 }],
};
