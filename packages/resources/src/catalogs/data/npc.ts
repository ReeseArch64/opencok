import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { NpcDefinition } from "../types/npc.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./npc.records0.ts";

export const catalog: CatalogTable<NpcDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": 110000, "start": 0, "count": 46 }],
};
