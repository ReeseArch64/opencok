import type { Rules } from "./game.ts";
import { javaDecimal } from "./java-integer.ts";
import { javaIntHashMapOrder } from "./java-hash-map-order.ts";

export function militaryRankingGroup(rules: Rules, realm: number): number
{
    if (!rules.ranking.militaryGroups)
    {
        throw new Error("Missing military ranking groups");
    }

    const groups = new Map<number, string>();

    for (const [id, rule] of rules.ranking.militaryGroups)
    {
        groups.set(Number(javaDecimal(id, 32)), rule.sever ?? "");
    }

    for (const id of javaIntHashMapOrder(groups.keys()))
    {
        const entries = groups.get(id)!.split(";").filter(Boolean);

        if (entries.length > 4096)
        {
            throw new Error("Oversized military group");
        }

        for (const entry of entries)
        {
            const parts = entry.split("-");

            if (parts.length === 1)
            {
                if (Number(javaDecimal(entry, 32)) === realm)
                {
                    return id;
                }
            }
            else if (parts.length === 2)
            {
                const first = Number(javaDecimal(parts[0]!, 32)),
                    last = Number(javaDecimal(parts[1]!, 32));

                if (realm >= first && realm <= last)
                {
                    return id;
                }
            }
            else
            {
                throw new Error("Invalid military realm range");
            }
        }
    }

    return 0;
}
