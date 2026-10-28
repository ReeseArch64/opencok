import { eq, inArray, or } from "drizzle-orm";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { alliance_apply } from "@opencok/drizzle/schema/opencok_kingdom/alliance_apply";
import { user_lord } from "@opencok/drizzle/schema/opencok_kingdom/user_lord";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mail_group } from "@opencok/drizzle/schema/opencok_kingdom/mail_group";
import type { AllianceTransaction } from "../contracts/persistence";
import type { AlliancePersistenceRuntime } from "../contracts/persistence-runtime";
import type { AllianceMembershipWrite } from "../contracts/membership";
import type { AllianceGovernanceWrite } from "../contracts/governance";
import { AllianceHelpRepository } from "./help";
import { AllianceScienceRepository } from "./science";

export class AllianceMembershipRepository
{
    public constructor(
        private readonly tx: AllianceTransaction,
        private readonly participants: readonly string[],
        private readonly allowed: ReadonlySet<string>,
        private readonly runtime: AlliancePersistenceRuntime,
    )
    {}

    public static async lords(tx: AllianceTransaction, participants: string[])
    {
        return await tx.select().from(user_lord).where(
            inArray(user_lord.uid, participants),
        );
    }

    public static async points(tx: AllianceTransaction, participants: string[])
    {
        return await tx
            .select()
            .from(worldpoint)
            .where(inArray(worldpoint.ownerId, participants));
    }

    public static async marches(tx: AllianceTransaction, participants: string[])
    {
        return await tx
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
            .limit(8193);
    }

    public async remove(write: AllianceMembershipWrite & AllianceGovernanceWrite)
    {
        const { tx, participants } = this;

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
            await AllianceHelpRepository.invalidateSender(tx, id);
        }
    }

    public async memberships(write: AllianceMembershipWrite & AllianceGovernanceWrite)
    {
        const { tx, participants, allowed } = this;

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
            await AllianceScienceRepository.removeDonations(tx, member.uid);
            await tx
                .update(world_march)
                .set({ allianceId: member.allianceId })
                .where(eq(world_march.ownerUid, member.uid));
        }
    }

    public async firstJoin(write: AllianceMembershipWrite & AllianceGovernanceWrite)
    {
        const { tx, participants } = this;

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
    }

    public async mail(write: AllianceMembershipWrite & AllianceGovernanceWrite)
    {
        const { tx, participants } = this;
        const { text } = this.runtime;

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
    }
}
