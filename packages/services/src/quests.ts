import { QuestsDomain } from "@opencok/tasks/services/quests";
import { QuestPolicy } from "@opencok/tasks/rules/progression";
import { QuestMapper } from "@opencok/tasks/mappings/quests";
import type { QuestRuntime } from "@opencok/tasks/contracts/runtime";
import type { CityProgressionContext } from "./city-progression-context";
import type { Rules } from "@opencok/rules/game";
import { text, num, long } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import { reconnectTaskPlan } from "@opencok/rules/reconnect-tasks";
import {
    reconnectContainsBuildings,
    reconnectResourceOutput,
    reconnectTaskInitialCount,
} from "@opencok/rules/reconnect-task-counts";
import { recordTargetTask } from "@opencok/services/target-task";
import { recordCampaignUse } from "@opencok/services/local-campaign";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { idleDeadline } from "@opencok/rules/timed-activity";
import { previewRewards } from "@opencok/rules/rewards";
import { mergeSignInRewards } from "@opencok/rules/merge-campaign";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { newEquipment } from "./equipment";

const policy = new QuestPolicy<Rules>({
    text,
    num,
    long,
    cityInteger,
    reconnectTaskPlan,
    reconnectContainsBuildings,
    reconnectResourceOutput,
    reconnectTaskInitialCount,
});
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
const domain = new QuestsDomain(runtime, policy, new QuestMapper({ text, num }));

export const { grantRewards, refreshQuests } = domain;
