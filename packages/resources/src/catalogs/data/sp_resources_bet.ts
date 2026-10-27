import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SpResourcesBetDefinition } from "../types/sp_resources_bet.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./sp_resources_bet.records0.ts";

export const catalog: CatalogTable<SpResourcesBetDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
