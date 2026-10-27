import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { PayServercontrolDefinition } from "../types/pay_servercontrol.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./pay_servercontrol.records0.ts";

export const catalog: CatalogTable<PayServercontrolDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
