import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { CivilizationDefinition } from "../types/civilization.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./civilization.records0.ts";

export const catalog: CatalogTable<CivilizationDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "civilization", "start": 0, "count": 5 }],
};
