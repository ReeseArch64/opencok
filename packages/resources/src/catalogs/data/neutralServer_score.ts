import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { NeutralServerScoreDefinition } from "../types/neutralServer_score.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./neutralServer_score.records0.ts";
export const catalog: CatalogTable<NeutralServerScoreDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "neutralServer_score", "start": 0, "count": 30 }],
};
