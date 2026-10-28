import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DefeatNoticeDefinition } from "../types/defeatNotice.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./defeatNotice.records0.ts";

export const catalog: CatalogTable<DefeatNoticeDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
