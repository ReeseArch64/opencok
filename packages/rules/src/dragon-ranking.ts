import type { DragonRankingRange } from "@opencok/contracts/dragon-ranking";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { javaDecimal } from "./java-integer.ts";

function split(value: string, separator: string): string[]
{
    const pieces = value.split(separator);

    while (pieces.at(-1) === "")
    {
        pieces.pop();
    }

    return pieces;
}

export function dragonRankingRanges(value: string): DragonRankingRange[] | undefined
{
    if (typeof value !== "string")
    {
        throw new GameError(errors.invalid);
    }

    if (value === "")
    {
        return undefined;
    }

    const pieces = split(value, ";");

    if (pieces.length >= 35)
    {
        return undefined;
    }

    return pieces.map((piece) => {
        const fields = split(piece, "|");

        try
        {
            const start = Number(javaDecimal(fields[0], 32));
            const limit = Math.min(Number(javaDecimal(fields[1], 32)), 200);

            return { start, end: (start + limit - 1) | 0 };
        }
        catch
        {
            throw new GameError(errors.invalid);
        }
    });
}
