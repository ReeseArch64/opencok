import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ScoreDefinition } from "../types/score.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./score.records0.ts";

export const catalog: CatalogTable<ScoreDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "score", "start": 0, "count": 99 }],
};
