import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DeepLinkDefinition } from "../types/deep_link.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./deep_link.records0.ts";
export const catalog: CatalogTable<DeepLinkDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
