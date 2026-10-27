import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { KingdomshopDefinition } from "../types/kingdomshop.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./kingdomshop.records0.ts";

export const catalog: CatalogTable<KingdomshopDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
