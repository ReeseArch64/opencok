import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { NewplayerDefinition } from "../types/newplayer.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./newplayer.records0.ts";
export const catalog: CatalogTable<NewplayerDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "newplayer", "start": 0, "count": 33 }],
};
