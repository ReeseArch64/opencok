import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { NewsCastleLVDefinition } from "../types/news_castleLV.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./news_castleLV.records0.ts";
export const catalog: CatalogTable<NewsCastleLVDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
