import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { StorySettingDefinition } from "../types/story_setting.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./story_setting.records0.ts";
export const catalog: CatalogTable<StorySettingDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
