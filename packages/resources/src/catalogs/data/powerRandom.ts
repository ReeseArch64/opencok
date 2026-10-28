import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { PowerRandomDefinition } from "../types/powerRandom.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./powerRandom.records0.ts";

export const catalog: CatalogTable<PowerRandomDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
