import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { Skill2Definition } from "../types/skill2.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./skill2.records0.ts";

export const catalog: CatalogTable<Skill2Definition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": 1, "start": 0, "count": 240 }],
};
