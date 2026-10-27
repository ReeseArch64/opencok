import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DragonTalentExpDefinition } from "../types/dragon_talent_exp.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./dragon_talent_exp.records0.ts";
import { records as records1 } from "./dragon_talent_exp.records1.ts";

export const catalog: CatalogTable<DragonTalentExpDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0, ...records1],
  "sections": [],
};
