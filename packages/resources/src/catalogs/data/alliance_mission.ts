import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AllianceMissionDefinition } from "../types/alliance_mission.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./alliance_mission.records0.ts";
export const catalog: CatalogTable<AllianceMissionDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "alliance_mission", "start": 0, "count": 49 }],
};
