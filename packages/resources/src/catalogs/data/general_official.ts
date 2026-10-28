import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralOfficialDefinition } from "@opencok/hero/resources/catalogs/types/general_official";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general_official.records0.ts";

export const catalog: CatalogTable<GeneralOfficialDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "bestow_title", "start": 0, "count": 15 }],
};
