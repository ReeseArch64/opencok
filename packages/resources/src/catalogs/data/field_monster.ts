import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { FieldMonsterDefinition } from "../types/field_monster.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./field_monster.records0.ts";
import { records as records1 } from "./field_monster.records1.ts";
export const catalog: CatalogTable<FieldMonsterDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0, ...records1],
  "sections": [
    { "id": "field_monster", "start": 0, "count": 807 },
    { "id": "refresh", "start": 807, "count": 25 },
    { "id": "refresh_event", "start": 832, "count": 24 },
    { "id": "refresh_event_other", "start": 856, "count": 24 },
    { "id": "refresh_event_csmod", "start": 880, "count": 24 },
    { "id": "refresh_event_csmod_npc", "start": 904, "count": 24 },
    { "id": "refresh_event_csmod_boss", "start": 928, "count": 24 },
  ],
};
