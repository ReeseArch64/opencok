import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { LandingDefinition } from "../types/landing.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./landing.records0.ts";

export const catalog: CatalogTable<LandingDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "landing", "start": 0, "count": 20 }],
};
