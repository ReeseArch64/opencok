import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { StatusCopyDefinition } from "../types/status - Copy.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./status - Copy.records0.ts";
import { records as records1 } from "./status - Copy.records1.ts";
import { records as records2 } from "./status - Copy.records2.ts";
import { records as records3 } from "./status - Copy.records3.ts";
import { records as records4 } from "./status - Copy.records4.ts";

export const catalog: CatalogTable<StatusCopyDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0, ...records1, ...records2, ...records3, ...records4],
    "sections": [],
    "metadata": { "KSOProductBuildVer": "2052-10.1.0.6207" },
};
