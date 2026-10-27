import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { EventsDefinition } from "../types/events.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./events.records0.ts";

export const catalog: CatalogTable<EventsDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
