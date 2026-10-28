import { and, eq, lte, sql } from "drizzle-orm";
import { continued_cost_rank_award as awards } from "@opencok/drizzle/schema/opencok_kingdom/continued_cost_rank_award";
import { continued_cost_closure as closures } from "@opencok/drizzle/schema/opencok_kingdom/continued_cost_closure";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { costRankAwardId, costRankMail } from "@opencok/rules/continued-cost-rewards";
import { cityInteger } from "@opencok/rules/city-progression";
import { num, text, long } from "@opencok/contracts/rows";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";
import type {
    CostRankAwardReader,
    CostRankAwardStore,
} from "@opencok/contracts/continued-cost-rewards";
import type { MutationTransaction } from "./mutation";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export function costRankAwardReader(tx: MutationTransaction, owner: string): CostRankAwardReader
{
    return {
        async load(id)
        {
            const [row] = await tx
                .select()
                .from(awards)
                .where(and(eq(awards.id, id), eq(awards.ownerUid, owner)))
                .for("update");

            return row;
        },
    };
}

export async function writeCostRankAward(
    tx: MutationTransaction,
    owner: string,
    id: string,
    now: bigint,
)
{
    const [row] = await tx
        .select()
        .from(awards)
        .where(and(eq(awards.id, id), eq(awards.ownerUid, owner), eq(awards.deliveredAt, 0n)))
        .for("update");

    if (!row || row.createdAt > now || id !== costRankAwardId(row.periodId, owner))
    {
        throw new Error("Invalid owned consumption award acknowledgement");
    }

    await tx.update(awards).set({ deliveredAt: now, nextAttemptAt: 0n }).where(eq(awards.id, id));
}

export function createCostRankAwardStore(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
): CostRankAwardStore
{
    let cursor: string | undefined;

    return {
        candidates()
        {
            return db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);
                const rows = await tx
                    .select()
                    .from(closures)
                    .where(
                        and(
                            eq(closures.phase, 2),
                            eq(closures.awardedAt, 0n),
                            cursor
                                ? sql`${closures.periodId} collate "C">${cursor} collate "C"`
                                : undefined,
                        ),
                    )
                    .orderBy(sql`${closures.periodId} collate "C"`)
                    .limit(8);
                cursor = rows.length === 8 ? rows.at(-1)?.periodId : undefined;

                return rows;
            });
        },
        async plan(closure, standing, create, now)
        {
            await db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);
                const [current] = await tx
                        .select()
                        .from(closures)
                        .where(eq(closures.periodId, text(closure, "periodId")))
                        .for("update"),
                    rank = cityInteger(standing.rank, 1, 100),
                    kingdom = cityInteger(standing.kingdomId, 1),
                    uid = text(standing, "uid");

                if (
                    !current
                    || current.phase !== 2
                    || current.awardedAt !== 0n
                    || current.awardCursor !== num(closure, "awardCursor")
                    || rank !== current.awardCursor + 1
                    || now < current.finalizedAt
                    || current.finalizedAt <= 0n
                    || !uid
                    || uid.length > 40
                )
                {
                    throw new Error("Stale consumption reward cursor");
                }

                if (kingdom === authority.kingdomId && create)
                {
                    const [profile] = await tx
                        .select({ uid: userprofile.uid })
                        .from(userprofile)
                        .where(
                            and(
                                eq(userprofile.uid, uid),
                                eq(userprofile.serverId, authority.kingdomId),
                                lte(userprofile.regTime, current.createdAt),
                                sql`coalesce(${userprofile.crossFightSrcServerId},-1)<=0`,
                            ),
                        )
                        .for("share");

                    if (profile)
                    {
                        const id = costRankAwardId(current.periodId, uid),
                            [previous] = await tx.select().from(awards).where(eq(awards.id, id))
                                .limit(1);

                        if (previous)
                        {
                            if (
                                previous.periodId !== current.periodId
                                || previous.ownerUid !== uid
                                || previous.rank !== rank
                            )
                            {
                                throw new Error("Foreign consumption award identity");
                            }
                        }
                        else
                        {
                            const payload = JSON.stringify(create());
                            costRankMail(payload);
                            await tx.insert(awards).values({
                                id,
                                periodId: current.periodId,
                                ownerUid: uid,
                                rank,
                                payload,
                                createdAt: now,
                            });
                        }
                    }
                }

                await tx
                    .update(closures)
                    .set({ awardCursor: rank })
                    .where(eq(closures.periodId, current.periodId));
                authority.assertReady();
            });
        },
        async finished(closure, count, now)
        {
            await db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);
                cityInteger(count, 0, 100);
                const [current] = await tx
                    .select()
                    .from(closures)
                    .where(eq(closures.periodId, text(closure, "periodId")))
                    .for("update");

                if (
                    !current
                    || current.phase !== 2
                    || current.awardedAt !== 0n
                    || current.awardCursor !== count
                    || current.awardCursor !== num(closure, "awardCursor")
                    || now < current.finalizedAt
                    || long(closure, "finalizedAt") !== current.finalizedAt
                )
                {
                    throw new Error("Incomplete consumption ranking awards");
                }

                await tx
                    .update(closures)
                    .set({ awardedAt: now })
                    .where(eq(closures.periodId, current.periodId));
            });
        },
        pending(now)
        {
            return db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);

                return tx
                    .select()
                    .from(awards)
                    .where(and(eq(awards.deliveredAt, 0n), lte(awards.nextAttemptAt, now)))
                    .orderBy(awards.nextAttemptAt, awards.createdAt, awards.id)
                    .limit(64);
            });
        },
        async defer(id, now)
        {
            await db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);
                await tx
                    .update(awards)
                    .set({ nextAttemptAt: now + 60000n })
                    .where(and(eq(awards.id, id), eq(awards.deliveredAt, 0n)));
            });
        },
    };
}
