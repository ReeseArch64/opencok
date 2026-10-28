import { QuestsDomain } from "@opencok/tasks/services/quests";
import { QuestPolicy } from "@opencok/tasks/rules/progression";
import { QuestMapper } from "@opencok/tasks/mappings/quests";
import type { QuestRuntime } from "@opencok/tasks/contracts/runtime";
import type { CityProgressionContext } from "@opencok/city/services/context";
import type { Rules } from "@opencok/rules/game";
import { text, num, long } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import { createRealmReconnectTaskPolicy, createRealmReconnectTaskCounts } from "./reconnect-tasks";
import { recordTargetTask } from "./target-task";
import { recordCampaignUse } from "@opencok/services/local-campaign";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { idleDeadline } from "@opencok/rules/timed-activity";
import { previewRewards } from "@opencok/rules/rewards";
import { mergeSignInRewards } from "@opencok/rules/merge-campaign";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { EquipmentFactory } from "@opencok/equipment/services/factory";
import { createRealmEquipmentPolicy } from "./equipment";

export function createRealmQuestPolicy()
{
    const { reconnectTaskPlan } = createRealmReconnectTaskPolicy();
    const { reconnectContainsBuildings, reconnectResourceOutput, reconnectTaskInitialCount } =
        createRealmReconnectTaskCounts();

    return new QuestPolicy<Rules>({
        text,
        num,
        long,
        cityInteger,
        reconnectTaskPlan,
        reconnectContainsBuildings,
        reconnectResourceOutput,
        reconnectTaskInitialCount,
    });
}

export function createRealmQuestsDomain()
{
    const { newEquipment } = new EquipmentFactory(createRealmEquipmentPolicy());
    const runtime: QuestRuntime<Rules, CityProgressionContext> = {
        text,
        num,
        long,
        recordTargetTask,
        recordCampaignUse,
        javaMailBytes,
        newEquipment,
        idleDeadline,
        previewRewards,
        mergeSignInRewards,
        rewardPreviewArray,
    };

    return new QuestsDomain(runtime, createRealmQuestPolicy(), new QuestMapper({ text, num }));
}
