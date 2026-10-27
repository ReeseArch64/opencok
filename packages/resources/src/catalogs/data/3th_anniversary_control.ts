import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { Catalog3thAnniversaryControlDefinition } from "../types/3th_anniversary_control.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./3th_anniversary_control.records0.ts";

export const catalog: CatalogTable<Catalog3thAnniversaryControlDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
