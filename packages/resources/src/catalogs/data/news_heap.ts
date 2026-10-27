import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { NewsHeapDefinition } from "../types/news_heap.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./news_heap.records0.ts";

export const catalog: CatalogTable<NewsHeapDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
