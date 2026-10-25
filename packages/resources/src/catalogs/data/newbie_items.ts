import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { NewbieItemsDefinition } from "../types/newbie_items.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./newbie_items.records0.ts";
export const catalog: CatalogTable<NewbieItemsDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "newbie_items", "start": 0, "count": 10 }],
};
