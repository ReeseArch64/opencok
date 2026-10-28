import { eventRealmEnabled, versionAtLeast, type RuleContext } from "./availability.ts";
import type { Rules } from "./game.ts";
import { javaFloat } from "./java-float.ts";
import { javaDecimal } from "./java-integer.ts";

export interface Cn1SessionState
{
    readonly isAddict: number;
    readonly onlineLastTime: number;
}

function sessionInteger(value: number): number
{
    if (!Number.isInteger(value) || value < -2147483648 || value > 2147483647)
    {
        throw new Error("Invalid CN1 session integer");
    }

    return value;
}

export function cn1RewardRatio(
    state: Cn1SessionState | null,
    rules: Rules,
    context: Pick<RuleContext, "version" | "kingdomId" | "testServer">,
): number
{
    if (state === null || sessionInteger(state.isAddict) === 0)
    {
        return 1;
    }

    const control = rules.configuration.payControl?.get("69036");

    if (!control || !Object.keys(control).length)
    {
        return 1;
    }

    if (!versionAtLeast(context.version, control.k1!))
    {
        return 1;
    }

    if (
        context.testServer
            ? control.k72 !== "1" || control.k107 !== "1"
            : !eventRealmEnabled(control.k2, context.kingdomId)
    )
    {
        return 1;
    }

    const elapsed = sessionInteger(state.onlineLastTime);
    const bands = control.k3;

    if (typeof bands !== "string" || bands.length > 65535)
    {
        throw new Error("Invalid CN1 reward bands");
    }

    let maximum = 0;
    let ratio = 1;

    for (const record of bands.split("|").filter(Boolean))
    {
        const parts = record.split(",").filter(Boolean);
        const threshold = Number(javaDecimal(parts[0], 32));
        maximum = Math.max(maximum, threshold);

        if (elapsed < threshold)
        {
            ratio = javaFloat(parts[1]);
            break;
        }
    }

    return elapsed > maximum ? 0 : ratio;
}
