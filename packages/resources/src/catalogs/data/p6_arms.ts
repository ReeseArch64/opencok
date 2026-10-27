import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { P6ArmsDefinition } from "../types/p6_arms.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./p6_arms.records0.ts";
import { records as records1 } from "./p6_arms.records1.ts";
import { records as records2 } from "./p6_arms.records2.ts";
import { records as records3 } from "./p6_arms.records3.ts";
import { records as records4 } from "./p6_arms.records4.ts";
import { records as records5 } from "./p6_arms.records5.ts";
import { records as records6 } from "./p6_arms.records6.ts";
import { records as records7 } from "./p6_arms.records7.ts";
import { records as records8 } from "./p6_arms.records8.ts";
import { records as records9 } from "./p6_arms.records9.ts";
import { records as records10 } from "./p6_arms.records10.ts";

export const catalog: CatalogTable<P6ArmsDefinition> = {
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
