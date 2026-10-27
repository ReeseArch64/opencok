import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ArmyUpWholeDefinition } from "../types/army_up_whole.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./army_up_whole.records0.ts";

export const catalog: CatalogTable<ArmyUpWholeDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "army_up_whole", "start": 0, "count": 200 }],
};
