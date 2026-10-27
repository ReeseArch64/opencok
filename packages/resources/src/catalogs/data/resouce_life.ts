import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ResouceLifeDefinition } from "../types/resouce_life.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./resouce_life.records0.ts";

export const catalog: CatalogTable<ResouceLifeDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
