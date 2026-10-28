import { validateFields } from "@opencok/messages/validations/fields";
import { playerStatisticsSchema, powerInfoSchema } from "@opencok/validations/power";

import type { PlayerPower } from "@opencok/contracts/power";
import type { Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { sfs, type Fields } from "@opencok/messages/sfs";
import type { Rules } from "@opencok/rules/game";

function signed(value: unknown, bits: 32 | 64): bigint
{
    if (value === undefined || value === null)
    {
        return 0n;
    }

    if (typeof value === "number" && !Number.isSafeInteger(value))
    {
        throw new GameError(errors.unsupported, "power_rule");
    }

    if (!/^[+-]?\d+$/.test(String(value)))
    {
        throw new GameError(errors.unsupported, "power_rule");
    }

    const parsed = BigInt(String(value));

    if (BigInt.asIntN(bits, parsed) !== parsed)
    {
        throw new GameError(errors.unsupported, "power_rule");
    }

    return parsed;
}

function serializePlayerStatistics(statistics: Row | undefined): Fields
{
    const fields: Fields = {};

    for (
        const [wire, column] of Object.entries({
            battleWin: "battlesWin",
            battleLose: "battlesLose",
            attackWin: "attacksWin",
            attackLose: "attacksLose",
            defenseWin: "defensesWin",
            detectNum: "detectNum",
            armyDead: "armyDead",
            armyCure: "armyCure",
            cityDes: "cityDestroyed",
        })
    )
    {
        fields[wire] = sfs.int(Number(signed(statistics?.[column], 32)));
    }

    fields.armyKill = sfs.long(signed(statistics?.armyKill, 64));

    return fields;
}

function serializePowerInfo(
    statistics: Row | undefined,
    power: PlayerPower,
    upload: Row | undefined,
    rules: Rules,
): Fields
{
    const fields = playerStatistics(statistics);

    for (
        const key of [
            "playerPower",
            "heroPower",
            "buildingPower",
            "sciencePower",
            "civilizationSciencePower",
            "questpower",
            "equipPower",
            "knight_title",
            "sagatower_science",
        ] as const
    )
    {
        fields[key] = sfs.int(Number(signed(power[key], 32)));
    }

    for (const key of ["armyPower", "fortPower", "petDragonPower", "prinessPower"] as const)
    {
        fields[key] = sfs.long(signed(power[key], 64));
    }

    let nextUpdateTime = 0n;

    if (upload)
    {
        const seconds = rules.items.get("hero")?.k7;

        if (seconds === undefined)
        {
            throw new GameError(errors.unsupported, "power_rule");
        }

        nextUpdateTime = BigInt.asIntN(
            64,
            signed(upload.updateTime, 64) + signed(seconds, 64) * 1000n,
        );
    }

    fields.nextUpdateTime = sfs.long(nextUpdateTime);
    fields.banTime = sfs.long(signed(upload?.banTime, 64));
    fields.banCount = sfs.int(Number(signed(upload?.banCount, 32)));

    return fields;
}

export function playerStatistics(...args: Parameters<typeof serializePlayerStatistics>): Fields
{
    return validateFields(playerStatisticsSchema, serializePlayerStatistics(...args));
}

export function powerInfo(...args: Parameters<typeof serializePowerInfo>): Fields
{
    return validateFields(powerInfoSchema, serializePowerInfo(...args));
}
