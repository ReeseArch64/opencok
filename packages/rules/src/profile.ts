import type { PublicAllianceState } from "@opencok/contracts/profile";
import type { Rules } from "./game.ts";
import { allianceScienceEffects } from "./power-memberships.ts";
import { invalid, integer, deadline } from "./profile-values.ts";

export function publicAllianceProgress(state: PublicAllianceState, rules: Rules)
{
    const gift = state.alliance.giftlevel;
    const currentlevel = gift === null || gift === undefined
        ? undefined
        : BigInt(Math.floor(integer(gift) / 1000));
    const nextlevel = currentlevel === undefined ? undefined : (currentlevel + 1n) * 1000n;
    const member = deadline(state.totals.member);

    if (member <= 0n)
    {
        return invalid();
    }

    let fightpower: bigint | undefined;

    if (state.totals.fightpower !== null && state.totals.fightpower !== undefined)
    {
        const raw = state.totals.fightpower;

        if (
            (typeof raw === "number" && !Number.isSafeInteger(raw))
            || !/^[+-]?\d+$/.test(String(raw))
        )
        {
            return invalid();
        }

        fightpower = BigInt(String(raw));

        if (!Number.isFinite(Number(fightpower)))
        {
            return invalid();
        }
    }

    const expansion = state.withEffects
        ? (allianceScienceEffects(state.sciences, rules).get(500) ?? 0)
        : 0;
    const add = Math.max(-2147483648, Math.min(2147483647, Math.trunc(expansion)));
    const maximum = state.alliance.maxMember;
    const maxMember = maximum === null || maximum === undefined
        ? undefined
        : Number(BigInt.asIntN(32, BigInt(integer(maximum)) + BigInt(add)));

    return { currentlevel, nextlevel, member, fightpower, maxMember };
}
