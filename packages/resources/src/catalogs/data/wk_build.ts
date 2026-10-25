import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WkBuildDefinition } from "../types/wk_build.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wk_build.records0.ts";
export const catalog: CatalogTable<WkBuildDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
