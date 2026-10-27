import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralRandomNumDefinition } from "@opencok/hero/resources/catalogs/types/general_random_num";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general_random_num.records0.ts";
import { records as records1 } from "./general_random_num.records1.ts";
import { records as records2 } from "./general_random_num.records2.ts";
import { records as records3 } from "./general_random_num.records3.ts";
import { records as records4 } from "./general_random_num.records4.ts";
import { records as records5 } from "./general_random_num.records5.ts";
import { records as records6 } from "./general_random_num.records6.ts";
import { records as records7 } from "./general_random_num.records7.ts";
import { records as records8 } from "./general_random_num.records8.ts";
import { records as records9 } from "./general_random_num.records9.ts";
import { records as records10 } from "./general_random_num.records10.ts";
import { records as records11 } from "./general_random_num.records11.ts";
import { records as records12 } from "./general_random_num.records12.ts";
import { records as records13 } from "./general_random_num.records13.ts";
import { records as records14 } from "./general_random_num.records14.ts";

export const catalog: CatalogTable<GeneralRandomNumDefinition> = {
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
  "sections": [{ "id": "general_random_num", "start": 0, "count": 10545 }],
};
