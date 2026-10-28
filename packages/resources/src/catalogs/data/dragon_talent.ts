import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DragonTalentDefinition } from "../types/dragon_talent.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./dragon_talent.records0.ts";
import { records as records1 } from "./dragon_talent.records1.ts";

export const catalog: CatalogTable<DragonTalentDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0, ...records1],
    "sections": [],
};
