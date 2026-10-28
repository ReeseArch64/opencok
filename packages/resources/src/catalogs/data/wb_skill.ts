import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WbSkillDefinition } from "../types/wb_skill.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wb_skill.records0.ts";

export const catalog: CatalogTable<WbSkillDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
