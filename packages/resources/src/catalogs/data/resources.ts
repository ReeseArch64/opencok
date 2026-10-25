import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ResourcesDefinition } from "../types/resources.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./resources.records0.ts";
import { records as records1 } from "./resources.records1.ts";
export const catalog: CatalogTable<ResourcesDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0, ...records1],
  "sections": [
    { "id": "resources", "start": 0, "count": 310 },
    { "id": "resources1", "start": 310, "count": 310 },
    { "id": "resources2", "start": 620, "count": 310 },
    { "id": "resources3", "start": 930, "count": 310 },
  ],
};
