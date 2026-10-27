import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WrTroopsPointDefinition } from "../types/wr_troops_point.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wr_troops_point.records0.ts";

export const catalog: CatalogTable<WrTroopsPointDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
