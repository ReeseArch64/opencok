import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { TimeGiftDefinition } from "../types/time_gift.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./time_gift.records0.ts";
export const catalog: CatalogTable<TimeGiftDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
