import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WrSkillDefinition } from "../types/wr_skill.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wr_skill.records0.ts";

export const catalog: CatalogTable<WrSkillDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
