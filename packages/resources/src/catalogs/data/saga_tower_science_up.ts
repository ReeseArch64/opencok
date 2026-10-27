import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SagaTowerScienceUpDefinition } from "../types/saga_tower_science_up.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./saga_tower_science_up.records0.ts";
import { records as records1 } from "./saga_tower_science_up.records1.ts";
import { records as records2 } from "./saga_tower_science_up.records2.ts";
import { records as records3 } from "./saga_tower_science_up.records3.ts";
import { records as records4 } from "./saga_tower_science_up.records4.ts";
import { records as records5 } from "./saga_tower_science_up.records5.ts";
import { records as records6 } from "./saga_tower_science_up.records6.ts";
import { records as records7 } from "./saga_tower_science_up.records7.ts";
import { records as records8 } from "./saga_tower_science_up.records8.ts";
import { records as records9 } from "./saga_tower_science_up.records9.ts";
import { records as records10 } from "./saga_tower_science_up.records10.ts";
import { records as records11 } from "./saga_tower_science_up.records11.ts";
import { records as records12 } from "./saga_tower_science_up.records12.ts";
import { records as records13 } from "./saga_tower_science_up.records13.ts";

export const catalog: CatalogTable<SagaTowerScienceUpDefinition> = {
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
  ],
  "sections": [],
};
