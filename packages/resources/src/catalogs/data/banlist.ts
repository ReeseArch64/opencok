import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { BanlistDefinition } from "../types/banlist.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./banlist.records0.ts";

export const catalog: CatalogTable<BanlistDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "banlist", "start": 0, "count": 34 }],
};
