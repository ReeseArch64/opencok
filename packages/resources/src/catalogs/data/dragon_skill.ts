import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DragonSkillDefinition } from "../types/dragon_skill.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./dragon_skill.records0.ts";
import { records as records1 } from "./dragon_skill.records1.ts";
export const catalog: CatalogTable<DragonSkillDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0, ...records1],
  "sections": [{ "id": "dragon_new", "start": 0, "count": 785 }],
};
