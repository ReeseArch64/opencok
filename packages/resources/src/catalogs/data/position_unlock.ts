import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { PositionUnlockDefinition } from "../types/position_unlock.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./position_unlock.records0.ts";
export const catalog: CatalogTable<PositionUnlockDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
