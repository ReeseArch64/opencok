import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WagReTeamDefinition } from "../types/wag_re_team.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wag_re_team.records0.ts";

export const catalog: CatalogTable<WagReTeamDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
