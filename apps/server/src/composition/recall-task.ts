import { RecallTaskDomain } from "@opencok/tasks/services/recall-task";
import { RecallTaskMapper } from "@opencok/tasks/mappings/recall-task";
import type { RecallTaskRuntime } from "@opencok/tasks/contracts/recall-runtime";
import type { CityProgressionContext } from "@opencok/city/services/context";
import type { Rules } from "@opencok/rules/game";
import { text, num, long } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import {
    regionalRecallBand,
    regionalRecallEligible,
    regionalRecallFailure,
} from "@opencok/rules/regional-recall";
import { eventTimestamp } from "@opencok/rules/local-events";
import { serverFeature } from "@opencok/rules/power-context";
import { previewRewards } from "@opencok/rules/rewards";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import {
    pinProgressionReward,
    grantNativeProgressionReward,
} from "@opencok/services/progression-rewards";
import { applyProgressionStatus } from "@opencok/services/player-effects";

export function createRealmRecallTaskDomain()
{
    const runtime: RecallTaskRuntime<Rules, CityProgressionContext> = {
        text,
        num,
        long,
        cityInteger,
        regionalRecallBand,
        regionalRecallEligible,
        regionalRecallFailure,
        eventTimestamp,
        serverFeature,
        pinProgressionReward,
        grantNativeProgressionReward,
        applyProgressionStatus,
        previewRewards,
        rewardPreviewArray,
    };

    return new RecallTaskDomain(runtime, new RecallTaskMapper());
}

export const { recordRecallTask } = createRealmRecallTaskDomain();
