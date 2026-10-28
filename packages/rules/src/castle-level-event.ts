import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { RuleContext } from "./availability";
import { localEventControlOpen } from "./local-events";
import type { Rules, Rule } from "./game";
import { cityInteger } from "./city-progression";

export function castleEventFailure(): never
{
    throw new GameError(errors.invalid, "city_progression");
}

export function castleEventOpen(rules: Rules, context: RuleContext): boolean
{
    return localEventControlOpen(rules, "69024", context);
}

export function castleEventMailWindow(rule: Rule, opened: bigint, now: bigint): boolean
{
    const days = (rule.activity_Type ?? "")
        .split("|")
        .map((part) => part.split(";"))
        .find((part) => part[0] === "1")?.[1];

    return (
        days !== undefined && now >= opened && now - opened <= BigInt(cityInteger(days)) * 86400000n
    );
}

export function castleEventShard(owner: string): number
{
    const prefix = owner.slice(0, -6);

    if (/^\d+$/.test(prefix))
    {
        return Number(BigInt(prefix) % 2n);
    }

    let hash = 0;

    for (let i = 0; i < owner.length; i++)
    {
        hash = (Math.imul(hash, 31) + owner.charCodeAt(i)) | 0;
    }

    return hash & 1;
}
