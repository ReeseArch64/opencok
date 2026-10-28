import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AbilityDefinition } from "../types/ability.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./ability.records0.ts";

export const catalog: CatalogTable<AbilityDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": 1, "start": 0, "count": 35 }],
};
