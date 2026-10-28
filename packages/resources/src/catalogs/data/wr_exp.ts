import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WrExpDefinition } from "../types/wr_exp.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wr_exp.records0.ts";

export const catalog: CatalogTable<WrExpDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
