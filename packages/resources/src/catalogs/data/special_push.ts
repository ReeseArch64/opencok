import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SpecialPushDefinition } from "../types/special_push.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./special_push.records0.ts";

export const catalog: CatalogTable<SpecialPushDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
