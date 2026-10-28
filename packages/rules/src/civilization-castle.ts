import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { num, long, type Row } from "@opencok/contracts/rows";
import type { Rules } from "./game";
import { cityInteger } from "./city-progression";

export function castleFailure(): never
{
    throw new GameError(errors.locked, "city_progression");
}

export function castleRule(rules: Rules, level: number)
{
    const rule = [...(rules.advanced.civilizationFortress?.values() ?? [])].find(
        (entry) => Number(entry.level) === level,
    );

    if (!rule)
    {
        throw new GameError(errors.unsupported, "city_progression");
    }

    return rule;
}

export function settleCastle(rules: Rules, before: Row, now: bigint): Row
{
    const row = { ...before };
    const rule = castleRule(rules, num(row, "level") || 1);

    if (num(row, "status") === 1 && long(row, "buildTime") <= now)
    {
        row.status = 2;
        row.lastOutputTime = long(row, "buildTime");
    }

    if (num(row, "status") === 2)
    {
        const interval = BigInt(cityInteger(rules.items.get("civilization_fortress")?.k2, 1))
            * 1000n;
        const elapsed = now - long(row, "lastOutputTime");

        if (elapsed < 0n)
        {
            castleFailure();
        }

        const ticks = elapsed / interval;
        const output = Number(rule.basic_output ?? 0);

        if (!Number.isFinite(output) || output < 0)
        {
            castleFailure();
        }

        row.resourceNum = Math.min(
            cityInteger(rule.storage_ceiling),
            Number(row.resourceNum ?? 0) + Number(ticks) * output,
        );
        row.lastOutputTime = long(row, "lastOutputTime") + ticks * interval;
    }

    if (long(row, "lastRefreshDataTime") / 86400000n !== now / 86400000n)
    {
        row.robCount = 0;
        row.beRobNum = 0;
        row.lastRefreshDataTime = now;
    }

    return row;
}
