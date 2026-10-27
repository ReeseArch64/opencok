import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { CargoDefinition } from "../types/cargo.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./cargo.records0.ts";

export const catalog: CatalogTable<CargoDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
