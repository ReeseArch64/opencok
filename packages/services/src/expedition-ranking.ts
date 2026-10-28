import type {
    ExpeditionRankingEntry,
    ExpeditionRankingCandidate,
} from "@opencok/contracts/expedition-ranking";
import type { Row } from "@opencok/contracts/rows";
import { decodeStoredJson } from "@opencok/messages/stored-json";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

export function decodeExpeditionRanking(
    entries: readonly ExpeditionRankingEntry[] | undefined,
): ExpeditionRankingCandidate[] | undefined
{
    if (entries === undefined)
    {
        return undefined;
    }

    if (entries.length > 32767)
    {
        throw new GameError(errors.unsupported, "ranking");
    }

    let bytes = 0;

    return entries.map(({ uid, score, info }) => {
        if (info === null)
        {
            return { uid, score, profile: undefined };
        }

        if (typeof info !== "string")
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const data = Buffer.from(info);
        bytes += data.length;

        if (data.length > 65535 || bytes > 1048576)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        if (!info.trim())
        {
            return { uid, score, profile: undefined };
        }

        const parsed = decodeStoredJson(data);

        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const object = parsed as Record<string, unknown>;
        const profile: Row = {};

        for (const key of ["name", "pic", "abbr"])
        {
            if (typeof object[key] === "string")
            {
                profile[key] = object[key];
            }
            else
            {
                throw new GameError(errors.unsupported, "ranking");
            }
        }

        for (const key of ["power", "picVer", "serverId"])
        {
            if (typeof object[key] === "bigint")
            {
                profile[key] = object[key];
            }
            else
            {
                throw new GameError(errors.unsupported, "ranking");
            }
        }

        return { uid, score, profile };
    });
}
