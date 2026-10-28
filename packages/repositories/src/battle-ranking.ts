import { and, asc, eq, gt } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { server_info as globalServer } from "@opencok/drizzle/schema/opencok_global/server_info";
import { ob_user } from "@opencok/drizzle/schema/opencok_kingdom/ob_user";
import { ob_record } from "@opencok/drizzle/schema/opencok_kingdom/ob_record";
import type { BattleRankingState } from "@opencok/contracts/battle-ranking";
import type { Database } from "./game.ts";

export async function readBattleRankingState(
    db: Database["kingdom"]["db"],
    global: Database["databases"]["global"]["db"],
    uid: string,
    realm: number,
    now: number,
): Promise<BattleRankingState>
{
    if (!uid || uid.length > 40 || !Number.isSafeInteger(now))
    {
        throw new Error("Invalid battle ranking owner");
    }

    const realmType = realm > 999999
        ? 0
        : ((
            await global
                .select({ type: globalServer.type })
                .from(globalServer)
                .where(eq(globalServer.id, realm))
                .limit(1)
        )[0]?.type ?? 0);

    return db.transaction(
        async (tx) => {
            const profile = (
                await tx
                    .select({
                        uid: userprofile.uid,
                        allianceId: userprofile.allianceId,
                        serverId: userprofile.serverId,
                        banFlag: userprofile.banFlag,
                        banTime: userprofile.banTime,
                    })
                    .from(userprofile)
                    .where(eq(userprofile.uid, uid))
                    .limit(1)
            )[0];

            if (!profile)
            {
                return { profile, realmType, openedAt: 0n, observerTeam: undefined, tickets: [] };
            }

            const openedAt = (
                await tx
                    .select({ time: server_info.activityTime })
                    .from(server_info)
                    .where(eq(server_info.uid, "server"))
                    .limit(1)
            )[0]?.time ?? 0n;
            const observer = (
                await tx
                    .select({ param: ob_user.param1 })
                    .from(ob_user)
                    .where(eq(ob_user.uid, uid))
                    .limit(1)
            )[0];
            const records = await tx
                .select({ alliances: ob_record.allianceIds })
                .from(ob_record)
                .where(and(eq(ob_record.uid, uid), gt(ob_record.begin, BigInt(now) - 7200000n)))
                .orderBy(asc(ob_record.allianceIds))
                .limit(32768);

            if (records.length > 32767)
            {
                throw new Error("Invalid observer tickets");
            }

            return {
                profile,
                realmType,
                openedAt,
                observerTeam: observer ? ((observer.param ?? "").split(",")[0] ?? "") : undefined,
                tickets: [
                    ...new Set(records.flatMap((row) => row.alliances.split(",").slice(0, 2))),
                ],
            };
        },
        { isolationLevel: "repeatable read", accessMode: "read only" },
    );
}
