import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { MonarchTitleKingdomDefinition } from "../types/monarch_title_kingdom.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./monarch_title_kingdom.records0.ts";
export const catalog: CatalogTable<MonarchTitleKingdomDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
