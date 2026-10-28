import type {
    PlayerRankingKind,
    PlayerRankingQuery,
    PlayerRankingSnapshot,
    PlayerRankingResult,
} from "@opencok/contracts/ranking";
import { text } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import type { Rules } from "./game.ts";

function invalid(): never
{
    throw new GameError(errors.unsupported, "ranking");
}

export function playerRankingQuery(
    kind: PlayerRankingKind,
    rules: Rules,
    now: number,
): PlayerRankingQuery
{
    const raw = rules.items.get("ranking")?.[kind === "contribution" ? "k4" : "k2"];

    if (!raw || !/^[+-]?\d+$/.test(raw) || !Number.isSafeInteger(now))
    {
        return invalid();
    }

    const limit = Number(raw);

    if (!Number.isInteger(limit) || limit < 1 || limit > 32767)
    {
        return invalid();
    }

    return {
        kind,
        limit,
        now,
        hideGm: rules.configuration.serverConfig?.get("power_limit")?.rankingHideGm === "1",
    };
}

export function selectPlayerRanking(
    uid: string,
    query: PlayerRankingQuery,
    snapshot: PlayerRankingSnapshot,
): PlayerRankingResult
{
    if (!uid || snapshot.fallbackRank < 1n || snapshot.fallbackRank > 9223372036854775807n)
    {
        return invalid();
    }

    const multiplier = query.kind === "level" ? 3 : query.kind === "contribution" ? 1 : 2;

    if (snapshot.candidates.length > query.limit * multiplier)
    {
        return invalid();
    }

    const seen = new Set<string>();
    const candidates = snapshot.candidates.filter((row) => {
        const id = text(row, "uid");
        const key = query.kind === "building" ? text(row, "uuid") : id;

        if (!id || !key || seen.has(key))
        {
            return invalid();
        }

        seen.add(key);

        if (row.banTime === null || row.banTime === undefined)
        {
            return query.kind === "building" ? invalid() : true;
        }

        if (typeof row.banTime === "number" && !Number.isSafeInteger(row.banTime))
        {
            return invalid();
        }

        if (!/^[+-]?\d+$/.test(String(row.banTime)))
        {
            return invalid();
        }

        const banTime = BigInt(String(row.banTime));

        if (BigInt.asIntN(64, banTime) !== banTime)
        {
            return invalid();
        }

        return query.kind === "building"
            ? banTime !== 9223372036854775807n
            : banTime <= BigInt(query.now);
    });
    const index = query.kind === "building"
        ? candidates.findLastIndex((row) => row.uid === uid)
        : candidates.findIndex((row) => row.uid === uid);

    return {
        rows: candidates
            .slice(0, query.limit)
            .filter(
                (row) =>
                    query.kind === "building"
                    || (row.profileUid === row.uid
                        && (!text(row, "allianceId").trim() || row.allianceUid === row.allianceId)),
            ),
        selfRanking: index < 0 ? Number(BigInt.asIntN(32, snapshot.fallbackRank)) : index + 1,
    };
}
