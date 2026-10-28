import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { PfCheckDefinition } from "../types/pf_check.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./pf_check.records0.ts";

export const catalog: CatalogTable<PfCheckDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "pf_check", "start": 0, "count": 35 }],
};
