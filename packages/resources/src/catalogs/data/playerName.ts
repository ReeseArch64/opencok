import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { PlayerNameDefinition } from "../types/playerName.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./playerName.records0.ts";
import { records as records1 } from "./playerName.records1.ts";

export const catalog: CatalogTable<PlayerNameDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0, ...records1],
    "sections": [],
};
