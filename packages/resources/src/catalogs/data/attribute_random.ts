import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AttributeRandomDefinition } from "../types/attribute_random.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./attribute_random.records0.ts";

export const catalog: CatalogTable<AttributeRandomDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
