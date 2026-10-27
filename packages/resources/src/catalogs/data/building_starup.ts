import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { BuildingStarupDefinition } from "../types/building_starup.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./building_starup.records0.ts";

export const catalog: CatalogTable<BuildingStarupDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
