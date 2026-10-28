import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { CharactersDefinition } from "../types/characters.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./characters.records0.ts";

export const catalog: CatalogTable<CharactersDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
