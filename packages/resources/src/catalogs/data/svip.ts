import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SvipDefinition } from "../types/svip.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./svip.records0.ts";

export const catalog: CatalogTable<SvipDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
