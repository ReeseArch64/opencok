import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { NewBankDefinition } from "../types/new_bank.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./new_bank.records0.ts";

export const catalog: CatalogTable<NewBankDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
