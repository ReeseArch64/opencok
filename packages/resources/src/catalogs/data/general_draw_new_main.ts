import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralDrawNewMainDefinition } from "@opencok/hero/resources/catalogs/types/general_draw_new_main";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general_draw_new_main.records0.ts";

export const catalog: CatalogTable<GeneralDrawNewMainDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "general_draw_new_main", "start": 0, "count": 4 }],
};
