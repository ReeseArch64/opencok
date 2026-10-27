import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { MagicRushDefinition } from "../types/magic_rush.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./magic_rush.records0.ts";

export const catalog: CatalogTable<MagicRushDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "magic_rush", "start": 0, "count": 1 }],
};
