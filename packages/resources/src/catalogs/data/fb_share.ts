import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { FbShareDefinition } from "../types/fb_share.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./fb_share.records0.ts";

export const catalog: CatalogTable<FbShareDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
