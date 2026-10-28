import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { LuckyEffectDefinition } from "../types/lucky_effect.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./lucky_effect.records0.ts";

export const catalog: CatalogTable<LuckyEffectDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
