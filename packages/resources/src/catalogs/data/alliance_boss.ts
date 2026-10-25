import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AllianceBossDefinition } from "../types/alliance_boss.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./alliance_boss.records0.ts";
export const catalog: CatalogTable<AllianceBossDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
