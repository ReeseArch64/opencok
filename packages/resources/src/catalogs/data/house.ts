import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { HouseDefinition } from "../types/house.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./house.records0.ts";

export const catalog: CatalogTable<HouseDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
