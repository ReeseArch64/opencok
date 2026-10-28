import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { LordImageXmlDefinition } from "../types/lord_image.xml.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./lord_image.xml.records0.ts";

export const catalog: CatalogTable<LordImageXmlDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
