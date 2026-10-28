import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { LuckDrawDefinition } from "../types/luck_draw.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./luck_draw.records0.ts";

export const catalog: CatalogTable<LuckDrawDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "luck_draw", "start": 0, "count": 10 }],
};
