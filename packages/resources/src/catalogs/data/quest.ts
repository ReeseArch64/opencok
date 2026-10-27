import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { QuestDefinition } from "../types/quest.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./quest.records0.ts";
import { records as records1 } from "./quest.records1.ts";

export const catalog: CatalogTable<QuestDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0, ...records1],
  "sections": [],
};
