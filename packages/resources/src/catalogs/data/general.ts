import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralDefinition } from "../types/general.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general.records0.ts";

export const catalog: CatalogTable<GeneralDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
