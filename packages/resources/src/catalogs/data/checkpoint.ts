import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { CheckpointDefinition } from "../types/checkpoint.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./checkpoint.records0.ts";
export const catalog: CatalogTable<CheckpointDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "checkpoint", "start": 0, "count": 1 }],
};
