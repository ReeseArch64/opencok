import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WagAreaDefinition } from "../types/wag_area.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wag_area.records0.ts";

export const catalog: CatalogTable<WagAreaDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
