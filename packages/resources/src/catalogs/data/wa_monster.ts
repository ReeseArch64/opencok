import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WaMonsterDefinition } from "../types/wa_monster.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wa_monster.records0.ts";
export const catalog: CatalogTable<WaMonsterDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
