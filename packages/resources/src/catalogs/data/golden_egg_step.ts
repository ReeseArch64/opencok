import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GoldenEggStepDefinition } from "../types/golden_egg_step.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./golden_egg_step.records0.ts";
export const catalog: CatalogTable<GoldenEggStepDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "golden_egg_step", "start": 0, "count": 1 }],
};
