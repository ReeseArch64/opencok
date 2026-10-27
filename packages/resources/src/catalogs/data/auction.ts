import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AuctionDefinition } from "../types/auction.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./auction.records0.ts";

export const catalog: CatalogTable<AuctionDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
