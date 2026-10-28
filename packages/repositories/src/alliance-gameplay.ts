import { donate_history } from "@opencok/drizzle/schema/opencok_kingdom/donate_history";
import { alliance_gift } from "@opencok/drizzle/schema/opencok_kingdom/alliance_gift";
import { allianceMailData } from "@opencok/mappings/alliance";
import { mail_group } from "@opencok/drizzle/schema/opencok_kingdom/mail_group";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { and, asc, eq, inArray, or, sql } from "drizzle-orm";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { alliance_apply } from "@opencok/drizzle/schema/opencok_kingdom/alliance_apply";
import { alliance_science } from "@opencok/drizzle/schema/opencok_kingdom/alliance_science";
import { alliance_science_upgrade } from "@opencok/drizzle/schema/opencok_kingdom/alliance_science_upgrade";
import { alliance_donate } from "@opencok/drizzle/schema/opencok_kingdom/alliance_donate";
import { alliance_help } from "@opencok/drizzle/schema/opencok_kingdom/alliance_help";
import { alliance_blacklist } from "@opencok/drizzle/schema/opencok_kingdom/alliance_blacklist";
import { user_gift } from "@opencok/drizzle/schema/opencok_kingdom/user_gift";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_lord } from "@opencok/drizzle/schema/opencok_kingdom/user_lord";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { timed_activity } from "@opencok/drizzle/schema/opencok_kingdom/timed_activity";
import type { AllianceRepository, AllianceWrite } from "@opencok/contracts/alliance-gameplay";
import { text, long, type Row } from "@opencok/contracts/rows";
import { createMutationExecutor, type MutationTransaction } from "./mutation";
import { executeRealmInventoryTransaction } from "@opencok/repositories/inventory-runtime";
import type { ProgressionBoundary } from "./city-progression";
import type { RealmAuthority } from "./realm-authority";
import type { ActivityDomain } from "./timed-activity";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export function createAllianceRepository(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
    boundary: ProgressionBoundary,
    now = Date.now,
    domains: ReadonlyMap<number, ActivityDomain> = new Map(),
    recordAction?: (
        tx: MutationTransaction,
        owner: string,
        kind: string,
        count: number,
        now: bigint,
    ) => Promise<void>,
): AllianceRepository
{
    const execute = createMutationExecutor(db, authority, now);

    return {
        async execute(input, selection, plan)
        {
            const seed = [input.owner, ...(selection.playerId ? [selection.playerId] : [])];
            const initial = await db.select().from(userprofile).where(
                inArray(userprofile.uid, seed),
            );
            const ids = new Set(
                initial.map((row) => row.allianceId).filter((id): id is string => Boolean(id)),
            );

            if (selection.allianceId)
            {
                ids.add(selection.allianceId);
            }

            if (selection.mailId)
            {
                const [message] = await db
                    .select()
                    .from(mail)
                    .where(and(eq(mail.uid, selection.mailId), eq(mail.toUser, input.owner)));

                if (message && [17, 25].includes(message.type))
                {
                    const data = allianceMailData(message.contents);

                    if (message.type === 17 && typeof data.allianceId === "string")
                    {
                        ids.add(data.allianceId);
                    }

                    if (message.type === 25 && typeof data.applicantId === "string")
                    {
                        seed.push(data.applicantId);
                    }
                }

                const [application] = await db
                    .select()
                    .from(alliance_apply)
                    .where(eq(alliance_apply.uid, selection.mailId));

                if (application?.allianceId)
                {
                    ids.add(application.allianceId);
                }

                if (application?.userId)
                {
                    seed.push(application.userId);
                }
            }

            const groups = [...ids].sort();
            const previous = groups.length
                ? await db
                    .select({ uid: alliance_member.uid })
                    .from(alliance_member)
                    .where(inArray(alliance_member.allianceId, groups))
                    .limit(2049)
                : [];
            const participants = [...new Set([...seed, ...previous.map((row) => row.uid)])].sort();

            return execute({ ...input, participants }, async (tx) => {
                const at = BigInt(now());
                const profiles = await tx
                    .select()
                    .from(userprofile)
                    .where(inArray(userprofile.uid, participants));

                if (profiles.some((row) => row.allianceId && !ids.has(row.allianceId)))
                {
                    throw new Error("Alliance membership changed; retry operation");
                }

                const alliances = groups.length
                    ? await tx
                        .select()
                        .from(alliance)
                        .where(inArray(alliance.uid, groups))
                        .orderBy(asc(alliance.uid))
                        .for("update")
                    : [];
                const members = await tx
                    .select()
                    .from(alliance_member)
                    .where(
                        or(
                            inArray(alliance_member.uid, participants),
                            inArray(alliance_member.allianceId, groups),
                        ),
                    )
                    .orderBy(asc(alliance_member.uid))
                    .for("update");

                if (members.some((row) => !participants.includes(row.uid)))
                {
                    throw new Error("Alliance participants changed; retry operation");
                }

                const applications = await tx
                    .select()
                    .from(alliance_apply)
                    .where(
                        or(
                            inArray(alliance_apply.userId, participants),
                            inArray(alliance_apply.allianceId, groups),
                        ),
                    )
                    .limit(8193);

                if (applications.length > 8192)
                {
                    throw new Error("Alliance application limit exceeded");
                }

                return executeRealmInventoryTransaction(
                    tx,
                    input.owner,
                    async (inventory) => {
                        const result = await plan({
                            now: at,
                            inventory,
                            selection,
                            profiles,
                            alliances,
                            members,
                            applications,
                            lords: await tx.select().from(user_lord).where(
                                inArray(user_lord.uid, participants),
                            ),
                            cities: await tx
                                .select()
                                .from(user_building)
                                .where(inArray(user_building.uid, participants)),
                            powers: await tx
                                .select()
                                .from(playerinfo)
                                .where(inArray(playerinfo.uid, participants)),
                            points: await tx
                                .select()
                                .from(worldpoint)
                                .where(inArray(worldpoint.ownerId, participants)),
                            marches: await tx
                                .select()
                                .from(world_march)
                                .where(
                                    or(
                                        inArray(world_march.ownerUid, participants),
                                        inArray(world_march.targetUid, participants),
                                        inArray(
                                            world_march.targetId,
                                            tx
                                                .select({ id: worldpoint.id })
                                                .from(worldpoint)
                                                .where(inArray(worldpoint.ownerId, participants)),
                                        ),
                                    ),
                                )
                                .limit(8193),
                            sciences: groups.length
                                ? await tx
                                    .select()
                                    .from(alliance_science)
                                    .where(inArray(alliance_science.allianceId, groups))
                                : [],
                            research: groups.length
                                ? await tx
                                    .select()
                                    .from(alliance_science_upgrade)
                                    .where(inArray(alliance_science_upgrade.allianceId, groups))
                                : [],
                            history: await tx
                                .select()
                                .from(donate_history)
                                .where(eq(donate_history.uid, input.owner)),
                            donations: await tx
                                .select()
                                .from(alliance_donate)
                                .where(eq(alliance_donate.uerid, input.owner)),
                            helps: groups.length
                                ? await tx
                                    .select()
                                    .from(alliance_help)
                                    .where(inArray(alliance_help.allianceId, groups))
                                    .limit(4097)
                                : [],
                            queues: await tx.select().from(queue).where(
                                inArray(queue.ownerId, participants),
                            ),
                            activities: await tx
                                .select({
                                    id: timed_activity.id,
                                    ownerId: timed_activity.ownerId,
                                    queueId: timed_activity.queueId,
                                    type: timed_activity.type,
                                    itemId: timed_activity.itemId,
                                    startedAt: timed_activity.startedAt,
                                    dueAt: timed_activity.dueAt,
                                    version: timed_activity.version,
                                    status: timed_activity.status,
                                })
                                .from(timed_activity)
                                .where(
                                    and(
                                        inArray(timed_activity.ownerId, participants),
                                        eq(timed_activity.status, 0),
                                    ),
                                ),
                            sharedGifts: selection.giftEvent
                                ? await tx
                                    .select()
                                    .from(alliance_gift)
                                    .where(eq(alliance_gift.uid, selection.giftEvent))
                                : [],
                            gifts: await tx
                                .select()
                                .from(user_gift)
                                .where(eq(user_gift.uid, input.owner))
                                .limit(2049),
                            mails: selection.mailId
                                ? await tx.select().from(mail).where(eq(mail.uid, selection.mailId))
                                : [],
                            directory: selection.key !== undefined && !selection.searchPlayers
                                ? await tx
                                    .select()
                                    .from(alliance)
                                    .where(
                                        input.command === "al.abbr"
                                            ? sql`lower(${alliance.abbr})=${selection.key.toLowerCase()}`
                                            : ["al.name", "al.checkname"].includes(input.command)
                                            ? sql`lower(${alliance.alliancename})=${selection.key.toLowerCase()}`
                                            : input.command === "al.create"
                                            ? sql`lower(${alliance.abbr})=${
                                                [...selection.key].slice(0, 3).join("")
                                                    .toLowerCase()
                                            }`
                                            : or(
                                                sql`position(${selection.key.toLowerCase()} in lower(${alliance.alliancename})) > 0`,
                                                sql`position(${selection.key.toLowerCase()} in lower(${alliance.abbr})) > 0`,
                                            ),
                                    )
                                    .orderBy(asc(alliance.uid))
                                    .limit(selection.pageSize ?? 10)
                                    .offset(
                                        ((selection.page ?? 1) - 1) * (selection.pageSize ?? 10),
                                    )
                                : [],
                            directoryTotal: selection.key !== undefined && !selection.searchPlayers
                                ? BigInt(
                                    (
                                        await tx
                                            .select({ total: sql<string>`count(*)::text` })
                                            .from(alliance)
                                            .where(
                                                or(
                                                    sql`position(${selection.key.toLowerCase()} in lower(${alliance.alliancename})) > 0`,
                                                    sql`position(${selection.key.toLowerCase()} in lower(${alliance.abbr})) > 0`,
                                                ),
                                            )
                                    )[0]!.total,
                                )
                                : 0n,
                            candidates: selection.searchPlayers
                                ? await tx
                                    .select({
                                        uid: userprofile.uid,
                                        name: userprofile.name,
                                        pic: userprofile.pic,
                                        picVer: userprofile.picVer,
                                        picfraId: userprofile.picfraId,
                                        lang: userprofile.lang,
                                        power: playerinfo.power,
                                        offLineTime: userprofile.offLineTime,
                                    })
                                    .from(userprofile)
                                    .innerJoin(playerinfo, eq(playerinfo.uid, userprofile.uid))
                                    .where(
                                        and(
                                            eq(userprofile.serverId, authority.kingdomId),
                                            sql`coalesce(${userprofile.allianceId},'')=''`,
                                            sql`coalesce(${userprofile.banFlag},0)=0`,
                                            sql`coalesce(${userprofile.banTime},0)<=${at}`,
                                            sql`position(${
                                                (selection.key ?? "").toLowerCase()
                                            } in lower(${userprofile.name}))>0`,
                                        ),
                                    )
                                    .orderBy(asc(userprofile.uid))
                                    .limit(10)
                                    .offset(((selection.page ?? 1) - 1) * 10)
                                : [],
                            blacklist: groups.length
                                ? await tx
                                    .select()
                                    .from(alliance_blacklist)
                                    .where(inArray(alliance_blacklist.allianceId, groups))
                                : [],
                        });
                        const apply = async () => {
                            for (const row of result.write.activities ?? [])
                            {
                                const [saved] = await tx
                                    .select()
                                    .from(timed_activity)
                                    .where(eq(timed_activity.id, text(row, "id")));
                                const domain = domains.get(Number(row.type));

                                if (!saved || !domain)
                                {
                                    throw new Error("Unsupported helped activity");
                                }

                                await domain(
                                    tx,
                                    "reschedule",
                                    {
                                        ...saved,
                                        dueAt: long(row, "dueAt"),
                                        version: Number(row.version),
                                    },
                                    at,
                                    {
                                        resource()
                                        {
                                            throw new Error("Unexpected help resource change");
                                        },
                                        gold()
                                        {
                                            throw new Error("Unexpected help gold change");
                                        },
                                        item()
                                        {
                                            throw new Error("Unexpected help item change");
                                        },
                                    },
                                );
                            }

                            await writeAlliance(
                                tx,
                                input.owner,
                                result.write,
                                participants,
                                groups,
                            );

                            for (const action of result.write.actions ?? [])
                            {
                                if (!participants.includes(action.uid))
                                {
                                    throw new Error("Foreign alliance action");
                                }

                                await recordAction?.(tx, action.uid, action.kind, action.count, at);
                            }
                        };
                        let change = apply;

                        for (
                            const owner of [...new Set(result.productionOwners ?? [])].sort()
                                .reverse()
                        )
                        {
                            if (!participants.includes(owner))
                            {
                                throw new Error("Foreign alliance production owner");
                            }

                            const nested = change;
                            change = () =>
                                boundary(tx, owner, result.productionAt ?? at, nested, [], {
                                    resource()
                                    {
                                        throw new Error("Unexpected alliance production credit");
                                    },
                                    gold()
                                    {
                                        throw new Error("Unexpected alliance gold credit");
                                    },
                                    item()
                                    {
                                        throw new Error("Unexpected alliance item credit");
                                    },
                                });
                        }

                        await change();

                        return result.inventory;
                    },
                    input.command,
                );
            });
        },
    };
}

async function writeAlliance(
    tx: MutationTransaction,
    owner: string,
    write: AllianceWrite,
    participants: readonly string[],
    groups: readonly string[],
)
{
    const allowed = new Set(groups);

    for (const row of write.alliances ?? [])
    {
        const id = text(row, "uid");

        if (!allowed.has(id))
        {
            if (
                !(write.memberships ?? []).some((entry) =>
                    entry.uid === owner && entry.allianceId === id
                )
            )
            {
                throw new Error("Foreign alliance creation");
            }

            allowed.add(id);
        }

        for (
            const [kind, value] of [
                ["name", text(row, "alliancename")],
                ["abbr", text(row, "abbr")],
            ].sort((a, b) => String(a).localeCompare(String(b)))
        )
        {
            await tx.execute(
                sql`select pg_advisory_xact_lock(hashtextextended(${`alliance:${kind}:${value?.toLowerCase()}`}, 0))`,
            );
            const existing = await tx
                .select({ id: alliance.uid })
                .from(alliance)
                .where(
                    kind === "name"
                        ? sql`lower(${alliance.alliancename}) = ${value?.toLowerCase()}`
                        : sql`lower(${alliance.abbr}) = ${value?.toLowerCase()}`,
                );

            if (existing.some((entry) => entry.id !== id))
            {
                throw new Error("Alliance name already exists");
            }
        }

        const value = row as typeof alliance.$inferInsert;
        await tx
            .insert(alliance)
            .values(value)
            .onConflictDoUpdate({ target: alliance.uid, set: value });
    }

    const check = (row: Row, field = "allianceId") => {
        if (!allowed.has(text(row, field)))
        {
            throw new Error("Foreign alliance write");
        }
    };

    for (const row of write.members ?? [])
    {
        check(row);

        if (!participants.includes(text(row, "uid")))
        {
            throw new Error("Foreign alliance member");
        }

        const value = row as typeof alliance_member.$inferInsert;
        await tx
            .insert(alliance_member)
            .values(value)
            .onConflictDoUpdate({ target: alliance_member.uid, set: value });
    }

    for (const id of write.removedMembers ?? [])
    {
        if (!participants.includes(id))
        {
            throw new Error("Foreign alliance removal");
        }

        await tx
            .update(alliance_member)
            .set({ allianceId: "", rank: 0 })
            .where(eq(alliance_member.uid, id));
        await tx.update(alliance_help).set({ isvalid: 0 }).where(eq(alliance_help.senderId, id));
    }

    for (const member of write.memberships ?? [])
    {
        if (
            !participants.includes(member.uid)
            || (member.allianceId && !allowed.has(member.allianceId))
        )
        {
            throw new Error("Foreign membership");
        }

        await tx
            .update(userprofile)
            .set({ allianceId: member.allianceId })
            .where(eq(userprofile.uid, member.uid));
        await tx
            .update(worldpoint)
            .set({ allianceId: member.allianceId })
            .where(eq(worldpoint.ownerId, member.uid));
        await tx.delete(alliance_apply).where(eq(alliance_apply.userId, member.uid));
        await tx.delete(alliance_donate).where(eq(alliance_donate.uerid, member.uid));
        await tx
            .update(world_march)
            .set({ allianceId: member.allianceId })
            .where(eq(world_march.ownerUid, member.uid));
    }

    for (const uid of write.firstJoin ?? [])
    {
        if (!participants.includes(uid))
        {
            throw new Error("Foreign first join");
        }

        await tx
            .insert(user_lord)
            .values({ uid, firstJoinAllianceFlag: 0 })
            .onConflictDoUpdate({ target: user_lord.uid, set: { firstJoinAllianceFlag: 0 } });
    }

    for (const row of write.applications ?? [])
    {
        check(row);
        const value = row as typeof alliance_apply.$inferInsert;
        await tx
            .insert(alliance_apply)
            .values(value)
            .onConflictDoUpdate({ target: alliance_apply.uid, set: value });
    }

    if (write.deletedApplications?.length)
    {
        await tx
            .delete(alliance_apply)
            .where(
                and(
                    inArray(alliance_apply.uid, [...write.deletedApplications]),
                    or(
                        inArray(alliance_apply.userId, [...participants]),
                        inArray(alliance_apply.allianceId, [...allowed]),
                    ),
                ),
            );
    }

    for (const row of write.sciences ?? [])
    {
        check(row);
        const value = row as typeof alliance_science.$inferInsert;
        await tx
            .insert(alliance_science)
            .values(value)
            .onConflictDoUpdate({
                target: [alliance_science.allianceId, alliance_science.scienceId],
                set: value,
            });
    }

    for (const row of write.research ?? [])
    {
        check(row);
        const value = row as typeof alliance_science_upgrade.$inferInsert;
        await tx
            .insert(alliance_science_upgrade)
            .values(value)
            .onConflictDoUpdate({ target: alliance_science_upgrade.allianceId, set: value });
    }

    if (write.deletedResearch?.length)
    {
        await tx.delete(alliance_science_upgrade).where(
            inArray(
                alliance_science_upgrade.allianceId,
                write.deletedResearch.filter((id) => allowed.has(id)),
            ),
        );
    }

    for (const row of write.history ?? [])
    {
        if (row.uid !== owner)
        {
            throw new Error("Foreign donation history");
        }

        check(row);
        const value = row as typeof donate_history.$inferInsert;
        await tx
            .insert(donate_history)
            .values(value)
            .onConflictDoUpdate({ target: donate_history.uid, set: value });
    }

    for (const row of write.donations ?? [])
    {
        if (row.uerid !== owner)
        {
            throw new Error("Foreign donation offer");
        }

        const value = row as typeof alliance_donate.$inferInsert;
        await tx
            .insert(alliance_donate)
            .values(value)
            .onConflictDoUpdate({
                target: [alliance_donate.uerid, alliance_donate.scienceid],
                set: value,
            });
    }

    for (const row of write.helps ?? [])
    {
        check(row);

        if (!participants.includes(text(row, "senderId")))
        {
            throw new Error("Foreign help sender");
        }

        const value = row as typeof alliance_help.$inferInsert;
        await tx
            .insert(alliance_help)
            .values(value)
            .onConflictDoUpdate({ target: alliance_help.helpId, set: value });
    }

    for (const row of write.queues ?? [])
    {
        if (!participants.includes(text(row, "ownerId")))
        {
            throw new Error("Foreign helped queue");
        }

        await tx
            .update(queue)
            .set({ updateTime: long(row, "updateTime"), isHelped: Number(row.isHelped) })
            .where(and(eq(queue.uuid, text(row, "uuid")), eq(queue.ownerId, text(row, "ownerId"))));
    }

    for (const row of write.activities ?? [])
    {
        if (!participants.includes(text(row, "ownerId")))
        {
            throw new Error("Foreign helped activity");
        }

        const updated = await tx
            .update(timed_activity)
            .set({ dueAt: long(row, "dueAt"), version: Number(row.version) })
            .where(
                and(
                    eq(timed_activity.id, text(row, "id")),
                    eq(timed_activity.version, Number(row.version) - 1),
                    eq(timed_activity.status, 0),
                ),
            )
            .returning({ id: timed_activity.id });

        if (updated.length !== 1)
        {
            throw new Error("Helped activity changed");
        }
    }

    if (write.publishedGift)
    {
        check(write.publishedGift, "allianceid");
        await tx.insert(alliance_gift).values(
            write.publishedGift as typeof alliance_gift.$inferInsert,
        );
    }

    for (const row of write.sharedGifts ?? [])
    {
        check(row);

        if (!participants.includes(text(row, "uid")))
        {
            throw new Error("Foreign shared gift recipient");
        }

        await tx.insert(user_gift).values(row as typeof user_gift.$inferInsert);
    }

    for (const row of write.gifts ?? [])
    {
        if (row.uid !== owner)
        {
            throw new Error("Foreign alliance gift");
        }

        await tx
            .update(user_gift)
            .set({ valid: Number(row.valid) })
            .where(and(eq(user_gift.uuid, text(row, "uuid")), eq(user_gift.uid, owner)));
    }

    if (write.deletedGifts?.length)
    {
        await tx
            .delete(user_gift)
            .where(and(eq(user_gift.uid, owner), inArray(user_gift.uuid, [...write.deletedGifts])));
    }

    for (const row of write.mailUpdates ?? [])
    {
        if (row.toUser !== owner || !Buffer.isBuffer(row.contents))
        {
            throw new Error("Foreign alliance mail update");
        }

        await tx
            .update(mail)
            .set({ contents: row.contents })
            .where(and(eq(mail.uid, text(row, "uid")), eq(mail.toUser, owner)));
    }

    for (const row of write.mails ?? [])
    {
        if (!participants.includes(text(row, "toUser")))
        {
            throw new Error("Foreign alliance mail");
        }

        const value = row as typeof mail.$inferInsert;
        const inserted = await tx
            .insert(mail)
            .values(value)
            .onConflictDoNothing()
            .returning({ id: mail.uid });

        if (inserted.length && value.type === 2)
        {
            await tx.insert(mail_group).values({
                uid: value.toUser,
                groupType: 2,
                groupIndex: value.uid,
                updateTime: value.createTime,
            });
        }
    }

    for (const row of write.blacklist ?? [])
    {
        check(row);
        const value = row as typeof alliance_blacklist.$inferInsert;
        await tx
            .insert(alliance_blacklist)
            .values(value)
            .onConflictDoUpdate({ target: alliance_blacklist.allianceId, set: value });
    }

    for (const id of write.deletedAlliances ?? [])
    {
        if (!allowed.has(id))
        {
            throw new Error("Foreign alliance deletion");
        }

        await tx.delete(alliance).where(eq(alliance.uid, id));
        await tx.delete(alliance_science).where(eq(alliance_science.allianceId, id));
        await tx.delete(alliance_science_upgrade).where(
            eq(alliance_science_upgrade.allianceId, id),
        );
        await tx.delete(alliance_apply).where(eq(alliance_apply.allianceId, id));
        await tx.update(alliance_help).set({ isvalid: 0 }).where(eq(alliance_help.allianceId, id));
    }
}
