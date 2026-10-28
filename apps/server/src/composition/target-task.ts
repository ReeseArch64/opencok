import { TargetTaskDomain } from "@opencok/tasks/services/target-task";
import { TargetTaskPolicy } from "@opencok/tasks/rules/target-task";
import { TargetTaskMapper } from "@opencok/tasks/mappings/target-task";
import { TargetTaskPaymentIdentity } from "@opencok/tasks/rules/target-payment";
import type { TargetTaskRuntime } from "@opencok/tasks/contracts/target-runtime";
import type { CityProgressionContext } from "@opencok/city/services/context";
import type { Rules } from "@opencok/rules/game";
import { text, num, long } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import { serverFeature } from "@opencok/rules/power-context";
import { recordRecallTask } from "@opencok/services/recall-task";
import {
    pinProgressionReward,
    grantNativeProgressionReward,
} from "@opencok/services/progression-rewards";
import { mailRewardEntries } from "@opencok/rules/mail-rewards";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { previewRewards } from "@opencok/rules/rewards";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import type { TargetTaskPaymentGateway } from "@opencok/tasks/contracts/target-task";
import { randomInt } from "node:crypto";

export function createRealmTargetTaskPolicy()
{
    return new TargetTaskPolicy<Rules>({ cityInteger });
}

export function createRealmTargetTaskDomain(
    gateway?: TargetTaskPaymentGateway,
    random: (maximum: number) => number = randomInt,
)
{
    const runtime: TargetTaskRuntime<Rules, CityProgressionContext> = {
        text,
        num,
        long,
        cityInteger,
        serverFeature,
        recordRecallTask,
        pinProgressionReward,
        grantNativeProgressionReward,
        mailRewardEntries,
        javaMailBytes,
        previewRewards,
        rewardPreviewArray,
    };

    return new TargetTaskDomain(
        runtime,
        createRealmTargetTaskPolicy(),
        new TargetTaskMapper(),
        new TargetTaskPaymentIdentity(),
        gateway,
        random,
    );
}

export const { recordTargetTask } = createRealmTargetTaskDomain();
