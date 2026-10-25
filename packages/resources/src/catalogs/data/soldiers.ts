import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SoldiersDefinition } from "../types/soldiers.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./soldiers.records0.ts";
export const catalog: CatalogTable<SoldiersDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
