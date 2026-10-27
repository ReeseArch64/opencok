import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AllianceQuestColorranDefinition } from "../types/alliance_quest_colorran.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./alliance_quest_colorran.records0.ts";

export const catalog: CatalogTable<AllianceQuestColorranDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
