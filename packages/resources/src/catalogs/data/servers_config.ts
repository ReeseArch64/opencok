import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ServersConfigDefinition } from "../types/servers_config.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./servers_config.records0.ts";

export const catalog: CatalogTable<ServersConfigDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
