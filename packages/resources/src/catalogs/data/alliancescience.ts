import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AlliancescienceDefinition } from "../types/alliancescience.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./alliancescience.records0.ts";

export const catalog: CatalogTable<AlliancescienceDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "alliancescience", "start": 0, "count": 503 }],
};
