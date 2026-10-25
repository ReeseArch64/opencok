import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ArmyUpBaseDefinition } from "../types/army_up_base.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./army_up_base.records0.ts";
export const catalog: CatalogTable<ArmyUpBaseDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "army_up_base", "start": 0, "count": 16 }],
};
