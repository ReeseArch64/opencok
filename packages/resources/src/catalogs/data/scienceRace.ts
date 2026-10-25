import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ScienceRaceDefinition } from "../types/scienceRace.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./scienceRace.records0.ts";
import { records as records1 } from "./scienceRace.records1.ts";
import { records as records2 } from "./scienceRace.records2.ts";
export const catalog: CatalogTable<ScienceRaceDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0, ...records1, ...records2],
  "sections": [{ "id": "scienceRace", "start": 0, "count": 1735 }],
};
