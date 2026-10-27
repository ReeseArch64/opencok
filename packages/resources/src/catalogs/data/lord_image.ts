import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { LordImageDefinition } from "../types/lord_image.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./lord_image.records0.ts";

export const catalog: CatalogTable<LordImageDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
