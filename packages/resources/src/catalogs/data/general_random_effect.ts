import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralRandomEffectDefinition } from "../types/general_random_effect.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general_random_effect.records0.ts";
import { records as records1 } from "./general_random_effect.records1.ts";
import { records as records2 } from "./general_random_effect.records2.ts";
import { records as records3 } from "./general_random_effect.records3.ts";
export const catalog: CatalogTable<GeneralRandomEffectDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0, ...records1, ...records2, ...records3],
  "sections": [{ "id": "general_random_effect", "start": 0, "count": 2878 }],
};
