import { and, eq, gte, lt, sql } from "drizzle-orm";
import { continued_cost_period as periods } from "@opencok/drizzle/schema/opencok_kingdom/continued_cost_period";
import { continued_cost_closure as closures } from "@opencok/drizzle/schema/opencok_kingdom/continued_cost_closure";
import { continued_cost_score as scores } from "@opencok/drizzle/schema/opencok_kingdom/continued_cost_score";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { nickname_change } from "@opencok/drizzle/schema/opencok_kingdom/nickname_change";
import { costScoreSnapshot, costScoreDigest } from "@opencok/rules/continued-cost-finality";
import { costRankingPeriodId } from "@opencok/rules/continued-cost-ranking";
import { cityInteger } from "@opencok/rules/city-progression";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";
import { pendingOwnedProgression } from "./progression-finality";
import type { CostFinalityOwned } from "@opencok/contracts/continued-cost-finality";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export { createCostFinalityShared } from "./continued-cost-finality-global";

export function createCostFinalityOwned(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
): CostFinalityOwned
{
    return {
        seal(period, now)
        {
            return db.transaction(async (tx) => {
                await tx.execute(sql`set local lock_timeout='1s'`);
                await fenceRealmTransaction(tx, authority, "update");

                if (
                    period.id !== costRankingPeriodId(period.startTime, period.endTime, period.type)
                    || !period.expectedRealms.includes(authority.kingdomId)
                    || now < period.endTime + 300000n
                )
                {
                    throw new Error("Premature or foreign consumption closure");
                }

                const [prior] = await tx
                    .select()
                    .from(closures)
                    .where(eq(closures.periodId, period.id))
                    .for("update");

                if (prior)
                {
                    return prior;
                }

                if (await pendingOwnedProgression(tx, authority.kingdomId, period.endTime, now))
                {
                    return;
                }

                const [nickname] = await tx
                    .select({ id: nickname_change.operationId })
                    .from(nickname_change)
                    .where(
                        and(
                            eq(nickname_change.state, "prepared"),
                            gte(nickname_change.createdAt, period.startTime),
                            lt(nickname_change.createdAt, period.endTime),
                            sql`${nickname_change.payment}::jsonb->>'kind'='gold' and ${nickname_change.payment}::jsonb->'pendingEvent'->>'type'='continuedcost.spend'`,
                        ),
                    )
                    .limit(1);

                if (period.type === 1 && nickname)
                {
                    return;
                }

                await tx
                    .insert(periods)
                    .values({
                        id: period.id,
                        startTime: period.startTime,
                        endTime: period.endTime,
                        type: period.type,
                        createdAt: now,
                    })
                    .onConflictDoNothing();
                const [manifest] = await tx
                    .select()
                    .from(periods)
                    .where(eq(periods.id, period.id))
                    .for("update");

                if (
                    !manifest
                    || manifest.state !== 0
                    || manifest.startTime !== period.startTime
                    || manifest.endTime !== period.endTime
                    || manifest.type !== period.type
                )
                {
                    throw new Error("Conflicting owned consumption manifest");
                }

                const rows = await tx
                    .select({ score: scores, profile: userprofile, hide: user_mixed_info.costHide })
                    .from(scores)
                    .innerJoin(userprofile, eq(userprofile.uid, scores.uid))
                    .leftJoin(user_mixed_info, eq(user_mixed_info.uid, scores.uid))
                    .where(
                        and(
                            eq(scores.periodId, period.id),
                            eq(userprofile.serverId, authority.kingdomId),
                            sql`coalesce(${userprofile.crossFightSrcServerId},-1)<=0`,
                        ),
                    )
                    .orderBy(sql`${scores.total} desc`, sql`${scores.uid} collate "C"`)
                    .limit(100);
                const values = rows.map(({ score, profile, hide }) => ({
                    uid: score.uid,
                    score: score.total,
                    paid: score.paid,
                    free: score.free,
                    lastAt: score.lastAt,
                    metadata: JSON.stringify({
                        name: profile.name ?? "",
                        pic: profile.pic ?? "",
                        picVer: profile.picVer ?? 0,
                        picfraId: profile.picfraId ?? 0,
                        hideKing: cityInteger(hide ?? 0, 0, 1),
                    }),
                }));
                const [saved] = await tx
                    .insert(closures)
                    .values({
                        periodId: period.id,
                        snapshot: costScoreSnapshot(values),
                        digest: costScoreDigest(values),
                        scoreCount: values.length,
                        createdAt: now,
                    })
                    .returning();
                await tx.update(periods).set({ state: 1 }).where(eq(periods.id, period.id));
                authority.assertReady();

                return saved;
            });
        },
        async acknowledge(period, finalizedAt)
        {
            await db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);
                const [saved] = await tx
                    .select()
                    .from(closures)
                    .where(eq(closures.periodId, period.id))
                    .for("update");

                if (
                    !saved
                    || finalizedAt < period.endTime + 300000n
                    || (saved.finalizedAt !== 0n && saved.finalizedAt !== finalizedAt)
                )
                {
                    throw new Error("Invalid consumption final acknowledgement");
                }

                await tx
                    .update(closures)
                    .set({ phase: 2, finalizedAt })
                    .where(eq(closures.periodId, period.id));
            });
        },
    };
}
