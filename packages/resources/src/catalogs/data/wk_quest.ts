import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WkQuestDefinition } from "../types/wk_quest.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wk_quest.records0.ts";
export const catalog: CatalogTable<WkQuestDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
