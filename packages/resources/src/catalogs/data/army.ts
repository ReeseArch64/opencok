import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ArmyDefinition } from "../types/army.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./army.records0.ts";

export const catalog: CatalogTable<ArmyDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
