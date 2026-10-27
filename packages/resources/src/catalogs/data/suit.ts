import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SuitDefinition } from "../types/suit.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./suit.records0.ts";

export const catalog: CatalogTable<SuitDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
