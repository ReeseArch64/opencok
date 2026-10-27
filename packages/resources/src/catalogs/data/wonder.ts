import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WonderDefinition } from "../types/wonder.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wonder.records0.ts";

export const catalog: CatalogTable<WonderDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
