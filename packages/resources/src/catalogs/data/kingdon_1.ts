import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { Kingdon1Definition } from "../types/kingdon_1.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./kingdon_1.records0.ts";

export const catalog: CatalogTable<Kingdon1Definition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": 1, "start": 0, "count": 1 }],
};
