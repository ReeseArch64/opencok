import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ReputationLevelDefinition } from "../types/reputation_level.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./reputation_level.records0.ts";

export const catalog: CatalogTable<ReputationLevelDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "reputation_level", "start": 0, "count": 32 }],
};
