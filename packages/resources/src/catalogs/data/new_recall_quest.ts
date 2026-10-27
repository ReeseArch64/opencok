import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { NewRecallQuestDefinition } from "../types/new_recall_quest.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./new_recall_quest.records0.ts";

export const catalog: CatalogTable<NewRecallQuestDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
