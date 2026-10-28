import { validateFields } from "./validation.ts";
import { playerSummarySchema, guidePlayerSummarySchema } from "@opencok/validations/players";

import type { PlayerSummary } from "@opencok/contracts/game";
import { long, text, type Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { sfs, type Fields } from "@opencok/messages/sfs";

function integer(row: Row, key: string): number
{
    const value = long(row, key);

    if (value < -2147483648n || value > 2147483647n)
    {
        throw new GameError(errors.unsupported, "player_summary");
    }

    return Number(value);
}

function serializePlayerSummary(
    { data, kingdomId, remote }: PlayerSummary,
    lastUpdateTime: string,
): Fields
{
    const country = text(data, "country");
    const result: Fields = {
        serverId: sfs.int(kingdomId),
        vipEndTime: sfs.int(Number(BigInt.asIntN(32, long(data, "vipEndTime") / 1000n))),
        lastUpdateTime: sfs.string(lastUpdateTime),
        svipLevel: sfs.int(integer(data, "sLevel")),
        flagCountry: sfs.string(/^\d+$/.test(country) ? "" : country.toLowerCase()),
        officer: sfs.string(remote ? "" : text(data, "officer")),
        endTime: sfs.long(long(data, "endTime")),
    };

    for (const key of ["uid", "name", "allianceId", "pic", "abbr"])
    {
        result[key] = sfs.string(text(data, key));
    }

    for (
        const key of [
            "picVer",
            "picfraId",
            "gmFlag",
            "crossFightSrcServerId",
            "rank",
            "sLevel",
            "stateId",
        ]
    )
    {
        result[key] = sfs.int(integer(data, key));
    }

    const vip = integer(data, "vipLevel");
    result.vipLevel = sfs.int(remote && vip === -1 ? 0 : vip);

    if (data.showBanner !== null && data.showBanner !== undefined)
    {
        result.showBanner = sfs.int(
            text(data, "registrationCountry") === "TW" ? 0 : integer(data, "showBanner"),
        );
    }

    return result;
}

function serializeGuidePlayerSummary(): Fields
{
    return {
        serverId: sfs.int(0),
        sLevel: sfs.int(0),
        vipEndTime: sfs.long(0),
        uid: sfs.string("3000002"),
        gmFlag: sfs.int(1),
        pic: sfs.string("guide_player_icon"),
        allianceId: sfs.string(""),
        vipLevel: sfs.int(0),
        rank: sfs.int(0),
        crossFightSrcServerId: sfs.int(-1),
        picVer: sfs.int(0),
        lastUpdateTime: sfs.int(1474375485),
        svipLevel: sfs.int(10),
        name: sfs.string("Agatha"),
        abbr: sfs.string(""),
        style: sfs.string(""),
    };
}

export function playerSummary(...args: Parameters<typeof serializePlayerSummary>): Fields
{
    return validateFields(playerSummarySchema, serializePlayerSummary(...args));
}

export function guidePlayerSummary(
    ...args: Parameters<typeof serializeGuidePlayerSummary>
): Fields
{
    return validateFields(guidePlayerSummarySchema, serializeGuidePlayerSummary(...args));
}
