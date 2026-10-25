import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { HeroactivityDefinition } from "../types/heroactivity.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./heroactivity.records0.ts";
export const catalog: CatalogTable<HeroactivityDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
