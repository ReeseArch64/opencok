import { sfs, type Fields } from "@opencok/messages/sfs";
import type { RewardPreview } from "@opencok/contracts/rewards";
import type { Rule } from "@opencok/rules/game";
import {
    closedActivitiesSchema,
    catalogRewardSchema,
} from "@opencok/validations/local-activity-info";
import { validateFields } from "./validation";
import { rewardPreviewArray } from "./rewards";

export function closedActivities(ids: readonly string[]): Fields
{
    return validateFields(closedActivitiesSchema, {
        act_close: sfs.array(
            ids.map((id) => sfs.object({ id: sfs.string(id), close: sfs.string("1") })),
        ),
    });
}

export function catalogRewardView(
    id: string,
    rule: Rule,
    rewards: readonly RewardPreview[],
): Fields
{
    const raw: Fields = {};

    if (rule.item?.trim())
    {
        raw.item = sfs.string(rule.item);
        raw.num = sfs.string(rule.num ?? "");
    }

    for (const key of ["wood", "food", "iron", "stone", "gold", "prestige"] as const)
    {
        if (rule[key] !== undefined)
        {
            raw[key] = sfs.string(rule[key]);
        }
    }

    return validateFields(catalogRewardSchema, {
        award: rewardPreviewArray(rewards),
        rewardId: sfs.string(id),
        reward_list: sfs.object(raw),
    });
}
