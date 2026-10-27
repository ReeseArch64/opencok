import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { OfficeDefinition } from "../types/office.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./office.records0.ts";

export const catalog: CatalogTable<OfficeDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
