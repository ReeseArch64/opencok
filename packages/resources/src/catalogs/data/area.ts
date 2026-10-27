import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AreaDefinition } from "../types/area.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./area.records0.ts";

export const catalog: CatalogTable<AreaDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
