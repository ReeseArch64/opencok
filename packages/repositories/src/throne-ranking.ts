import { and, asc, desc, eq, gt, inArray } from "drizzle-orm";
import { fight_king_status } from "@opencok/drizzle/schema/opencok_kingdom/fight_king_status";
import { user_cross_throne } from "@opencok/drizzle/schema/opencok_kingdom/user_cross_throne";
import { server_king_info } from "@opencok/drizzle/schema/opencok_global/server_king_info";
import type { ThroneRankingPeriod, ThroneRankingSnapshot } from "@opencok/contracts/throne-ranking";
import type { Database } from "./game.ts";

export async function readThroneRanking(
    db: Database["kingdom"]["db"],
    global: Database["databases"]["global"]["db"],
    publication?: ThroneRankingPeriod,
): Promise<ThroneRankingSnapshot>
{
    const snapshot = await db.transaction(
        async (tx) => {
            const period = publication
                ?? (
                    await tx
                        .select({ index: fight_king_status.index, info: fight_king_status.info })
                        .from(fight_king_status)
                        .orderBy(desc(fight_king_status.index))
                        .limit(1)
                )[0];

            if (!period)
            {
                return { period: undefined, rows: [] };
            }

            if (
                !Number.isInteger(period.index)
                || period.index < 1
                || period.index > 2147483647
                || typeof period.info !== "string"
                || period.info.length > 8192
            )
            {
                throw new Error("Invalid throne period");
            }

            const rows = await tx
                .select({
                    id: user_cross_throne.id,
                    uid: user_cross_throne.uid,
                    totalKills: user_cross_throne.totalKills,
                    totalDeads: user_cross_throne.totalDeads,
                    name: user_cross_throne.name,
                    allianceName: user_cross_throne.allianceName,
                    abbr: user_cross_throne.abbr,
                    serverId: user_cross_throne.serverId,
                })
                .from(user_cross_throne)
                .where(
                    and(
                        eq(user_cross_throne.kingdomFightIndex, period.index),
                        gt(user_cross_throne.serverId, 0),
                    ),
                )
                .orderBy(desc(user_cross_throne.totalKills), asc(user_cross_throne.id))
                .limit(32768);

            if (rows.length > 32767)
            {
                throw new Error("Oversized throne ranking");
            }

            return { period: { index: period.index, info: period.info }, rows };
        },
        { isolationLevel: "repeatable read", accessMode: "read only" },
    );
    const ids = [...new Set(snapshot.rows.slice(0, 19).map((row) => row.serverId!))];
    const names = ids.length
        ? await global
            .select({ id: server_king_info.Id, name: server_king_info.name })
            .from(server_king_info)
            .where(inArray(server_king_info.Id, ids))
        : [];

    return {
        ...snapshot,
        rows: snapshot.rows.map((row) => ({
            ...row,
            kingdomName: names.find((entry) => entry.id === row.serverId)?.name ?? "",
        })),
    };
}
