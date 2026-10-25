import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { LuckyEggDefinition } from "../types/lucky_egg.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./lucky_egg.records0.ts";
export const catalog: CatalogTable<LuckyEggDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
