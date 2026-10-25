import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WagMonsterDefinition } from "../types/wag_monster.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wag_monster.records0.ts";
export const catalog: CatalogTable<WagMonsterDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
