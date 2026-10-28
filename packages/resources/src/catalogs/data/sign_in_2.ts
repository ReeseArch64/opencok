import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SignIn2Definition } from "../types/sign_in_2.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./sign_in_2.records0.ts";

export const catalog: CatalogTable<SignIn2Definition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
