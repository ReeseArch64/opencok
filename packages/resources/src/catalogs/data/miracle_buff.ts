import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { MiracleBuffDefinition } from "../types/miracle_buff.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./miracle_buff.records0.ts";

export const catalog: CatalogTable<MiracleBuffDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
