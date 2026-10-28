import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralBaseSkillTreeDefinition } from "@opencok/hero/resources/catalogs/types/general_base_skill_tree";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general_base_skill_tree.records0.ts";

export const catalog: CatalogTable<GeneralBaseSkillTreeDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "general_base_skill_tree", "start": 0, "count": 6 }],
};
