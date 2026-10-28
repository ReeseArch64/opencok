import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { KingdomBuildingDefinition } from "../types/kingdom_building.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./kingdom_building.records0.ts";

export const catalog: CatalogTable<KingdomBuildingDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "kingdom_building", "start": 0, "count": 9 }],
};
