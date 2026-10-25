import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SafeDefinition } from "../types/safe.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./safe.records0.ts";
export const catalog: CatalogTable<SafeDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
