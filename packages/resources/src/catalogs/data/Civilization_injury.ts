import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { CivilizationInjuryDefinition } from "../types/Civilization_injury.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./Civilization_injury.records0.ts";

export const catalog: CatalogTable<CivilizationInjuryDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
