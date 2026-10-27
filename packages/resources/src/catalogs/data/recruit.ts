import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { RecruitDefinition } from "../types/recruit.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./recruit.records0.ts";

export const catalog: CatalogTable<RecruitDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
