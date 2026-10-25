import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ServertransferDefinition } from "../types/servertransfer.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./servertransfer.records0.ts";
export const catalog: CatalogTable<ServertransferDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
