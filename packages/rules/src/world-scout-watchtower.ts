import type { Row } from "@opencok/contracts/rows";
import { num, long } from "@opencok/contracts/rows";
import type { Rules } from "./game";
import { legacyPlayerVersionAtLeast, type RuleContext } from "./availability";
import { serverFeature } from "./power-context";
import { cityInteger } from "./city-progression";

export function scoutWatchtowerValues(rules: Rules, tower: Row | undefined, context: RuleContext)
{
    if (
        !tower
        || !serverFeature(rules, "glory_watchtower", context)
        || !legacyPlayerVersionAtLeast(
            context.version,
            rules.features.get("glory_watchtower")?.version,
        )
        || num(tower, "progress") < 0
    )
    {
        return { speed: 0, cooldown: undefined, ready: false };
    }

    const definition = rules.building(
        "417000",
        num(tower, "level"),
        num(tower, "star"),
        num(tower, "progress"),
    );
    const step = definition.clientParameters?.[2]?.steps?.find(
        (row) => row.progress === num(tower, "progress"),
    );
    const values = step?.value.split("_");
    const speed = values?.[0] === undefined ? 0 : cityInteger(values[0]);
    const cooldown = values?.[1] === undefined ? undefined : cityInteger(values[1]);

    return {
        speed,
        cooldown,
        ready: num(tower, "star") >= 4
            && cooldown !== undefined
            && long(tower, "effectTime") + BigInt(cooldown) * 1000n <= BigInt(context.now),
    };
}
