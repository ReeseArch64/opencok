import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DragonDetailDefinition } from "../types/dragon_detail.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./dragon_detail.records0.ts";

export const catalog: CatalogTable<DragonDetailDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "dragon_detail", "start": 0, "count": 14 }],
};
