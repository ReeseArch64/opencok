import type { Rules } from "@opencok/rules/game";
import { javaDecimal } from "@opencok/rules/java-integer";
import {
    generalContent,
    generalInteger,
    generalSavedInteger,
    generalSavedLong,
} from "./new-general-content.ts";

export interface NewGeneralPrestige
{
    civilizationType: number | null;
    prestigeValue: bigint | null;
}

export function newGeneralPrestigeLevel(
    civilizationType: number | null,
    prestiges: readonly NewGeneralPrestige[],
    rules: Rules,
): number
{
    if (prestiges.length > 4096)
    {
        throw new Error("Too many saved prestige records");
    }

    const type = generalSavedInteger(civilizationType);
    const selected = prestiges.find((row) => generalSavedInteger(row.civilizationType) === type);

    if (!selected)
    {
        return 0;
    }

    const value = generalSavedLong(selected.prestigeValue);
    const levels = rules.power.prestigeLevelRecords ?? rules.power.prestigeLevels?.values() ?? [];

    for (const rule of levels)
    {
        const points = generalContent(rule.reputation_point, ";").map((raw) =>
            javaDecimal(raw, 64)
        );

        if (
            (points.length === 1 && (points[0]! <= 0n ? value < points[0]! : value >= points[0]!))
            || (points.length === 2 && value >= points[0]! && value < points[1]!)
        )
        {
            return generalInteger(rule.reputation_level);
        }
    }

    return 0;
}
