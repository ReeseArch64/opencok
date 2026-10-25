import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SingleChargeDefinition } from "../types/single_charge.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./single_charge.records0.ts";
export const catalog: CatalogTable<SingleChargeDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
