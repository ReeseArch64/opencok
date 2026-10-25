import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { TrainDefinition } from "../types/train.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./train.records0.ts";
export const catalog: CatalogTable<TrainDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "train", "start": 0, "count": 5 }],
};
