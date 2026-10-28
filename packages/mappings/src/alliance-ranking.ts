import { validateFields } from "@opencok/messages/validations/fields";
import { allianceRankingSchema } from "@opencok/validations/alliance-ranking";
import type {
    AllianceRankingKind,
    AllianceRankingResult,
} from "@opencok/contracts/alliance-ranking";
import { text } from "@opencok/contracts/rows";
import { sfs, type Fields, type Value } from "@opencok/messages/sfs";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { allianceVideo } from "./profile-alliance.ts";

function invalid(): never
{
    throw new GameError(errors.unsupported, "ranking");
}

function modelText(value: string): string
{
    let start = 0;
    let end = value.length;

    while (start < end && value.charCodeAt(start) <= 32)
    {
        start++;
    }

    while (end > start && value.charCodeAt(end - 1) <= 32)
    {
        end--;
    }

    return value.slice(start, end);
}

function integer(value: unknown): bigint
{
    if (typeof value === "number" && !Number.isSafeInteger(value))
    {
        return invalid();
    }

    if (!/^[+-]?\d+$/.test(String(value)))
    {
        return invalid();
    }

    return BigInt(String(value));
}

function int(value: unknown): Value
{
    const number = integer(value);

    if (BigInt.asIntN(32, number) !== number)
    {
        return invalid();
    }

    return sfs.int(Number(number));
}

function count(value: unknown): Value
{
    const number = integer(value);

    if (BigInt.asIntN(64, number) !== number)
    {
        return invalid();
    }

    return BigInt.asIntN(32, number) === number ? sfs.int(Number(number)) : sfs.long(number);
}

function aggregate(value: unknown): Value
{
    const number = Number(integer(value));

    if (!Number.isFinite(number))
    {
        return invalid();
    }

    return Math.abs(number) < 10000000 ? sfs.int(number) : sfs.double(number);
}

function serializeAllianceRanking(
    kind: AllianceRankingKind,
    ranking: AllianceRankingResult,
): Fields
{
    const fields: Fields = {
        allianceRanking: sfs.array(
            ranking.rows.map(({ alliance, maxMember, video }) => {
                const row: Fields = {
                    uid: sfs.string(text(alliance, "uid")),
                    alliancename: sfs.string(modelText(text(alliance, "alliancename"))),
                    abbr: sfs.string(modelText(text(alliance, "abbr"))),
                    curMember: int(alliance.curMember ?? 0),
                    maxMember: int(maxMember),
                    nums: count(alliance.nums),
                };

                if (alliance.leader !== null && alliance.leader !== undefined)
                {
                    row.leader = sfs.string(text(alliance, "leader"));
                }

                if (text(alliance, "icon").trim())
                {
                    row.icon = sfs.string(modelText(text(alliance, "icon")));
                }

                const metric = kind === "power" ? "fightpower" : "armyKill";

                if (alliance[metric] !== null && alliance[metric] !== undefined)
                {
                    row[metric] = aggregate(alliance[metric]);
                }

                if (video)
                {
                    if (video.allianceId !== alliance.uid)
                    {
                        return invalid();
                    }

                    row.allianceVideo = sfs.object(allianceVideo(video));
                }

                return sfs.object(row);
            }),
        ),
    };

    if (ranking.selfRanking !== 0)
    {
        fields.selfRanking = int(ranking.selfRanking);
    }

    return fields;
}

export function allianceRanking(...args: Parameters<typeof serializeAllianceRanking>): Fields
{
    return validateFields(allianceRankingSchema, serializeAllianceRanking(...args));
}
