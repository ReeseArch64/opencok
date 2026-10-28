import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { Kingdon2Definition } from "../types/kingdon_2.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./kingdon_2.records0.ts";

export const catalog: CatalogTable<Kingdon2Definition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": 1, "start": 0, "count": 1 }],
};
