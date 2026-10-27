import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GetGeneralDefinition } from "../types/get_general.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./get_general.records0.ts";

export const catalog: CatalogTable<GetGeneralDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
