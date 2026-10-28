import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SignInDefinition } from "../types/sign_in.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./sign_in.records0.ts";

export const catalog: CatalogTable<SignInDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
