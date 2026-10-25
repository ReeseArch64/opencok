import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AllianceBuildingSkillDefinition } from "../types/alliance_building_skill.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./alliance_building_skill.records0.ts";
export const catalog: CatalogTable<AllianceBuildingSkillDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "alliance_building_skill", "start": 0, "count": 21 }],
};
