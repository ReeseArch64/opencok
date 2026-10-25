import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { EverydayRechargeDefinition } from "../types/everyday_recharge.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./everyday_recharge.records0.ts";
export const catalog: CatalogTable<EverydayRechargeDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
