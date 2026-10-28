import { nextAvatarRevision } from "./avatar-publication.ts";
import { avatar_completion } from "@opencok/drizzle/schema/opencok_kingdom/avatar_completion";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { pic_upload_record } from "@opencok/drizzle/schema/opencok_kingdom/pic_upload_record";
import type {
    AvatarFiles,
    AvatarFinishInspector,
    AvatarFinishQuery,
    AvatarFinishSnapshot,
} from "@opencok/contracts/files";
import { and, eq, gt } from "drizzle-orm";
import type { Database } from "./game.ts";

function invalid(): never
{
    throw new Error("Invalid avatar completion state");
}

export function commitAvatarFinish(
    db: Database["kingdom"]["db"],
    kingdomId: number,
    owner: string,
    input: AvatarFinishQuery,
    find: AvatarFiles["find"],
    inspect: AvatarFinishInspector,
    recoverOnly = false,
): Promise<AvatarFinishSnapshot>
{
    const query = Object.freeze({ ...input });

    if (
        typeof owner !== "string"
        || !/^[0-9]{1,20}$/.test(owner)
        || !Number.isInteger(kingdomId)
        || kingdomId < 1
        || kingdomId > 2147483647
        || !Number.isInteger(query.sequence)
        || query.sequence < 1
        || query.sequence > 999999
        || typeof query.hash !== "string"
        || !/^[a-f0-9]{64}$/.test(query.hash)
        || !Number.isSafeInteger(query.now)
        || query.now < 0
    )
    {
        return invalid();
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
                        picVer: userprofile.picVer,
                        name: userprofile.name,
                        pf: userprofile.pf,
                    })
                    .from(userprofile)
                    .where(eq(userprofile.uid, owner))
                    .limit(1)
                    .for("update")
            )[0];

            if (
                !profile
                || profile.uid !== owner
                || profile.serverId !== kingdomId
                || (profile.banFlag ?? 0) !== 0
                || (profile.banTime ?? 0n) > BigInt(query.now)
            )
            {
                return { profile };
            }

            const receipt = await find(owner, query.sequence);

            if (
                !receipt
                || receipt.owner !== owner
                || receipt.sequence !== String(query.sequence)
                || receipt.hash !== query.hash
            )
            {
                return invalid();
            }

            const version = profile.picVer;

            if (
                typeof version !== "number"
                || !Number.isInteger(version)
                || version < -2147483648
                || version > 2147483647
            )
            {
                return invalid();
            }

            const prior = (
                await tx
                    .select({
                        ownerUid: avatar_completion.ownerUid,
                        sequence: avatar_completion.sequence,
                        hash: avatar_completion.hash,
                    })
                    .from(avatar_completion)
                    .where(
                        and(
                            eq(avatar_completion.ownerUid, owner),
                            eq(avatar_completion.sequence, query.sequence),
                        ),
                    )
                    .limit(1)
            )[0];

            if (
                prior
                && (prior.ownerUid !== owner || prior.sequence !== query.sequence
                    || prior.hash !== query.hash)
            )
            {
                return invalid();
            }

            const current = Math.max(0, version % 1000000);

            if (recoverOnly && (!prior || query.sequence > current))
            {
                return invalid();
            }

            if (query.sequence <= current)
            {
                if (query.sequence === current && !prior)
                {
                    await tx.insert(avatar_completion).values({
                        ownerUid: owner,
                        sequence: query.sequence,
                        hash: query.hash,
                        picVer: version,
                        committedAt: BigInt(query.now),
                        effects: JSON.stringify({ version: 1, observed: true }),
                        pendingEffects: 0,
                    });
                }

                return {
                    profile,
                    picVer: version,
                    superseded: query.sequence < current,
                    applied: false,
                };
            }

            if (prior || query.sequence !== current + 1)
            {
                return invalid();
            }

            let active = true;
            let castleRead = false;
            let recordRead = false;
            let plan;

            try
            {
                plan = {
                    ...(await inspect(Object.freeze({ ...profile }), {
                        async castleLevel()
                        {
                            if (!active || castleRead)
                            {
                                return invalid();
                            }

                            castleRead = true;
                            const rows = await tx
                                .select({ uid: user_building.uid, level: user_building.level })
                                .from(user_building)
                                .where(
                                    and(
                                        eq(user_building.uid, owner),
                                        eq(user_building.itemId, 400000),
                                    ),
                                )
                                .limit(2);

                            if (rows.length > 1 || rows.some((row) => row.uid !== owner))
                            {
                                return invalid();
                            }

                            return rows[0]?.level ?? 0;
                        },
                        async uploadRecord()
                        {
                            if (!active || recordRead)
                            {
                                return invalid();
                            }

                            recordRead = true;
                            const record = (
                                await tx
                                    .select({
                                        uid: pic_upload_record.uid,
                                        updateTime: pic_upload_record.updateTime,
                                        banTime: pic_upload_record.banTime,
                                    })
                                    .from(pic_upload_record)
                                    .where(eq(pic_upload_record.uid, owner))
                                    .limit(1)
                            )[0];

                            if (record && record.uid !== owner)
                            {
                                return invalid();
                            }

                            return record;
                        },
                    })),
                };
            }
            finally
            {
                active = false;
            }

            if (
                typeof plan.moderated !== "boolean"
                || plan.picVer !== query.sequence + (plan.moderated ? 0 : 2000000)
                || (plan.moderated && (!castleRead || !recordRead))
                || typeof plan.effects !== "string"
                || Buffer.byteLength(plan.effects) > 65535
                || ![6, 7].includes(plan.pendingEffects)
            )
            {
                return invalid();
            }

            let effects;

            try
            {
                effects = JSON.parse(plan.effects);
            }
            catch
            {
                return invalid();
            }

            if (
                !effects
                || effects.version !== 1
                || !effects.profile
                || effects.profile.userName !== profile.name
                || effects.profile.platform !== profile.pf
                || effects.profile.updatedAt !== String(Math.floor(query.now / 1000))
                || [profile.name, profile.pf].some(
                    (value) =>
                        typeof value !== "string"
                        || value.length > 255
                        || value.includes("\0")
                        || !value.isWellFormed(),
                )
                || (effects.mail !== null
                    && (typeof effects.mail !== "object"
                        || Array.isArray(effects.mail)
                        || !Object.keys(effects.mail).length
                        || Object.keys(effects.mail).length > 100
                        || Object.entries(effects.mail).some(
                            ([key, value]) =>
                                !key
                                || key.length > 100
                                || key.includes("\0")
                                || !key.isWellFormed()
                                || typeof value !== "string"
                                || value.includes("\0")
                                || !value.isWellFormed(),
                        )))
                || (plan.pendingEffects === 7) !== (effects.mail !== null)
                || (!plan.moderated && effects.mail !== null)
            )
            {
                return invalid();
            }

            const pending = await tx
                .select({ sequence: avatar_completion.sequence })
                .from(avatar_completion)
                .where(
                    and(
                        eq(avatar_completion.ownerUid, owner),
                        gt(avatar_completion.pendingEffects, 0),
                    ),
                )
                .limit(1000);

            if (pending.length >= 1000)
            {
                throw new Error("Avatar completion backlog full");
            }

            if (plan.moderated)
            {
                await tx
                    .insert(pic_upload_record)
                    .values({
                        uid: owner,
                        picVer: plan.picVer,
                        report: 0,
                        updateTime: BigInt(query.now),
                        stat: 0,
                        banCount: 0,
                        banTime: 0n,
                    })
                    .onConflictDoUpdate({
                        target: pic_upload_record.uid,
                        set: {
                            picVer: plan.picVer,
                            report: 0,
                            updateTime: BigInt(query.now),
                            stat: 0,
                        },
                    });
            }

            const changed = await tx
                .update(userprofile)
                .set({ picVer: plan.picVer })
                .where(
                    and(
                        eq(userprofile.uid, owner),
                        eq(userprofile.serverId, kingdomId),
                        eq(userprofile.picVer, version),
                    ),
                )
                .returning({ uid: userprofile.uid });

            if (changed.length !== 1 || changed[0]!.uid !== owner)
            {
                return invalid();
            }

            await tx.insert(avatar_completion).values({
                ownerUid: owner,
                sequence: query.sequence,
                hash: query.hash,
                picVer: plan.picVer,
                committedAt: BigInt(query.now),
                effects: plan.effects,
                pendingEffects: plan.pendingEffects,
                revision: await nextAvatarRevision(tx, owner),
            });

            return {
                profile: { ...profile, picVer: plan.picVer },
                picVer: plan.picVer,
                superseded: false,
                applied: true,
            };
        },
        { isolationLevel: "repeatable read", accessMode: "read write" },
    );
}
