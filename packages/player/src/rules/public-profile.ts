import type { PublicProfileState } from "../contracts/public-profile.ts";
import { text } from "@opencok/contracts/rows";
import type { RuleContext } from "@opencok/rules/availability";
import type { Rules } from "@opencok/rules/game";
import { serverFeature } from "@opencok/rules/power-context";
import { invalid, integer, deadline } from "@opencok/rules/profile-values";

export function publicProfileSocial(state: PublicProfileState, kingdomId: number)
{
    if (integer(kingdomId) <= 0)
    {
        return invalid();
    }

    const flowerVal = state.flowers
        ? Number(
            BigInt.asIntN(
                32,
                BigInt(integer(state.flowers.flowerVal)) - BigInt(integer(state.flowers.eggVal)),
            ),
        )
        : 0;
    let officer: string | undefined;

    if (state.office)
    {
        const positionId = text(state.office, "positionId");
        const ready = positionId === "216000000"
            && integer(state.office.serverId ?? 0) === kingdomId;

        if (!ready)
        {
            const ordinal = integer(positionId) % 100;

            if (ordinal >= 0 && ordinal <= 16)
            {
                officer = String(216000 + ordinal);
            }
        }
    }

    return { flowerVal, officer };
}

export function publicProfileProgress(
    state: PublicProfileState,
    rules: Rules,
    context: RuleContext,
    profileKingdomId = context.kingdomId,
)
{
    if (!state.profile || !Number.isSafeInteger(context.now))
    {
        return invalid();
    }

    if (context.kingdomId !== rules.kingdomId || context.kingdomId <= 0)
    {
        return invalid();
    }

    integer(context.kingdomId);

    if (integer(profileKingdomId) <= 0)
    {
        return invalid();
    }

    const level = integer(state.profile.level ?? 0);
    const roleId = String(Number(BigInt.asIntN(32, 100100n + BigInt(level))));
    const maxExp = integer(rules.roles.get(roleId)?.player_exp);
    let vip = 0;
    const vipEndTime = deadline(state.vip?.vipEndTime ?? 0);

    if (state.vip && vipEndTime > BigInt(context.now))
    {
        if (!rules.power.vip?.size)
        {
            return invalid();
        }

        const score = integer(state.vip.score ?? 0);
        let selected: string | undefined;

        for (const rule of rules.power.vip.values())
        {
            if (integer(rule.point) <= score)
            {
                selected = rule.id;
            }
        }

        if (selected !== undefined)
        {
            vip = (integer(selected) % 100) + 1;
        }
    }

    const count = state.completedAchievements;
    const total = rules.profile.achievementCount ?? 0;

    if (
        ![count, total].every((value) =>
            Number.isInteger(value) && value >= 0 && value <= 2147483647
        )
    )
    {
        return invalid();
    }

    const achieveNum = total === 0 ? 1 : Math.fround(Math.fround(count) / Math.fround(total));
    const rank = integer(state.military?.militaryRank ?? 0);
    const armedLevel = rank > 0
        ? integer(rules.profile.militaryRanks?.get(String(rank))?.level)
        : 1;

    if (state.taverns.length > 1)
    {
        return invalid();
    }

    const market = integer(state.taverns[0]?.level ?? 0) === 0 ? 0 : 1;

    return {
        maxExp,
        vip,
        vipEndTime: Number(BigInt.asIntN(32, vipEndTime / 1000n)),
        achieveNum,
        armedLevel,
        market,
        serverName: rules.profile.servers?.get(String(profileKingdomId))?.name ?? "",
        equipmentStrengthen: serverFeature(rules, "equipment_strengthen", context),
    };
}
