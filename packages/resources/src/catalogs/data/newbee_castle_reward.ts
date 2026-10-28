import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { NewbeeCastleRewardDefinition } from "../types/newbee_castle_reward.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./newbee_castle_reward.records0.ts";

export const catalog: CatalogTable<NewbeeCastleRewardDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
