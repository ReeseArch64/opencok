import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import type { Rules } from "./game.ts";
import { javaDecimal } from "./java-integer.ts";

export function favoriteInteger(value: unknown): value is number
{
    return (
        typeof value === "number"
        && Number.isInteger(value)
        && value >= -2147483648
        && value <= 2147483647
    );
}

export function favoriteName(value: unknown): value is string
{
    if (
        typeof value !== "string"
        || value.length > 255
        || !value.isWellFormed()
        || /[\0\b\f\n\r\t"\\/\u2600-\u27bf]|[\u{10000}-\u{10ffff}]/u.test(value)
    )
    {
        return false;
    }

    let depth = 0;

    for (const char of value)
    {
        if (char === "{")
        {
            depth++;
        }

        if (char === "}" && --depth < 0)
        {
            return false;
        }
    }

    return depth === 0;
}

export function favoriteServer(server: number | undefined, local: number, rules: Rules): number
{
    if (server === undefined)
    {
        return local;
    }

    if (!favoriteInteger(server))
    {
        throw new GameError(errors.invalid);
    }

    let maximum = -2147483648;

    try
    {
        for (const entry of rules.profile.servers?.values() ?? [])
        {
            if (entry.test === "true" || entry.id === undefined)
            {
                continue;
            }

            maximum = Math.max(maximum, Number(javaDecimal(entry.id, 32)));
        }
    }
    catch
    {
        throw new GameError(errors.unsupported, "world_favorite_catalog");
    }

    if (server > maximum)
    {
        throw new GameError(errors.invalid);
    }

    return server;
}

export function favoriteServerType(server: number, stored: number | undefined): number
{
    if (!favoriteInteger(server) || (stored !== undefined && !favoriteInteger(stored)))
    {
        throw new GameError(errors.invalid);
    }

    if (server <= 999999)
    {
        for (
            const [normal, test] of [
                [2, 4],
                [3, 5],
                [7, 8],
                [9, 10],
                [11, 12],
                [13, 14],
                [15, 16],
                [21, 22],
            ]
        )
        {
            if (stored === normal || stored === test)
            {
                return normal!;
            }
        }
    }

    return [1, 6, 4, 5, 8, 10, 12, 14, 16, 18].includes(stored ?? 0) ? 1 : 0;
}
