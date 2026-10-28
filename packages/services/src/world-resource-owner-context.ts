import type { WorldResourceOwnerSnapshot } from "@opencok/contracts/world-point-detail";

import type { RuleContext } from "@opencok/rules/availability";

import { ownerText as text } from "./world-resource-owner-values.ts";

export function resourceOwnerRuleContext(
    snapshot: WorldResourceOwnerSnapshot,
    context: Omit<RuleContext, "version">,
): RuleContext
{
    return {
        kingdomId: context.kingdomId,
        now: context.now,
        testServer: context.testServer,
        utcOffsetMinutes: context.utcOffsetMinutes,
        get version()
        {
            return text(snapshot.effects.profile.appVersion, 40) ?? "";
        },
    };
}
