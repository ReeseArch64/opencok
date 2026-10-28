import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { VoteServerDefinition } from "../types/vote_server.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./vote_server.records0.ts";

export const catalog: CatalogTable<VoteServerDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
