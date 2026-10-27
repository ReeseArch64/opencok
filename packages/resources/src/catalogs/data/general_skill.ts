import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralSkillDefinition } from "../types/general_skill.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general_skill.records0.ts";
import { records as records1 } from "./general_skill.records1.ts";
import { records as records2 } from "./general_skill.records2.ts";
import { records as records3 } from "./general_skill.records3.ts";
import { records as records4 } from "./general_skill.records4.ts";

export const catalog: CatalogTable<GeneralSkillDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0, ...records1, ...records2, ...records3, ...records4],
  "sections": [],
};
