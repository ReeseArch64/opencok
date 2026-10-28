import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralAwakenChallengeRewardDefinition } from "@opencok/hero/resources/catalogs/types/general_awaken_challenge_reward";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general_awaken_challenge_reward.records0.ts";
import { records as records1 } from "./general_awaken_challenge_reward.records1.ts";

export const catalog: CatalogTable<GeneralAwakenChallengeRewardDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0, ...records1],
    "sections": [
        { "id": "general_awaken_challenge_reward", "start": 0, "count": 800 },
        { "id": "general_skill_inherit", "start": 800, "count": 16 },
        { "id": "general_awaken_challenge_buff", "start": 816, "count": 20 },
    ],
};
