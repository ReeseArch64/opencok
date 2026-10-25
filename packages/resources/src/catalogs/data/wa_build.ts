import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WaBuildDefinition } from "../types/wa_build.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wa_build.records0.ts";
export const catalog: CatalogTable<WaBuildDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
