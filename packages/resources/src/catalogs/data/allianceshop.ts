import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AllianceshopDefinition } from "../types/allianceshop.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./allianceshop.records0.ts";
export const catalog: CatalogTable<AllianceshopDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "vip", "start": 0, "count": 31 }],
};
