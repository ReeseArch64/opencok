import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { StatusDefinition } from "../types/status.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./status.records0.ts";
import { records as records1 } from "./status.records1.ts";
import { records as records2 } from "./status.records2.ts";
import { records as records3 } from "./status.records3.ts";
import { records as records4 } from "./status.records4.ts";
import { records as records5 } from "./status.records5.ts";
import { records as records6 } from "./status.records6.ts";
import { records as records7 } from "./status.records7.ts";
import { records as records8 } from "./status.records8.ts";
import { records as records9 } from "./status.records9.ts";
import { records as records10 } from "./status.records10.ts";
export const catalog: CatalogTable<StatusDefinition> = {
  "kind": CatalogKind.Table,
  "records": [
    ...records0,
    ...records1,
    ...records2,
    ...records3,
    ...records4,
    ...records5,
    ...records6,
    ...records7,
    ...records8,
    ...records9,
    ...records10,
  ],
  "sections": [],
};
