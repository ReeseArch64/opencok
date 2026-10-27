import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AllianceTeleportDefinition } from "../types/alliance_teleport.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./alliance_teleport.records0.ts";

export const catalog: CatalogTable<AllianceTeleportDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
