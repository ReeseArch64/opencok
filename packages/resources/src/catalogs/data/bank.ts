import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { BankDefinition } from "../types/bank.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./bank.records0.ts";
export const catalog: CatalogTable<BankDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "exchange", "start": 0, "count": 1 }],
};
