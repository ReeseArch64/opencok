import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ResdentialDefinition } from "../types/resdential.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./resdential.records0.ts";

export const catalog: CatalogTable<ResdentialDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
