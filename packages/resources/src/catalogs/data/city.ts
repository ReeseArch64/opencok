import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { CityDefinition } from "../types/city.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./city.records0.ts";

export const catalog: CatalogTable<CityDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
