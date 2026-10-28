import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DianjiRewardDefinition } from "../types/dianji_reward.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./dianji_reward.records0.ts";

export const catalog: CatalogTable<DianjiRewardDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
