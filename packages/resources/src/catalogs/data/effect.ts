import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { EffectDefinition } from "../types/effect.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./effect.records0.ts";

export const catalog: CatalogTable<EffectDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
