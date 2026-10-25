import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { TrialDefinition } from "../types/trial.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./trial.records0.ts";
export const catalog: CatalogTable<TrialDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
