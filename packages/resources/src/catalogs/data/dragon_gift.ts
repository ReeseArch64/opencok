import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DragonGiftDefinition } from "../types/dragon_gift.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./dragon_gift.records0.ts";

export const catalog: CatalogTable<DragonGiftDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "dragon_gift", "start": 0, "count": 1 }],
};
