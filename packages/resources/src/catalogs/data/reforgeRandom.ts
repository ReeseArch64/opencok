import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ReforgeRandomDefinition } from "../types/reforgeRandom.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./reforgeRandom.records0.ts";
export const catalog: CatalogTable<ReforgeRandomDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
