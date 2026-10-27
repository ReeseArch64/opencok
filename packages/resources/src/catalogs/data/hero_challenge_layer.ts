import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { HeroChallengeLayerDefinition } from "../types/hero_challenge_layer.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./hero_challenge_layer.records0.ts";

export const catalog: CatalogTable<HeroChallengeLayerDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
