import { validateFields } from "@opencok/messages/validations/fields";
import { playerRankingSchema } from "../validations/ranking";

import type { PlayerRankingKind, PlayerRankingResult } from "../contracts/ranking";
import { text, type Row } from "../contracts/rows";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { sfs, type Fields, type Value } from "@opencok/messages/sfs";

function number(value: unknown, cached: boolean): Value
{
    if (typeof value === "number" && !Number.isSafeInteger(value))
    {
        throw new GameError(errors.unsupported, "ranking");
    }

    if (!/^[+-]?\d+$/.test(String(value)))
    {
        throw new GameError(errors.unsupported, "ranking");
    }

    const parsed = BigInt(String(value));

    if (BigInt.asIntN(64, parsed) !== parsed || (!cached && BigInt.asIntN(32, parsed) !== parsed))
    {
        throw new GameError(errors.unsupported, "ranking");
    }

    return BigInt.asIntN(32, parsed) === parsed ? sfs.int(Number(parsed)) : sfs.long(parsed);
}

function player(row: Row, kind: PlayerRankingKind): Fields
{
    if (kind === "building")
    {
        const result: Fields = {};

        for (const key of ["uid", "name", "pic", "allianceId", "alliancename", "abbr", "icon"])
        {
            if (row[key] !== null && row[key] !== undefined)
            {
                result[key] = sfs.string(text(row, key));
            }
        }

        for (
            const key of [
                "updateTime",
                "level",
                "star",
                "picVer",
                "picfraId",
                "banTime",
                "buildingPower",
            ]
        )
        {
            if (row[key] !== null && row[key] !== undefined)
            {
                result[key] = number(row[key], true);
            }
        }

        return result;
    }

    const result: Fields = {
        uid: sfs.string(text(row, "uid")),
        name: sfs.string(text(row, "name")),
        pic: sfs.string(text(row, "pic")),
        picVer: number(row.picVer ?? 0, false),
    };

    if (kind !== "contribution")
    {
        result.picfraId = number(row.picfraId ?? 0, false);
    }

    for (
        const key of kind === "power"
            ? ["power"]
            : kind === "kills"
            ? ["armyKill"]
            : kind === "contribution"
            ? ["contributeSum"]
            : ["level", "exp", "banTime"]
    )
    {
        if (row[key] !== null && row[key] !== undefined)
        {
            result[key] = number(row[key], true);
        }
    }

    if (text(row, "allianceId").trim())
    {
        for (const key of ["allianceId", "abbr", "alliancename"])
        {
            result[key] = sfs.string(text(row, key));
        }
    }

    return result;
}

function serializePlayerRanking(kind: PlayerRankingKind, ranking: PlayerRankingResult): Fields
{
    return {
        [kind === "contribution" ? "myRanking" : "selfRanking"]: sfs.int(
            kind === "contribution" && ranking.rows.length === 0 ? -1 : ranking.selfRanking,
        ),
        serverRanking: sfs.array(ranking.rows.map((row) => sfs.object(player(row, kind)))),
    };
}

export function playerRanking(...args: Parameters<typeof serializePlayerRanking>): Fields
{
    return validateFields(playerRankingSchema, serializePlayerRanking(...args));
}
