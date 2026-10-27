import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { NewSprRoundDefinition } from "../types/new_spr_round.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./new_spr_round.records0.ts";

export const catalog: CatalogTable<NewSprRoundDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
