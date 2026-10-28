import { nickname_change } from "@opencok/drizzle/schema/opencok_kingdom/nickname_change";
import type { CostNicknamePaymentDecoder } from "@opencok/contracts/continued-cost-ranking";
import { and, eq, isNull, isNotNull, or, sql } from "drizzle-orm";
import { continued_cost_fact as facts } from "@opencok/drizzle/schema/opencok_kingdom/continued_cost_fact";
import { continued_cost_period as periods } from "@opencok/drizzle/schema/opencok_kingdom/continued_cost_period";
import { continued_cost_score as scores } from "@opencok/drizzle/schema/opencok_kingdom/continued_cost_score";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { captureCostFact } from "./continued-cost-facts";
import { cityInteger } from "@opencok/rules/city-progression";
import type { CostRankingFacts } from "@opencok/contracts/continued-cost-ranking";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export { createCostRankingRegistry } from "./continued-cost-ranking-global";

export function createCostRankingFacts(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
    nicknameChangePayment: CostNicknamePaymentDecoder,
): CostRankingFacts
{
    let caughtUp = false;

    return {
        ingest(now)
        {
            return db
                .transaction(async (tx) => {
                    await tx.execute(sql`set local lock_timeout='1s'`);
                    await fenceRealmTransaction(tx, authority);

                    if (caughtUp)
                    {
                        return 0;
                    }

                    await tx.execute(
                        sql`select pg_advisory_xact_lock(728229,${authority.kingdomId})`,
                    );
                    const pending = await tx
                        .select({
                            event: mutation_outbox,
                            receipt: command_receipt.requestId,
                            nickname: nickname_change,
                        })
                        .from(mutation_outbox)
                        .leftJoin(
                            command_receipt,
                            and(
                                eq(command_receipt.kingdomId, mutation_outbox.kingdomId),
                                eq(command_receipt.ownerUid, mutation_outbox.ownerUid),
                                eq(command_receipt.requestId, mutation_outbox.requestId),
                            ),
                        )
                        .leftJoin(
                            nickname_change,
                            and(
                                eq(nickname_change.ownerUid, mutation_outbox.ownerUid),
                                eq(nickname_change.state, "committed"),
                                sql`${mutation_outbox.requestId}='nickname:'||${nickname_change.operationId}`,
                            ),
                        )
                        .leftJoin(
                            facts,
                            and(
                                eq(facts.ownerUid, mutation_outbox.ownerUid),
                                eq(facts.requestId, mutation_outbox.requestId),
                                eq(facts.eventId, mutation_outbox.eventId),
                            ),
                        )
                        .where(
                            and(
                                eq(mutation_outbox.kingdomId, authority.kingdomId),
                                eq(mutation_outbox.eventType, "continuedcost.spend"),
                                isNull(facts.ownerUid),
                                or(
                                    isNotNull(command_receipt.requestId),
                                    isNotNull(nickname_change.operationId),
                                ),
                            ),
                        )
                        .orderBy(
                            mutation_outbox.createdAt,
                            sql`${mutation_outbox.ownerUid} collate "C"`,
                            sql`${mutation_outbox.requestId} collate "C"`,
                            sql`${mutation_outbox.eventId} collate "C"`,
                        )
                        .limit(64);

                    for (const { event, nickname, receipt } of pending)
                    {
                        if (receipt)
                        {
                            await captureCostFact(tx, event, now);
                        }
                        else
                        {
                            if (!nickname)
                            {
                                throw new Error("Missing confirmed nickname consumption witness");
                            }

                            const payment = nicknameChangePayment(nickname);

                            if (
                                payment.kind !== "gold"
                                || !payment.pendingEvent
                                || payment.pendingEvent.id !== event.eventId
                                || payment.pendingEvent.type !== event.eventType
                                || !Buffer.from(payment.pendingEvent.payload, "base64").equals(
                                    event.payload,
                                )
                            )
                            {
                                throw new Error(
                                    "Conflicting confirmed nickname consumption witness",
                                );
                            }

                            await captureCostFact(
                                tx,
                                event,
                                now,
                                Object.entries(payment.before)
                                    .filter(
                                        ([key, before]) =>
                                            before
                                                !== payment
                                                    .after[key as keyof typeof payment.after],
                                    )
                                    .map(([key, before]) => ({
                                        accountUid: event.ownerUid,
                                        asset: `profile.${key}`,
                                        before: BigInt(before),
                                        after: BigInt(
                                            payment.after[key as keyof typeof payment.after],
                                        ),
                                    })),
                            );
                        }
                    }

                    authority.assertReady();

                    return pending.length;
                })
                .then((count) => {
                    if (count < 64)
                    {
                        caughtUp = true;
                    }

                    return count;
                });
        },
        periods(cursor)
        {
            return db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);

                return tx
                    .select()
                    .from(periods)
                    .where(
                        cursor ? sql`${periods.id} collate "C">${cursor} collate "C"` : undefined,
                    )
                    .orderBy(sql`${periods.id} collate "C"`)
                    .limit(8);
            });
        },
        top(period)
        {
            return db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);
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

                return rows.map((row) => ({
                    uid: row.score.uid,
                    score: row.score.total,
                    paid: row.score.paid,
                    free: row.score.free,
                    lastAt: row.score.lastAt,
                    metadata: JSON.stringify({
                        name: row.profile.name ?? "",
                        pic: row.profile.pic ?? "",
                        picVer: row.profile.picVer ?? 0,
                        picfraId: row.profile.picfraId ?? 0,
                        hideKing: cityInteger(row.hide ?? 0, 0, 1),
                    }),
                }));
            });
        },
    };
}
