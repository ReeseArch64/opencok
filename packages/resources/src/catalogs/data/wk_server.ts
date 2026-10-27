import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WkServerDefinition } from "../types/wk_server.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wk_server.records0.ts";

export const catalog: CatalogTable<WkServerDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
