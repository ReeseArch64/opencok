import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ExchangeFieldTypeDefinition } from "../types/exchange_field_type.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./exchange_field_type.records0.ts";

export const catalog: CatalogTable<ExchangeFieldTypeDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "exchange_field_type", "start": 0, "count": 175 }],
};
