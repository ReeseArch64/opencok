import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { QuestPhaseDefinition } from "../types/quest_phase.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./quest_phase.records0.ts";
export const catalog: CatalogTable<QuestPhaseDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
