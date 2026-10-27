import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { KingdomskillDefinition } from "../types/kingdomskill.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./kingdomskill.records0.ts";

export const catalog: CatalogTable<KingdomskillDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
