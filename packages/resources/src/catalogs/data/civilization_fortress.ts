import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { CivilizationFortressDefinition } from "../types/civilization_fortress.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./civilization_fortress.records0.ts";

export const catalog: CatalogTable<CivilizationFortressDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "civilization_fortress", "start": 0, "count": 30 }],
};
