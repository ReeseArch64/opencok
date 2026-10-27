import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { NotiTimezoneDefinition } from "../types/noti_timezone.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./noti_timezone.records0.ts";

export const catalog: CatalogTable<NotiTimezoneDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
