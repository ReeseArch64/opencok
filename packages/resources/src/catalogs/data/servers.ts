import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ServersDefinition } from "../types/servers.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./servers.records0.ts";

export const catalog: CatalogTable<ServersDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": 1, "start": 0, "count": 1 }],
};
