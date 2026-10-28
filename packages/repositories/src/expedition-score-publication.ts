import { and, asc, eq, gte, inArray, sql } from "drizzle-orm";
import { expedition_manifest } from "@opencok/drizzle/schema/opencok_kingdom/expedition_manifest";
import { expedition_progress } from "@opencok/drizzle/schema/opencok_kingdom/expedition_progress";
import { expedition_period } from "@opencok/drizzle/schema/opencok_kingdom/expedition_period";
import { expedition_clock } from "@opencok/drizzle/schema/opencok_kingdom/expedition_clock";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { expedition_score } from "@opencok/drizzle/schema/opencok_global/expedition_score";
import { expeditionScoreVersion } from "./expedition-score-version";
import { expedition_stage_watermark } from "@opencok/drizzle/schema/opencok_global/expedition_stage_watermark";
import { expedition_match_realm } from "@opencok/drizzle/schema/opencok_global/expedition_match_realm";
import type {
    ExpeditionScoreSource,
    ExpeditionScoreProjection,
    ExpeditionLiveSource,
} from "@opencok/contracts/expedition-score-publication";
import { cityInteger, cityAmount } from "@opencok/rules/city-progression";
import { expeditionPhase } from "@opencok/rules/new-expedition";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";
import type { Database } from "./game";

export function createExpeditionScoreSource(
    db: Database["kingdom"]["db"],
    authority: RealmAuthority,
): ExpeditionScoreSource
{
    return {
        page(cursor, now)
        {
            return db.transaction(async (tx) => {
                await tx.execute(sql`set local statement_timeout='3s'`);
                await fenceRealmTransaction(tx, authority);
                const rows = await tx
                    .select({
                        progress: expedition_progress,
                        manifest: expedition_manifest,
                        profileUid: userprofile.uid,
                        name: userprofile.name,
                        pic: userprofile.pic,
                        picVer: userprofile.picVer,
                        allianceId: userprofile.allianceId,
                        abbr: alliance.abbr,
                    })
                    .from(expedition_progress)
                    .innerJoin(
                        expedition_manifest,
                        eq(expedition_manifest.periodId, expedition_progress.periodId),
                    )
                    .leftJoin(userprofile, eq(userprofile.uid, expedition_progress.uid))
                    .leftJoin(alliance, eq(alliance.uid, userprofile.allianceId))
                    .where(
                        and(
                            eq(expedition_manifest.serverId, authority.kingdomId),
                            gte(expedition_manifest.endTime, now - 864000000n),
                            sql`(${userprofile.uid} is null or (${userprofile.serverId}=${authority.kingdomId} and coalesce(${userprofile.crossFightSrcServerId},-1)<=0))`,
                            cursor
                                ? sql`(${expedition_progress.periodId} collate "C",${expedition_progress.stage},${expedition_progress.uid} collate "C")>(${cursor.periodId} collate "C",${cursor.stage},${cursor.member} collate "C")`
                                : undefined,
                        ),
                    )
                    .orderBy(
                        sql`${expedition_progress.periodId} collate "C"`,
                        asc(expedition_progress.stage),
                        sql`${expedition_progress.uid} collate "C"`,
                    )
                    .limit(64);
                authority.assertReady();

                return rows.map((row) => ({
                    periodId: row.progress.periodId,
                    stage: row.progress.stage,
                    member: row.progress.uid,
                    kingdomId: authority.kingdomId,
                    opponent: row.manifest.matchServerId,
                    allianceId: row.allianceId ?? "",
                    score: row.progress.score,
                    endTime: row.manifest.endTime,
                    metadata: row.profileUid
                        ? JSON.stringify({
                            name: row.name ?? "",
                            pic: row.pic ?? "",
                            picVer: row.picVer ?? 0,
                            picfraId: 0,
                            abbr: row.abbr ?? "",
                            serverId: authority.kingdomId,
                        })
                        : null,
                }));
            });
        },
        clock()
        {
            return db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);
                const [clock] = await tx
                    .select()
                    .from(expedition_clock)
                    .where(eq(expedition_clock.serverId, authority.kingdomId))
                    .limit(1);

                return clock;
            });
        },
    };
}

export function createExpeditionScoreProjection(
    db: Database["databases"]["global"]["db"],
    authority: RealmAuthority,
): ExpeditionScoreProjection
{
    return {
        async write(rows, now)
        {
            authority.assertReady();
            cityAmount(now);

            if (rows.length > 256)
            {
                throw new Error("Expedition score publication bound exceeded");
            }

            for (const row of rows)
            {
                cityInteger(row.stage, 0, 8);
                cityAmount(row.endTime);

                if (
                    row.kingdomId !== authority.kingdomId
                    || row.opponent === row.kingdomId
                    || cityInteger(row.opponent, 1) < 1
                    || !row.periodId
                    || row.periodId.length > 40
                    || !row.member
                    || row.member.length > 40
                    || row.allianceId.length > 40
                    || !Number.isFinite(row.score)
                    || row.score < 0
                    || (row.metadata !== null && Buffer.byteLength(row.metadata) > 8192)
                )
                {
                    throw new Error("Invalid owned expedition publication");
                }
            }

            return db.transaction(async (tx) => {
                await tx.execute(sql`set local lock_timeout='1s'`);
                await tx.execute(sql`set local statement_timeout='3s'`);
                await tx.execute(sql`select pg_advisory_xact_lock(728227,${authority.kingdomId})`);
                const version = await expeditionScoreVersion(tx, authority);
                const periods = [...new Set(rows.map((row) => row.periodId))],
                    proofs = periods.length
                        ? await tx
                            .select()
                            .from(expedition_match_realm)
                            .where(inArray(expedition_match_realm.periodId, periods))
                        : [];
                let accepted = rows.filter((row) =>
                    proofs.some(
                        (own) =>
                            own.periodId === row.periodId
                            && own.kingdomId === row.kingdomId
                            && own.opponent === row.opponent
                            && own.matchedAt > 0n
                            && proofs.some(
                                (other) =>
                                    other.periodId === own.periodId
                                    && other.kingdomId === own.opponent
                                    && other.opponent === own.kingdomId
                                    && other.matchedAt === own.matchedAt,
                            ),
                    )
                );
                const seals = periods.length
                    ? await tx
                        .select()
                        .from(expedition_stage_watermark)
                        .where(
                            and(
                                eq(expedition_stage_watermark.kingdomId, authority.kingdomId),
                                inArray(expedition_stage_watermark.periodId, periods),
                            ),
                        )
                    : [];
                const sealed = accepted.filter((row) =>
                    seals.some((seal) => seal.periodId === row.periodId && seal.stage === row.stage)
                );
                const refresh = sealed.length
                    ? await tx
                        .select()
                        .from(expedition_score)
                        .where(
                            and(
                                eq(expedition_score.kingdomId, authority.kingdomId),
                                inArray(expedition_score.periodId, periods),
                                inArray(
                                    expedition_score.member,
                                    sealed.map((row) => row.member),
                                ),
                            ),
                        )
                    : [];
                accepted = accepted.flatMap((row) => {
                    if (
                        !seals.some((seal) =>
                            seal.periodId === row.periodId && seal.stage === row.stage
                        )
                    )
                    {
                        return [row];
                    }

                    const frozen = refresh.find(
                        (saved) =>
                            saved.periodId === row.periodId
                            && saved.stage === row.stage
                            && saved.member === row.member,
                    );

                    return frozen
                        ? [{ ...row, score: frozen.score, allianceId: frozen.allianceId }]
                        : [];
                });

                if (accepted.length)
                {
                    const written = await tx
                        .insert(expedition_score)
                        .values(
                            accepted.map((row) => ({
                                ...row,
                                ownerEpoch: version.ownerEpoch,
                                sequence: version.sequence,
                                observedAt: now,
                            })),
                        )
                        .onConflictDoUpdate({
                            target: [
                                expedition_score.periodId,
                                expedition_score.stage,
                                expedition_score.member,
                            ],
                            set: {
                                allianceId: sql`excluded."allianceId"`,
                                score: sql`excluded.score`,
                                metadata: sql`excluded.metadata`,
                                ownerEpoch: sql`excluded."ownerEpoch"`,
                                sequence: sql`excluded.sequence`,
                                observedAt: sql`excluded."observedAt"`,
                            },
                            setWhere:
                                sql`${expedition_score.kingdomId}=${authority.kingdomId} and ${expedition_score.opponent}=excluded.opponent and ${expedition_score.endTime}=excluded."endTime" and (${expedition_score.ownerEpoch},${expedition_score.sequence})<(excluded."ownerEpoch",excluded.sequence)`,
                        })
                        .returning({ member: expedition_score.member });

                    if (written.length !== accepted.length)
                    {
                        throw new Error("Foreign or stale expedition score member");
                    }
                }

                authority.assertReady();

                return {
                    kingdomId: authority.kingdomId,
                    ownerEpoch: version.ownerEpoch,
                    sequence: version.sequence,
                };
            });
        },
    };
}

export function createExpeditionLiveSource(
    owned: Database["kingdom"]["db"],
    global: Database["databases"]["global"]["db"],
    authority: RealmAuthority,
): ExpeditionLiveSource
{
    return {
        owned(owner, now)
        {
            return owned.transaction(async (tx) => {
                await tx.execute(sql`set local lock_timeout='1s'`);
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

                const [period] = await tx
                        .select()
                        .from(expedition_period)
                        .where(eq(expedition_period.serverId, authority.kingdomId))
                        .limit(1),
                    phase = expeditionPhase(period, now);

                if (!period || !phase)
                {
                    return;
                }

                return {
                    periodId: period.periodId,
                    stage: phase.stage,
                    kingdomId: authority.kingdomId,
                    opponent: period.matchServerId,
                    member: owner,
                    allianceId: profile.allianceId ?? "",
                    startTime: phase.startTime,
                    endTime: phase.endTime,
                };
            });
        },
        async shared(view)
        {
            return global.transaction(
                async (tx) => {
                    await tx.execute(sql`set local statement_timeout='3s'`);
                    const proof = await tx
                            .select()
                            .from(expedition_match_realm)
                            .where(
                                and(
                                    eq(expedition_match_realm.periodId, view.periodId),
                                    inArray(expedition_match_realm.kingdomId, [
                                        view.kingdomId,
                                        view.opponent,
                                    ]),
                                ),
                            ),
                        own = proof.find((row) => row.kingdomId === view.kingdomId),
                        other = proof.find((row) => row.kingdomId === view.opponent);

                    if (
                        !own
                        || !other
                        || own.matchedAt === 0n
                        || other.matchedAt !== own.matchedAt
                        || own.opponent !== other.kingdomId
                        || other.opponent !== own.kingdomId
                    )
                    {
                        return;
                    }

                    const result = await tx.execute<{
                        rank: number;
                        allianceScore: number;
                        ownScore: number;
                        otherScore: number;
                    }>(
                        sql`with cohort as(select * from ${expedition_score} where "periodId"=${view.periodId} and stage=${view.stage} and (("kingdomId"=${view.kingdomId} and opponent=${view.opponent}) or ("kingdomId"=${view.opponent} and opponent=${view.kingdomId}))),ranking as(select member,row_number() over(order by score desc,member collate "C" desc)::integer as rank from cohort) select coalesce((select rank from ranking where member=${view.member}),-1)::integer as rank,coalesce(sum(score order by member collate "C") filter(where "allianceId"=${view.allianceId} and "allianceId"<>'' and "kingdomId"=${view.kingdomId}),0)::double precision as "allianceScore",coalesce(sum(score order by member collate "C") filter(where "kingdomId"=${view.kingdomId}),0)::double precision as "ownScore",coalesce(sum(score order by member collate "C") filter(where "kingdomId"=${view.opponent}),0)::double precision as "otherScore" from cohort`,
                    );
                    const row = result.rows[0];

                    if (!row || Object.values(row).some((value) => !Number.isFinite(value)))
                    {
                        throw new Error("Invalid shared expedition totals");
                    }

                    return row;
                },
                { isolationLevel: "repeatable read" },
            );
        },
    };
}
