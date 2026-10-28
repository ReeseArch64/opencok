import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralBaseDefinition } from "@opencok/hero/resources/catalogs/types/general_base";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general_base.records0.ts";

export const catalog: CatalogTable<GeneralBaseDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
