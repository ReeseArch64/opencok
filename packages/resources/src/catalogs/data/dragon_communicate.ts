import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DragonCommunicateDefinition } from "../types/dragon_communicate.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./dragon_communicate.records0.ts";

export const catalog: CatalogTable<DragonCommunicateDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "dragon_communicate", "start": 0, "count": 4 }],
};
