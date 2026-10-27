import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { HeroRouletteDefinition } from "../types/hero_roulette.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./hero_roulette.records0.ts";

export const catalog: CatalogTable<HeroRouletteDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "hero_roulette", "start": 0, "count": 4 }],
};
