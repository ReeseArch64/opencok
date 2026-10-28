import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ArmyUpEffectDefinition } from "../types/army_up_effect.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./army_up_effect.records0.ts";

export const catalog: CatalogTable<ArmyUpEffectDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "army_up_effect", "start": 0, "count": 70 }],
};
