import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { RecallQuestDefinition } from "../types/recall_quest.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./recall_quest.records0.ts";

export const catalog: CatalogTable<RecallQuestDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
