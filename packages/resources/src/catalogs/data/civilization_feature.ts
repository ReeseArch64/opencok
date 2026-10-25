import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { CivilizationFeatureDefinition } from "../types/civilization_feature.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./civilization_feature.records0.ts";
export const catalog: CatalogTable<CivilizationFeatureDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "civilization_feature", "start": 0, "count": 600 }],
};
