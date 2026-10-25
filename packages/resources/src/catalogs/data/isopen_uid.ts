import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { IsopenUidDefinition } from "../types/isopen_uid.ts";
import type { CatalogTable } from "../../catalog-model.ts";
export const catalog: CatalogTable<IsopenUidDefinition> = {
  "kind": CatalogKind.Table,
  "records": [],
  "sections": [{ "id": "exchange", "start": 0, "count": 0 }],
};
