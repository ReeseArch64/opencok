import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ScienceRaceTypeDefinition } from "../types/scienceRaceType.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./scienceRaceType.records0.ts";
export const catalog: CatalogTable<ScienceRaceTypeDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "scienceRaceType", "start": 0, "count": 200 }],
};
