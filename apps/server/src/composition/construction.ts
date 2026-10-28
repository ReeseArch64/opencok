import { ConstructionDomain } from "@opencok/building/services/construction";
import type { CityProgressionContext } from "@opencok/city/services/context";
import type { Rules } from "@opencok/rules/game";
import { text, num, long } from "@opencok/contracts/rows";
import {
    cityInteger,
    cityLevel,
    cityDuration,
    reducedCityCost,
    cityAssets,
    cityPrestige,
    cityUnlockCount,
    progressionActivityData,
} from "@opencok/rules/city-progression";
import { idleDeadline } from "@opencok/rules/timed-activity";
import { building } from "@opencok/mappings/city";
import { previewRewards } from "@opencok/rules/rewards";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { refreshPrayerBuilding } from "@opencok/services/prayer";
import { recordTargetTask } from "./target-task";
import { enrollCastleLevel } from "@opencok/services/castle-level-event";
import { recordExpeditionScore } from "@opencok/services/new-expedition";

export function createRealmConstructionDomain()
{
    return new ConstructionDomain<Rules, CityProgressionContext>({
        text,
        num,
        long,
        cityInteger,
        cityLevel,
        cityDuration,
        reducedCityCost,
        cityAssets,
        progressionActivityData,
        idleDeadline,
        building,
        previewRewards,
        rewardPreviewArray,
        refreshPrayerBuilding,
        recordTargetTask,
        enrollCastleLevel,
        recordExpeditionScore,
        prestige: (context) => cityPrestige(context.state, context.rules),
        cityUnlockCount: (context, type) => cityUnlockCount(context.state, context.rules, type),
    });
}
