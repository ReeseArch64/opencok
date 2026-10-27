import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { TerritoryEffectDefinition } from "../types/territory_effect.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./territory_effect.records0.ts";

export const catalog: CatalogTable<TerritoryEffectDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
