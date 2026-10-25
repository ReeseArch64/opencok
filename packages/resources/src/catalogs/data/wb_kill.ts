import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WbKillDefinition } from "../types/wb_kill.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wb_kill.records0.ts";
export const catalog: CatalogTable<WbKillDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
