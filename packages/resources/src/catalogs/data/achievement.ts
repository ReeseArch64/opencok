import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AchievementDefinition } from "../types/achievement.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./achievement.records0.ts";
export const catalog: CatalogTable<AchievementDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "all", "start": 0, "count": 168 }],
};
