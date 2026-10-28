import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { QuestMarkDefinition } from "../types/quest_mark.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./quest_mark.records0.ts";

export const catalog: CatalogTable<QuestMarkDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
