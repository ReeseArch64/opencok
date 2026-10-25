import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { RewardDefinition } from "../types/reward.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./reward.records0.ts";
import { records as records1 } from "./reward.records1.ts";
import { records as records2 } from "./reward.records2.ts";
import { records as records3 } from "./reward.records3.ts";
import { records as records4 } from "./reward.records4.ts";
import { records as records5 } from "./reward.records5.ts";
import { records as records6 } from "./reward.records6.ts";
import { records as records7 } from "./reward.records7.ts";
import { records as records8 } from "./reward.records8.ts";
import { records as records9 } from "./reward.records9.ts";
import { records as records10 } from "./reward.records10.ts";
import { records as records11 } from "./reward.records11.ts";
import { records as records12 } from "./reward.records12.ts";
import { records as records13 } from "./reward.records13.ts";
import { records as records14 } from "./reward.records14.ts";
export const catalog: CatalogTable<RewardDefinition> = {
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
    ...records11,
    ...records12,
    ...records13,
    ...records14,
  ],
  "sections": [],
};
