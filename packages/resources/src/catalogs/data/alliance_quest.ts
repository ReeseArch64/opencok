import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AllianceQuestDefinition } from "../types/alliance_quest.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./alliance_quest.records0.ts";

export const catalog: CatalogTable<AllianceQuestDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
