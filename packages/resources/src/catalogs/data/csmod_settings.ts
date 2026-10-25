import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { CsmodSettingsDefinition } from "../types/csmod_settings.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./csmod_settings.records0.ts";
export const catalog: CatalogTable<CsmodSettingsDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
