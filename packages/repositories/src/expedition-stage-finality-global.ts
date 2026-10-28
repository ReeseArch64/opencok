import { and, eq, inArray, sql } from "drizzle-orm";
import { expedition_stage_period as periods } from "@opencok/drizzle/schema/opencok_global/expedition_stage_period";
import { expedition_stage_watermark as marks } from "@opencok/drizzle/schema/opencok_global/expedition_stage_watermark";
import { expedition_score as scores } from "@opencok/drizzle/schema/opencok_global/expedition_score";
import { expedition_calendar } from "@opencok/drizzle/schema/opencok_global/expedition_calendar";
import { expedition_match_realm } from "@opencok/drizzle/schema/opencok_global/expedition_match_realm";
import { expeditionCalendarPhases } from "@opencok/rules/expedition-calendar";
import { long, text, num, type Row } from "@opencok/contracts/rows";
import type {
    ExpeditionStageRegistry,
    ExpeditionStagePeriod,
} from "@opencok/contracts/expedition-stage-finality";
import type { RealmAuthority } from "./realm-authority";
import { expeditionScoreVersion } from "./expedition-score-version";
import type { Database } from "./game";

export function createExpeditionStageRegistry(
    db: Database["databases"]["global"]["db"],
    authority: RealmAuthority,
): ExpeditionStageRegistry
{
    type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
    const markKey = (period: ExpeditionStagePeriod) =>
        and(
            eq(marks.periodId, period.periodId),
            eq(marks.stage, period.stage),
            eq(marks.kingdomId, authority.kingdomId),
        );
    const periodKey = (period: ExpeditionStagePeriod) =>
        and(
            eq(periods.periodId, period.periodId),
            eq(periods.stage, period.stage),
            eq(periods.leader, Math.min(period.kingdomId, period.opponent)),
        );
    const scoreKey = (period: ExpeditionStagePeriod) =>
        and(
            eq(scores.periodId, period.periodId),
            eq(scores.stage, period.stage),
            eq(scores.kingdomId, authority.kingdomId),
        );
    const lock = async (tx: Tx, period: ExpeditionStagePeriod, now: bigint) => {
        authority.assertReady();

        if (
            period.kingdomId !== authority.kingdomId
            || period.opponent === period.kingdomId
            || now < period.endTime + 300000n
        )
        {
            throw new Error("Invalid expedition closure authority");
        }

        await tx.execute(sql`set local lock_timeout='1s'`);
        await tx.execute(sql`set local statement_timeout='3s'`);
        await tx.execute(sql`select pg_advisory_xact_lock(728227,${authority.kingdomId})`);

        return expeditionScoreVersion(tx, authority);
    };
    const pinned = async (tx: Tx, period: ExpeditionStagePeriod, closure: Row) => {
        const [mark] = await tx.select().from(marks).where(markKey(period)).for("update");

        if (
            !mark
            || mark.opponent !== period.opponent
            || mark.digest !== text(closure, "digest")
            || mark.scoreCount !== long(closure, "scoreCount")
            || mark.total !== num(closure, "total")
        )
        {
            throw new Error("Conflicting expedition stage proof");
        }

        return mark;
    };

    return {
        async verify(period)
        {
            authority.assertReady();

            return db.transaction(
                async (tx) => {
                    const [calendar] = await tx
                        .select()
                        .from(expedition_calendar)
                        .where(eq(expedition_calendar.id, period.periodId))
                        .limit(1);

                    if (!calendar)
                    {
                        return false;
                    }

                    const phase = expeditionCalendarPhases(calendar).find(
                        (item) => item.stage === period.stage,
                    );

                    if (
                        phase?.startTime !== period.startTime
                        || phase.endTime !== period.endTime
                        || calendar.endTime !== period.activityEnd
                    )
                    {
                        throw new Error("Conflicting expedition finality schedule");
                    }

                    const cohort = await tx
                        .select()
                        .from(expedition_match_realm)
                        .where(
                            and(
                                eq(expedition_match_realm.periodId, period.periodId),
                                inArray(expedition_match_realm.kingdomId, [
                                    period.kingdomId,
                                    period.opponent,
                                ]),
                            ),
                        );
                    const own = cohort.find((row) => row.kingdomId === period.kingdomId),
                        other = cohort.find((row) => row.kingdomId === period.opponent);

                    return (
                        !!own
                        && !!other
                        && own.matchedAt > 0n
                        && own.matchedAt === other.matchedAt
                        && own.opponent === other.kingdomId
                        && other.opponent === own.kingdomId
                    );
                },
                { isolationLevel: "repeatable read" },
            );
        },
        async begin(period, closure, now)
        {
            await db.transaction(async (tx) => {
                await lock(tx, period, now);
                const [calendar] = await tx
                    .select()
                    .from(expedition_calendar)
                    .where(eq(expedition_calendar.id, period.periodId))
                    .limit(1);
                const phase = calendar
                    && expeditionCalendarPhases(calendar).find((item) =>
                        item.stage === period.stage
                    );

                if (
                    !calendar
                    || phase?.startTime !== period.startTime
                    || phase.endTime !== period.endTime
                    || calendar.endTime !== period.activityEnd
                )
                {
                    throw new Error("Unverified expedition stage schedule");
                }

                const cohort = await tx
                    .select()
                    .from(expedition_match_realm)
                    .where(
                        and(
                            eq(expedition_match_realm.periodId, period.periodId),
                            inArray(expedition_match_realm.kingdomId, [
                                period.kingdomId,
                                period.opponent,
                            ]),
                        ),
                    );
                const own = cohort.find((row) => row.kingdomId === period.kingdomId),
                    other = cohort.find((row) => row.kingdomId === period.opponent);

                if (
                    !own
                    || !other
                    || own.matchedAt <= 0n
                    || other.matchedAt !== own.matchedAt
                    || own.opponent !== other.kingdomId
                    || other.opponent !== own.kingdomId
                )
                {
                    throw new Error("Unverified expedition finality cohort");
                }

                const value = {
                    periodId: period.periodId,
                    stage: period.stage,
                    leader: Math.min(period.kingdomId, period.opponent),
                    opponent: Math.max(period.kingdomId, period.opponent),
                    startTime: period.startTime,
                    endTime: period.endTime,
                    state: 0,
                    createdAt: now,
                    finalizedAt: 0n,
                    winner: 0,
                    ranking: null,
                };
                await tx.insert(periods).values(value).onConflictDoNothing();
                const [saved] = await tx.select().from(periods).where(periodKey(period)).for(
                    "share",
                );

                if (
                    !saved
                    || saved.opponent !== value.opponent
                    || saved.startTime !== value.startTime
                    || saved.endTime !== value.endTime
                )
                {
                    throw new Error("Conflicting expedition finality period");
                }

                const [prior] = await tx.select().from(marks).where(markKey(period)).for("update");

                if (prior)
                {
                    await pinned(tx, period, closure);

                    return;
                }

                if (saved.state !== 0)
                {
                    throw new Error("Final expedition proof is immutable");
                }

                await tx.insert(marks).values({
                    periodId: period.periodId,
                    stage: period.stage,
                    kingdomId: authority.kingdomId,
                    opponent: period.opponent,
                    digest: text(closure, "digest"),
                    scoreCount: long(closure, "scoreCount"),
                    total: num(closure, "total"),
                    state: 0,
                    completedAt: 0n,
                });
                await tx.delete(scores).where(scoreKey(period));
                authority.assertReady();
            });
        },
        async append(period, closure, rows, now)
        {
            await db.transaction(async (tx) => {
                const version = await lock(tx, period, now),
                    mark = await pinned(tx, period, closure);

                if (rows.length > 64)
                {
                    throw new Error("Expedition sealed upload bound exceeded");
                }

                if (mark.state === 1)
                {
                    return;
                }

                for (const row of rows)
                {
                    if (
                        row.periodId !== period.periodId
                        || row.stage !== period.stage
                        || row.kingdomId !== authority.kingdomId
                        || row.opponent !== period.opponent
                        || row.endTime !== period.activityEnd
                        || !Number.isFinite(row.score)
                        || row.score < 0
                    )
                    {
                        throw new Error("Invalid sealed expedition member");
                    }
                }

                if (rows.length)
                {
                    const written = await tx
                        .insert(scores)
                        .values(
                            rows.map((row) => ({
                                ...row,
                                ownerEpoch: version.ownerEpoch,
                                sequence: version.sequence,
                                observedAt: now,
                            })),
                        )
                        .onConflictDoUpdate({
                            target: [scores.periodId, scores.stage, scores.member],
                            set: {
                                allianceId: sql`excluded."allianceId"`,
                                score: sql`excluded.score`,
                                metadata: sql`excluded.metadata`,
                                ownerEpoch: sql`excluded."ownerEpoch"`,
                                sequence: sql`excluded.sequence`,
                                observedAt: sql`excluded."observedAt"`,
                            },
                            setWhere:
                                sql`${scores.kingdomId}=${authority.kingdomId} and ${scores.opponent}=excluded.opponent and ${scores.endTime}=excluded."endTime" and (${scores.ownerEpoch},${scores.sequence})<(excluded."ownerEpoch",excluded.sequence)`,
                        })
                        .returning({ member: scores.member });

                    if (written.length !== rows.length)
                    {
                        throw new Error("Foreign expedition sealed member");
                    }
                }

                authority.assertReady();
            });
        },
        async complete(period, closure, now)
        {
            return db.transaction(async (tx) => {
                await lock(tx, period, now);
                const mark = await pinned(tx, period, closure);

                if (mark.state === 1)
                {
                    return true;
                }

                const result = await tx.execute<{ count: string; digest: string; total: number; }>(
                    sql`select count(*)::text as count,md5(coalesce(string_agg(length(member)::text||':'||member||':'||length("allianceId")::text||':'||"allianceId"||':'||encode(float8send(score),'hex'),'|' order by member collate "C"),'')) as digest,coalesce(sum(score order by member collate "C"),0)::float8 as total from ${scores} where "periodId"=${period.periodId} and stage=${period.stage} and "kingdomId"=${authority.kingdomId}`,
                );
                const proof = result.rows[0]!;

                if (
                    proof.digest !== mark.digest
                    || BigInt(proof.count) !== mark.scoreCount
                    || proof.total !== mark.total
                )
                {
                    await tx.delete(scores).where(scoreKey(period));

                    return false;
                }

                await tx.update(marks).set({ state: 1, completedAt: now }).where(markKey(period));
                authority.assertReady();

                return true;
            });
        },
        async finalize(period, now)
        {
            return db.transaction(async (tx) => {
                await lock(tx, period, now);
                await tx.execute(
                    sql`select pg_advisory_xact_lock(728228,${
                        Math.min(period.kingdomId, period.opponent)
                    })`,
                );
                const [saved] = await tx.select().from(periods).where(periodKey(period)).for(
                    "update",
                );

                if (!saved)
                {
                    throw new Error("Missing expedition finality period");
                }

                if (saved.state === 1)
                {
                    return saved.winner;
                }

                const proofs = await tx
                    .select()
                    .from(marks)
                    .where(
                        and(
                            eq(marks.periodId, period.periodId),
                            eq(marks.stage, period.stage),
                            inArray(marks.kingdomId, [saved.leader, saved.opponent]),
                        ),
                    )
                    .for("share");
                const own = proofs.find((row) => row.kingdomId === saved.leader),
                    other = proofs.find((row) => row.kingdomId === saved.opponent);

                if (
                    !own
                    || !other
                    || own.state !== 1
                    || other.state !== 1
                    || own.opponent !== other.kingdomId
                    || other.opponent !== own.kingdomId
                )
                {
                    return;
                }

                const winner = own.total > other.total ? saved.leader : saved.opponent;
                const top = await tx
                    .select()
                    .from(scores)
                    .where(
                        and(
                            eq(scores.periodId, period.periodId),
                            eq(scores.stage, period.stage),
                            inArray(scores.kingdomId, [saved.leader, saved.opponent]),
                        ),
                    )
                    .orderBy(sql`${scores.score} desc`, sql`${scores.member} collate "C" desc`)
                    .limit(10);
                const ranking = JSON.stringify({
                    totals: [
                        { serverId: own.kingdomId, score: own.total },
                        { serverId: other.kingdomId, score: other.total },
                    ],
                    users: top.map((row) => ({
                        uid: row.member,
                        score: row.score,
                        metadata: row.metadata,
                    })),
                });
                await tx
                    .update(periods)
                    .set({ state: 1, winner, finalizedAt: now, ranking })
                    .where(periodKey(period));
                authority.assertReady();

                return winner;
            });
        },
    };
}
