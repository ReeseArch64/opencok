import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GoldenRouletteDefinition } from "../types/golden_roulette.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./golden_roulette.records0.ts";

export const catalog: CatalogTable<GoldenRouletteDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
