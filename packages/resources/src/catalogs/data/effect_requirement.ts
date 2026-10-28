import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { EffectRequirementDefinition } from "../types/effect_requirement.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./effect_requirement.records0.ts";

export const catalog: CatalogTable<EffectRequirementDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "effect_requirement", "start": 0, "count": 22 }],
};
