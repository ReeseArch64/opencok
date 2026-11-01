import { records as appearanceRecords } from "./shop_new.appearance.ts";
import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ShopNewDefinition } from "../types/shop_new.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./shop_new.records0.ts";
import { records as records1 } from "./shop_new.records1.ts";
import { records as records2 } from "./shop_new.records2.ts";
import { records as records3 } from "./shop_new.records3.ts";
import { records as records4 } from "./shop_new.records4.ts";

export const catalog: CatalogTable<ShopNewDefinition> = {
    "kind": CatalogKind.Table,
    "records": [
        ...appearanceRecords,
        ...records0,
        ...records1,
        ...records2,
        ...records3,
        ...records4,
    ],
    "sections": [],
};
