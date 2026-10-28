import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ActivityEventDefinition } from "../types/activity_event.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./activity_event.records0.ts";

export const catalog: CatalogTable<ActivityEventDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
