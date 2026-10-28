import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GoldenEggDefinition } from "../types/golden_egg.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./golden_egg.records0.ts";

export const catalog: CatalogTable<GoldenEggDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "golden_egg", "start": 0, "count": 5 }],
};
