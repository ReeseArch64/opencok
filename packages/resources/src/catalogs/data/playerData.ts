import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { PlayerDataDefinition } from "../types/playerData.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./playerData.records0.ts";

export const catalog: CatalogTable<PlayerDataDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
