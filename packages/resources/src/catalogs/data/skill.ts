import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SkillDefinition } from "../types/skill.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./skill.records0.ts";
import { records as records1 } from "./skill.records1.ts";
export const catalog: CatalogTable<SkillDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0, ...records1],
  "sections": [],
};
