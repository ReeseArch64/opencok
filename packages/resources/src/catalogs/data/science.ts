import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ScienceDefinition } from "../types/science.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./science.records0.ts";
import { records as records1 } from "./science.records1.ts";
import { records as records2 } from "./science.records2.ts";
import { records as records3 } from "./science.records3.ts";
import { records as records4 } from "./science.records4.ts";
import { records as records5 } from "./science.records5.ts";

export const catalog: CatalogTable<ScienceDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0, ...records1, ...records2, ...records3, ...records4, ...records5],
    "sections": [],
};
