import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DragonTravelDefinition } from "../types/dragon_travel.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./dragon_travel.records0.ts";

export const catalog: CatalogTable<DragonTravelDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "dragon_travel", "start": 0, "count": 32 }],
};
