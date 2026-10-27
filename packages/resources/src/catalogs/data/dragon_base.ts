import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DragonBaseDefinition } from "../types/dragon_base.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./dragon_base.records0.ts";

export const catalog: CatalogTable<DragonBaseDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
