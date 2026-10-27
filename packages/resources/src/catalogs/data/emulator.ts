import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { EmulatorDefinition } from "../types/emulator.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./emulator.records0.ts";

export const catalog: CatalogTable<EmulatorDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
