import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { EquipStrengthDefinition } from "../types/equip_strength.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./equip_strength.records0.ts";

export const catalog: CatalogTable<EquipStrengthDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
