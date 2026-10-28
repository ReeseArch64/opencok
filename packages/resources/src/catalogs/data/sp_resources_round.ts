import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SpResourcesRoundDefinition } from "../types/sp_resources_round.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./sp_resources_round.records0.ts";

export const catalog: CatalogTable<SpResourcesRoundDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
