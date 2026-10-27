import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { HeroeventDefinition } from "@opencok/hero/resources/catalogs/types/heroevent";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./heroevent.records0.ts";

export const catalog: CatalogTable<HeroeventDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
