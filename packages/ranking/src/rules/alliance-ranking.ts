import type {
    AllianceRankingKind,
    AllianceRankingQuery,
    AllianceRankingSnapshot,
    AllianceRankingResult,
} from "../contracts/alliance-ranking";
import { text, type Row } from "../contracts/rows";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { AllianceScienceEffects } from "../contracts/runtime";
import type { RankingCatalog } from "../contracts/runtime";

function invalid(): never
{
    throw new GameError(errors.unsupported, "ranking");
}

function integer(value: unknown): number
{
    if (!/^[+-]?\d+$/.test(String(value)))
    {
        return invalid();
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed < -2147483648 || parsed > 2147483647)
    {
        return invalid();
    }

    return parsed;
}

export function allianceRankingQuery(
    kind: AllianceRankingKind,
    rules: Pick<RankingCatalog, "items">,
    now: number,
): AllianceRankingQuery
{
    const limit = integer(rules.items.get("ranking")?.k1);

    if (limit < 1 || limit > 32767 || !Number.isSafeInteger(now))
    {
        return invalid();
    }

    return { kind, limit, now };
}

export function selectAllianceRanking(
    query: AllianceRankingQuery,
    snapshot: AllianceRankingSnapshot,
    allianceScienceEffects: AllianceScienceEffects,
): AllianceRankingResult
{
    if (
        snapshot.fallbackRank < 1n
        || snapshot.fallbackRank > 9223372036854775807n
        || snapshot.candidates.length > query.limit * 2 - (query.kind === "power" ? 1 : 0)
        || snapshot.sciences.length > 32767
        || snapshot.videos.length > query.limit
    )
    {
        return invalid();
    }

    const candidates = query.kind === "kills"
        ? snapshot.candidates.slice(0, -1)
        : snapshot.candidates;
    const pairs = new Set<string>();
    const positions = new Map<string, number>();
    candidates.forEach((row, index) => {
        const id = text(row, "uid");
        const leader = text(row, "leaderUid");
        const pair = JSON.stringify([id, leader]);

        if (!id.trim() || !leader.trim() || pairs.has(pair))
        {
            return invalid();
        }

        pairs.add(pair);
        positions.set(id, index + 1);
    });
    const display = candidates.slice(0, query.limit);
    const ids = new Set(display.map((row) => text(row, "uid")));
    const sciences = new Map<string, Row[]>();
    const scienceKeys = new Set<string>();

    for (const row of snapshot.sciences)
    {
        const id = text(row, "allianceId");
        const key = JSON.stringify([id, integer(row.scienceId)]);

        if (!ids.has(id) || scienceKeys.has(key))
        {
            return invalid();
        }

        scienceKeys.add(key);
        const records = sciences.get(id) ?? [];
        records.push(row);
        sciences.set(id, records);
    }

    const videos = new Map<string, Row>();

    for (const row of snapshot.videos)
    {
        const id = text(row, "allianceId");

        if (!ids.has(id) || videos.has(id))
        {
            return invalid();
        }

        videos.set(id, row);
    }

    const own = text(snapshot.profile ?? {}, "allianceId");

    return {
        selfRanking: own.trim()
            ? (positions.get(own) ?? Number(BigInt.asIntN(32, snapshot.fallbackRank)))
            : 0,
        rows: display
            .filter(
                (row) =>
                    integer(row.ckfThroneFightFlag ?? 0) !== 1
                    && typeof row.alliancename === "string"
                    && typeof row.abbr === "string",
            )
            .map((alliance) => {
                const id = text(alliance, "uid");
                const expansion = allianceScienceEffects(sciences.get(id) ?? []).get(500)
                    ?? 0;
                const add = Math.max(-2147483648, Math.min(2147483647, Math.trunc(expansion)));
                const maximum = integer(alliance.maxMember ?? 0);

                return {
                    alliance,
                    maxMember: Number(BigInt.asIntN(32, BigInt(maximum) + BigInt(add))),
                    video: videos.get(id),
                };
            }),
    };
}
