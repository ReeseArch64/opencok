import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { BoxVipDefinition } from "../types/box_vip.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./box_vip.records0.ts";

export const catalog: CatalogTable<BoxVipDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
