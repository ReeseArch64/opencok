import { num, type Row } from "@opencok/contracts/rows";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { eventTimestamp } from "./local-events";
import type { Rules, Rule } from "./game";

export function closedActivityPanels(profile: Row, rules: Rules, now: bigint): readonly string[]
{
    if (num(profile, "crossFightSrcServerId") > 0)
    {
        return [];
    }

    return [...(rules.power.activityPanels?.values() ?? [])]
        .filter((rule) => {
            if (rule.function_on === "0" || rule.close !== "1")
            {
                return false;
            }

            if (rule.start === undefined && rule.end === undefined)
            {
                return true;
            }

            const start = eventTimestamp(rule.start),
                end = eventTimestamp(rule.end);

            return start !== undefined && end !== undefined && end >= start && now >= start
                && now <= end;
        })
        .map((rule) => rule.id!);
}

export function catalogReward(rules: Rules, id: string): Rule
{
    const rule = rules.reconnect.rewards?.get(id);

    if (!rule || !id || id.length > 40)
    {
        throw new GameError(errors.invalid, "reward_preview");
    }

    return rule;
}
