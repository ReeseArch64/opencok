import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralLevelDefinition } from "../types/general_level.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general_level.records0.ts";

export const catalog: CatalogTable<GeneralLevelDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
