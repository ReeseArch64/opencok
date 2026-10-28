import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralRankDefinition } from "@opencok/hero/resources/catalogs/types/general_rank";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general_rank.records0.ts";

export const catalog: CatalogTable<GeneralRankDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "general_rank", "start": 0, "count": 62 }],
};
