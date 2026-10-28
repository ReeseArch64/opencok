import { and, eq, inArray, isNotNull, lte, sql } from "drizzle-orm";
import { expedition_stage_award as awards } from "@opencok/drizzle/schema/opencok_kingdom/expedition_stage_award";
import { expedition_stage_closure as closures } from "@opencok/drizzle/schema/opencok_kingdom/expedition_stage_closure";
import { expedition_stage_member as members } from "@opencok/drizzle/schema/opencok_kingdom/expedition_stage_member";
import { expedition_progress } from "@opencok/drizzle/schema/opencok_kingdom/expedition_progress";
import { new_exped_history } from "@opencok/drizzle/schema/opencok_kingdom/new_exped_history";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { expedition_stage_period as periods } from "@opencok/drizzle/schema/opencok_global/expedition_stage_period";
import { expedition_stage_watermark as marks } from "@opencok/drizzle/schema/opencok_global/expedition_stage_watermark";
import { expedition_score as scores } from "@opencok/drizzle/schema/opencok_global/expedition_score";
import { server_king_info } from "@opencok/drizzle/schema/opencok_global/server_king_info";
import { expeditionAwardId } from "@opencok/rules/expedition-stage-rewards";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import type {
    ExpeditionAwardReader,
    ExpeditionAwardPayload,
    ExpeditionAwardStore,
    ExpeditionAwardStandings,
    ExpeditionHistorySource,
} from "@opencok/contracts/expedition-stage-rewards";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";
import type { MutationTransaction } from "./mutation";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export function expeditionAwardReader(
    tx: MutationTransaction,
    owner: string,
): ExpeditionAwardReader
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

export async function writeExpeditionAward(
    tx: MutationTransaction,
    owner: string,
    id: string,
    now: bigint,
)
{
    const [award] = await tx
        .select()
        .from(awards)
        .where(and(eq(awards.id, id), eq(awards.ownerUid, owner), eq(awards.deliveredAt, 0n)))
        .for("update");

    if (!award || award.createdAt > now)
    {
        throw new Error("Invalid owned expedition award acknowledgement");
    }

    const payload = JSON.parse(award.payload) as ExpeditionAwardPayload;
    const [progress] = await tx
        .select()
        .from(expedition_progress)
        .where(
            and(
                eq(expedition_progress.uid, owner),
                eq(expedition_progress.periodId, award.periodId),
                eq(expedition_progress.stage, award.stage),
            ),
        )
        .for("update");

    if (payload.claims.length)
    {
        if (!progress)
        {
            throw new Error("Missing expedition reward progress");
        }

        const taken = new Set(progress.takeReward.split("|").filter(Boolean).map(Number));

        for (const claim of payload.claims)
        {
            taken.add(claim);
        }

        const takeReward = [...taken].join("|");

        if (takeReward.length > 500)
        {
            throw new Error("Expedition claim flag bound exceeded");
        }

        await tx
            .update(expedition_progress)
            .set({ takeReward })
            .where(
                and(
                    eq(expedition_progress.uid, owner),
                    eq(expedition_progress.periodId, award.periodId),
                    eq(expedition_progress.stage, award.stage),
                ),
            );
    }

    await tx.update(awards).set({ deliveredAt: now, nextAttemptAt: 0n }).where(eq(awards.id, id));
}

export function createExpeditionAwardStore(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
): ExpeditionAwardStore
{
    let cursor: { end: bigint; id: string; stage: number; } | undefined;
    const key = (row: Row) =>
        and(eq(closures.periodId, text(row, "periodId")), eq(closures.stage, num(row, "stage")));
    const owners = (closure: Row) =>
        and(
            eq(userprofile.serverId, authority.kingdomId),
            sql`coalesce(${userprofile.crossFightSrcServerId},-1)<=0`,
            lte(userprofile.regTime, long(closure, "createdAt")),
            sql`${userprofile.uid} collate "C">${text(closure, "awardCursor")} collate "C"`,
        );

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
                            cursor
                                ? sql`(${closures.endTime},${closures.periodId} collate "C",${closures.stage})>(${cursor.end},${cursor.id} collate "C",${cursor.stage})`
                                : undefined,
                        ),
                    )
                    .orderBy(
                        closures.endTime,
                        sql`${closures.periodId} collate "C"`,
                        closures.stage,
                    )
                    .limit(8);
                const last = rows.at(-1);
                cursor = rows.length === 8 && last
                    ? { end: last.endTime, id: last.periodId, stage: last.stage }
                    : undefined;

                return rows;
            });
        },
        page(closure)
        {
            return db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);
                const rows = await tx
                    .select({ uid: userprofile.uid, member: members })
                    .from(userprofile)
                    .leftJoin(
                        members,
                        and(
                            eq(members.uid, userprofile.uid),
                            eq(members.periodId, text(closure, "periodId")),
                            eq(members.stage, num(closure, "stage")),
                        ),
                    )
                    .where(owners(closure))
                    .orderBy(sql`${userprofile.uid} collate "C"`)
                    .limit(64);

                return rows.map((row) => ({ ...row.member, uid: row.uid }));
            });
        },
        async plan(closure, member, create, history, now)
        {
            await db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);
                const [current] = await tx.select().from(closures).where(key(closure)).for(
                    "update",
                );
                const uid = text(member, "uid");

                if (
                    !current
                    || current.phase !== 2
                    || current.awardCursor !== text(closure, "awardCursor")
                    || now < current.finalizedAt
                    || Buffer.compare(Buffer.from(uid), Buffer.from(current.awardCursor)) <= 0
                )
                {
                    throw new Error("Stale expedition reward cursor");
                }

                const [profile] = await tx
                    .select({ uid: userprofile.uid })
                    .from(userprofile)
                    .where(and(owners(current), eq(userprofile.uid, uid)))
                    .for("share");

                if (profile)
                {
                    const payload = create(),
                        encoded = JSON.stringify(payload),
                        id = expeditionAwardId(current.periodId, current.stage, uid);

                    if (
                        payload.mails.length > 129
                        || payload.claims.length > 128
                        || Buffer.byteLength(encoded) > 1048576
                    )
                    {
                        throw new Error("Expedition award payload bound exceeded");
                    }

                    await tx
                        .insert(awards)
                        .values({
                            id,
                            periodId: current.periodId,
                            stage: current.stage,
                            ownerUid: uid,
                            payload: encoded,
                            createdAt: now,
                        })
                        .onConflictDoNothing();
                    const [saved] = await tx.select().from(awards).where(eq(awards.id, id)).limit(
                        1,
                    );

                    if (
                        !saved
                        || saved.periodId !== current.periodId
                        || saved.stage !== current.stage
                        || saved.ownerUid !== uid
                    )
                    {
                        throw new Error("Foreign expedition award identity");
                    }
                }

                await tx
                    .update(closures)
                    .set({ awardCursor: uid, history: current.history ?? history })
                    .where(key(current));
                authority.assertReady();
            });
        },
        async finished(closure, history)
        {
            await db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);
                const [current] = await tx.select().from(closures).where(key(closure)).for(
                    "update",
                );

                if (
                    !current || current.phase !== 2
                    || current.awardCursor !== text(closure, "awardCursor")
                )
                {
                    throw new Error("Stale expedition reward completion");
                }

                const [remaining] = await tx
                    .select({ uid: userprofile.uid })
                    .from(userprofile)
                    .where(owners(current))
                    .limit(1);

                if (remaining)
                {
                    throw new Error("Incomplete expedition reward population");
                }

                await tx
                    .update(closures)
                    .set({ phase: 3, history: current.history ?? history })
                    .where(key(current));
                authority.assertReady();
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

export function createExpeditionAwardStandings(
    db: DatabaseClient<"global">,
    kingdomId: number,
): ExpeditionAwardStandings
{
    return {
        read(closure, owners)
        {
            return db.transaction(
                async (tx) => {
                    if (owners.length > 64)
                    {
                        throw new Error("Expedition standings member bound exceeded");
                    }

                    await tx.execute(sql`set local statement_timeout='3s'`);
                    const opponent = num(closure, "opponent"),
                        [result] = await tx
                            .select()
                            .from(periods)
                            .where(
                                and(
                                    eq(periods.periodId, text(closure, "periodId")),
                                    eq(periods.stage, num(closure, "stage")),
                                    eq(periods.leader, Math.min(kingdomId, opponent)),
                                    eq(periods.opponent, Math.max(kingdomId, opponent)),
                                    eq(periods.state, 1),
                                ),
                            )
                            .limit(1);

                    if (!result)
                    {
                        return;
                    }

                    if (
                        result.winner !== num(closure, "winner")
                        || result.endTime !== long(closure, "endTime")
                    )
                    {
                        throw new Error("Conflicting expedition prize result");
                    }

                    const proofs = await tx
                        .select()
                        .from(marks)
                        .where(
                            and(
                                eq(marks.periodId, result.periodId),
                                eq(marks.stage, result.stage),
                                inArray(marks.kingdomId, [kingdomId, opponent]),
                            ),
                        );

                    if (
                        proofs.length !== 2
                        || proofs.some((row) => row.state !== 1)
                        || !proofs.every(
                            (row) =>
                                row.opponent
                                    === (row.kingdomId === kingdomId ? opponent : kingdomId),
                        )
                    )
                    {
                        return;
                    }

                    const rows = owners.length
                        ? await tx.execute<Row>(
                            sql`with cohort as(select *,row_number() over(order by score desc,member collate "C" desc)::integer as rank,sum(score) over(partition by "kingdomId","allianceId" order by member collate "C" rows between unbounded preceding and unbounded following)::float8 as "allianceScore" from ${scores} where "periodId"=${result.periodId} and stage=${result.stage} and (("kingdomId"=${kingdomId} and opponent=${opponent}) or ("kingdomId"=${opponent} and opponent=${kingdomId}))) select member,score,case when (select min(rank) from cohort where metadata is null)<=cohort.rank then 0 else cohort.rank end as rank,"allianceScore" from cohort where "kingdomId"=${kingdomId} and member in (${
                                sql.join(
                                    owners.map((owner) => sql`${owner}`),
                                    sql`,`,
                                )
                            })`,
                        )
                        : { rows: [] };
                    const [top] = await tx
                        .select()
                        .from(scores)
                        .where(
                            and(
                                eq(scores.periodId, result.periodId),
                                eq(scores.stage, result.stage),
                                eq(scores.kingdomId, kingdomId),
                                eq(scores.opponent, opponent),
                            ),
                        )
                        .orderBy(sql`${scores.score} desc`, sql`${scores.member} collate "C" desc`)
                        .limit(1);

                    return { result, members: rows.rows, top };
                },
                { isolationLevel: "repeatable read" },
            );
        },
    };
}

export function createExpeditionHistorySource(
    owned: DatabaseClient<"kingdom">,
    global: DatabaseClient<"global">,
    authority: RealmAuthority,
): ExpeditionHistorySource
{
    return {
        owned(owner, now)
        {
            return owned.transaction(
                async (tx) => {
                    await fenceRealmTransaction(tx, authority);
                    const [profile] = await tx
                        .select()
                        .from(userprofile)
                        .where(eq(userprofile.uid, owner))
                        .limit(1);

                    if (
                        !profile
                        || profile.serverId !== authority.kingdomId
                        || (profile.banFlag ?? 0) !== 0
                        || (profile.banTime ?? 0n) > now
                    )
                    {
                        throw new GameError(errors.invalid);
                    }

                    const current = await tx
                        .select()
                        .from(closures)
                        .where(and(sql`${closures.phase}>=2`, isNotNull(closures.history)))
                        .orderBy(
                            sql`${closures.finalizedAt} desc`,
                            sql`${closures.periodId} collate "C"`,
                            closures.stage,
                        )
                        .limit(12);
                    const legacy = await tx
                        .select()
                        .from(new_exped_history)
                        .orderBy(
                            sql`${new_exped_history.createTime} desc nulls last`,
                            new_exped_history.stageId,
                            new_exped_history.winServerId,
                            new_exped_history.loseServerId,
                        )
                        .limit(12);

                    return [
                        ...current.map((row) => ({
                            ...row,
                            createTime: row.finalizedAt,
                            winServerId: row.winner,
                            loseServerId: row.winner === authority.kingdomId
                                ? row.opponent
                                : authority.kingdomId,
                        })),
                        ...legacy,
                    ]
                        .toSorted((a, b) =>
                            long(a, "createTime") > long(b, "createTime")
                                ? -1
                                : long(a, "createTime") < long(b, "createTime")
                                ? 1
                                : num(a, "stageId") - num(b, "stageId")
                        )
                        .slice(0, 12);
                },
                { isolationLevel: "repeatable read" },
            );
        },
        async servers(ids)
        {
            if (!ids.length)
            {
                return [];
            }

            if (ids.length > 24)
            {
                throw new Error("Expedition history realm bound exceeded");
            }

            return global
                .select()
                .from(server_king_info)
                .where(inArray(server_king_info.Id, [...new Set(ids)]));
        },
    };
}
