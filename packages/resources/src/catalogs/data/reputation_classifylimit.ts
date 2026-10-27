import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ReputationClassifylimitDefinition } from "../types/reputation_classifylimit.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./reputation_classifylimit.records0.ts";

export const catalog: CatalogTable<ReputationClassifylimitDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "reputation_level", "start": 0, "count": 3 }],
};
