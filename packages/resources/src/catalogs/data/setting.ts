import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SettingDefinition } from "../types/setting.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./setting.records0.ts";

export const catalog: CatalogTable<SettingDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
