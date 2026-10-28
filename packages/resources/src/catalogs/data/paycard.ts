import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { PaycardDefinition } from "../types/paycard.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./paycard.records0.ts";

export const catalog: CatalogTable<PaycardDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
