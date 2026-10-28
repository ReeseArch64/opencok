import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralTalentDefinition } from "@opencok/hero/resources/catalogs/types/general_talent";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general_talent.records0.ts";

export const catalog: CatalogTable<GeneralTalentDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
