import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { MonsterSiegeDefinition } from "../types/monster_siege.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./monster_siege.records0.ts";

export const catalog: CatalogTable<MonsterSiegeDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [
        { "id": "monster_siege1", "start": 0, "count": 25 },
        { "id": "monster_siege2", "start": 25, "count": 25 },
        { "id": "monster_siege3", "start": 50, "count": 25 },
        { "id": "monster_siege4", "start": 75, "count": 25 },
    ],
};
