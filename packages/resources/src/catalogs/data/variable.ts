import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { VariableCatalog } from "../../catalog-model.ts";
export const catalog: VariableCatalog = {
  "kind": CatalogKind.Variables,
  "connection": { "address": "tcp -h 10.1.6.242", "port": 10000 },
  "variables": [
    { "scope": "p", "id": "lucky_rate", "initialValue": 0 },
    { "scope": "s", "id": "Lucky", "initialValue": 10 },
    { "scope": "s", "id": "lreward", "initialValue": 100 },
    { "scope": "f", "id": "reward_all", "initialValue": 10000 },
    { "scope": "f", "id": "lottory_num", "initialValue": 0 },
    { "scope": "f", "id": "lottory_gold", "initialValue": 0 },
  ],
};
