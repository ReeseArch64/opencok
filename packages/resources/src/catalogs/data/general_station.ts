import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralStationDefinition } from "../types/general_station.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general_station.records0.ts";
export const catalog: CatalogTable<GeneralStationDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
