import { AllianceQueryRepository } from "@opencok/alliance/repositories/queries";
import { AllianceMembershipRepository } from "@opencok/alliance/repositories/membership";
import { AllianceApplicationsRepository } from "@opencok/alliance/repositories/applications";
import { AllianceGovernanceRepository } from "@opencok/alliance/repositories/governance";
import { AllianceScienceRepository } from "@opencok/alliance/repositories/science";
import { AllianceGiftRepository } from "@opencok/alliance/repositories/gifts";
import { AllianceHelpRepository } from "@opencok/alliance/repositories/help";
import { AllianceApplicationsMapper } from "@opencok/alliance/mappings/applications";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { and, asc, eq, inArray, or } from "drizzle-orm";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { alliance_apply } from "@opencok/drizzle/schema/opencok_kingdom/alliance_apply";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { timed_activity } from "@opencok/drizzle/schema/opencok_kingdom/timed_activity";
import type { AllianceRepository, AllianceWrite } from "@opencok/contracts/alliance-gameplay";
import { text, long, type Row } from "@opencok/contracts/rows";
import { createMutationExecutor, type MutationTransaction } from "./mutation";
import { executeRealmInventoryTransaction } from "@opencok/repositories/inventory-runtime";
import type { ProgressionBoundary } from "@opencok/contracts/progression-boundary";
import type { RealmAuthority } from "./realm-authority";
import type { ActivityDomain } from "./timed-activity";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export function createAllianceRepository(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
    boundary: ProgressionBoundary<MutationTransaction>,
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
                    const data = AllianceApplicationsMapper.mailData(message.contents);

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

                const applications = await AllianceApplicationsRepository.read(
                    tx,
                    participants,
                    groups,
                );

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
                            lords: await AllianceMembershipRepository.lords(tx, participants),
                            cities: await tx
                                .select()
                                .from(user_building)
                                .where(inArray(user_building.uid, participants)),
                            powers: await tx
                                .select()
                                .from(playerinfo)
                                .where(inArray(playerinfo.uid, participants)),
                            points: await AllianceMembershipRepository.points(tx, participants),
                            marches: await AllianceMembershipRepository.marches(tx, participants),
                            sciences: await AllianceScienceRepository.readSciences(tx, groups),
                            research: await AllianceScienceRepository.readResearch(tx, groups),
                            history: await AllianceScienceRepository.readHistory(tx, input.owner),
                            donations: await AllianceScienceRepository.readDonations(
                                tx,
                                input.owner,
                            ),
                            helps: await AllianceHelpRepository.readGroups(tx, groups),
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
                            sharedGifts: await AllianceGiftRepository.readEvent(
                                tx,
                                selection.giftEvent,
                            ),
                            gifts: await AllianceGiftRepository.readOwned(tx, input.owner),
                            mails: await AllianceApplicationsRepository.readMail(
                                tx,
                                selection.mailId,
                            ),
                            directory: await AllianceQueryRepository.directory(
                                tx,
                                input.command,
                                selection,
                            ),
                            directoryTotal: await AllianceQueryRepository.total(tx, selection),
                            candidates: await AllianceQueryRepository.candidates(
                                tx,
                                selection,
                                authority.kingdomId,
                                at,
                            ),
                            blacklist: await AllianceGovernanceRepository.readBlacklist(tx, groups),
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

    await AllianceGovernanceRepository.writeAlliances(tx, owner, allowed, write, text);

    const check = (row: Row, field = "allianceId") => {
        if (!allowed.has(text(row, field)))
        {
            throw new Error("Foreign alliance write");
        }
    };

    await new AllianceGovernanceRepository(tx, { text, check }).writeMembers(write, participants);

    const membership = new AllianceMembershipRepository(tx, participants, allowed, { text, check });

    await membership.remove(write);

    await membership.memberships(write);

    await membership.firstJoin(write);

    await new AllianceApplicationsRepository(tx, { text, check }).write(
        write,
        participants,
        allowed,
    );

    await new AllianceScienceRepository(tx, owner, allowed, { text, check }).write(write);

    await new AllianceHelpRepository(tx, participants, { text, long, check }).write(write);

    await new AllianceGiftRepository(tx, owner, participants, { text, check }).write(write);

    await new AllianceApplicationsRepository(tx, { text, check }).updateMail(write, owner);

    await membership.mail(write);

    await new AllianceGovernanceRepository(tx, { text, check }).writeBlacklist(write);

    for (const id of write.deletedAlliances ?? [])
    {
        if (!allowed.has(id))
        {
            throw new Error("Foreign alliance deletion");
        }

        await tx.delete(alliance).where(eq(alliance.uid, id));
        await AllianceScienceRepository.removeAlliance(tx, id);
        await tx.delete(alliance_apply).where(eq(alliance_apply.allianceId, id));
        await AllianceHelpRepository.invalidateAlliance(tx, id);
    }
}
