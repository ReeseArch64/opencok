import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { TargetQuestDefinition } from "../types/target_quest.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./target_quest.records0.ts";

export const catalog: CatalogTable<TargetQuestDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "target_quest", "start": 0, "count": 118 }],
};
