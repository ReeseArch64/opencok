import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { alliance_science } from "@opencok/drizzle/schema/opencok_kingdom/alliance_science";
import { alliance_vedio } from "@opencok/drizzle/schema/opencok_kingdom/alliance_vedio";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { eq, gt, inArray, sql, sum } from "drizzle-orm";
import type {
    AllianceRankingQuery,
    AllianceRankingSnapshot,
} from "@opencok/contracts/alliance-ranking";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export function readAllianceRanking(
    db: DatabaseClient<"kingdom">,
    uid: string,
    query: AllianceRankingQuery,
): Promise<AllianceRankingSnapshot>
{
    if (
        !uid.trim()
        || uid.length > 40
        || !["power", "kills"].includes(query.kind)
        || !Number.isInteger(query.limit)
        || query.limit < 1
        || query.limit > 32767
        || !Number.isSafeInteger(query.now)
    )
    {
        throw new Error("Invalid alliance ranking query");
    }

    return db.transaction(
        async (tx) => {
            const profile = (
                await tx
                    .select({
                        uid: userprofile.uid,
                        serverId: userprofile.serverId,
                        banTime: userprofile.banTime,
                        banFlag: userprofile.banFlag,
                        allianceId: userprofile.allianceId,
                    })
                    .from(userprofile)
                    .where(eq(userprofile.uid, uid))
                    .limit(1)
            )[0];
            const empty = { profile, candidates: [], sciences: [], videos: [], fallbackRank: 1n };

            if (
                !profile || (profile.banFlag ?? 0) !== 0
                || (profile.banTime ?? 0n) > BigInt(query.now)
            )
            {
                return empty;
            }

            const metric = query.kind === "power" ? playerinfo.power : playerinfo.armyKill;
            const members = tx
                .select({
                    allianceId: alliance_member.allianceId,
                    score: sum(metric).as("member_score"),
                    nums: sql<string>`count(*)::text`.as("member_count"),
                })
                .from(alliance_member)
                .innerJoin(playerinfo, eq(playerinfo.uid, alliance_member.uid))
                .groupBy(alliance_member.allianceId)
                .as("ranking_members");
            const leaders = tx
                .select({
                    allianceId: alliance_member.allianceId,
                    uid: userprofile.uid,
                    name: userprofile.name,
                })
                .from(alliance_member)
                .innerJoin(userprofile, eq(userprofile.uid, alliance_member.uid))
                .where(eq(alliance_member.rank, 5))
                .as("ranking_leaders");
            const score = query.kind === "power"
                ? sql<
                    string
                >`${members.score} + (select coalesce(sum(${alliance_science.power}), 0) from ${alliance_science} where ${alliance_science.allianceId} = ${alliance.uid})`
                : sql<string>`${members.score}`;
            const candidates = await tx
                .select({
                    uid: alliance.uid,
                    alliancename: alliance.alliancename,
                    abbr: alliance.abbr,
                    icon: alliance.icon,
                    curMember: alliance.curMember,
                    maxMember: alliance.maxMember,
                    ckfThroneFightFlag: alliance.ckfThroneFightFlag,
                    score: score.mapWith(String),
                    nums: members.nums,
                    leaderUid: leaders.uid,
                    leader: leaders.name,
                })
                .from(alliance)
                .innerJoin(members, eq(members.allianceId, alliance.uid))
                .innerJoin(leaders, eq(leaders.allianceId, alliance.uid))
                .where(eq(alliance.ckfThroneFightFlag, 0))
                .orderBy(
                    sql`${score} desc nulls last`,
                    sql`${alliance.curMember} asc nulls first`,
                    sql`${alliance.uid} collate "C" asc`,
                    sql`${leaders.uid} collate "C" asc`,
                )
                .limit(query.limit * 2 - (query.kind === "power" ? 1 : 0));
            let fallbackRank = 1n;

            if (profile.allianceId?.trim())
            {
                const own = tx
                    .select({ score: members.score })
                    .from(members)
                    .innerJoin(alliance, eq(alliance.uid, members.allianceId))
                    .where(eq(members.allianceId, profile.allianceId));
                const counts = await tx
                    .select({ rank: sql<string>`(count(*) + 1)::text`.mapWith(BigInt) })
                    .from(members)
                    .innerJoin(alliance, eq(alliance.uid, members.allianceId))
                    .where(gt(members.score, own));

                if (counts.length !== 1)
                {
                    throw new Error("Missing alliance ranking count");
                }

                fallbackRank = counts[0]!.rank;
            }

            const kept = query.kind === "kills" ? candidates.slice(0, -1) : candidates;
            const ids = [...new Set(kept.slice(0, query.limit).map((row) => row.uid))];
            const sciences = ids.length
                ? await tx
                    .select({
                        allianceId: alliance_science.allianceId,
                        scienceId: alliance_science.scienceId,
                        level: alliance_science.level,
                    })
                    .from(alliance_science)
                    .where(inArray(alliance_science.allianceId, ids))
                    .orderBy(
                        sql`${alliance_science.allianceId} collate "C" asc`,
                        alliance_science.scienceId,
                    )
                    .limit(32768)
                : [];

            if (sciences.length > 32767)
            {
                throw new Error("Alliance ranking science collection exceeds limit");
            }

            const videos = ids.length
                ? await tx
                    .select({
                        allianceId: alliance_vedio.allianceId,
                        vedioURL: alliance_vedio.vedioURL,
                        thumbnailURL: alliance_vedio.thumbnailURL,
                        vedioH: alliance_vedio.vedioH,
                        vedioW: alliance_vedio.vedioW,
                        vedioSize: alliance_vedio.vedioSize,
                        vedioLength: alliance_vedio.vedioLength,
                        checkSign: alliance_vedio.checkSign,
                    })
                    .from(alliance_vedio)
                    .where(inArray(alliance_vedio.allianceId, ids))
                    .orderBy(sql`${alliance_vedio.allianceId} collate "C" asc`)
                    .limit(ids.length)
                : [];

            return {
                profile,
                candidates: candidates.map(({ score, ...row }) => ({
                    ...row,
                    [query.kind === "power" ? "fightpower" : "armyKill"]: score,
                })),
                fallbackRank,
                sciences,
                videos,
            };
        },
        { isolationLevel: "repeatable read", accessMode: "read only" },
    );
}
