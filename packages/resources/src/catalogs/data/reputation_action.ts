import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ReputationActionDefinition } from "../types/reputation_action.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./reputation_action.records0.ts";

export const catalog: CatalogTable<ReputationActionDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
