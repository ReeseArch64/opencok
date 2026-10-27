import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WrSeverDefinition } from "../types/wr_sever.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wr_sever.records0.ts";

export const catalog: CatalogTable<WrSeverDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
