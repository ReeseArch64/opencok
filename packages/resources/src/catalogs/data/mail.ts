import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { MailDefinition } from "../types/mail.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./mail.records0.ts";
import { records as records1 } from "./mail.records1.ts";

export const catalog: CatalogTable<MailDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0, ...records1],
  "sections": [],
};
