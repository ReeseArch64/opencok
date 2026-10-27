import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { EndowmentDefinition } from "../types/endowment.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./endowment.records0.ts";

export const catalog: CatalogTable<EndowmentDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "endowment", "start": 0, "count": 9 }],
};
