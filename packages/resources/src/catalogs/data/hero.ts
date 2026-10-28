import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { HeroDefinition } from "@opencok/hero/resources/catalogs/types/hero";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./hero.records0.ts";

export const catalog: CatalogTable<HeroDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
