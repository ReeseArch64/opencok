import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralRepeatDefinition } from "../types/general_repeat.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general_repeat.records0.ts";

export const catalog: CatalogTable<GeneralRepeatDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "general_repeat", "start": 0, "count": 654 }],
};
