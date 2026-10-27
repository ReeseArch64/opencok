import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { TreasureDefinition } from "../types/treasure.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./treasure.records0.ts";

export const catalog: CatalogTable<TreasureDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
