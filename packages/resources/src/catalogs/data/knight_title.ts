import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { KnightTitleDefinition } from "../types/knight_title.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./knight_title.records0.ts";

export const catalog: CatalogTable<KnightTitleDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
