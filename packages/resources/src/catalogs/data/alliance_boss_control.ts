import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AllianceBossControlDefinition } from "../types/alliance_boss_control.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./alliance_boss_control.records0.ts";
export const catalog: CatalogTable<AllianceBossControlDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
