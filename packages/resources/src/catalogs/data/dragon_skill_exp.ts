import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DragonSkillExpDefinition } from "../types/dragon_skill_exp.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./dragon_skill_exp.records0.ts";
export const catalog: CatalogTable<DragonSkillExpDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
