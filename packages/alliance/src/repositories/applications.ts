import { and, eq, inArray, or } from "drizzle-orm";
import { alliance_apply } from "@opencok/drizzle/schema/opencok_kingdom/alliance_apply";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import type { AllianceTransaction } from "../contracts/persistence";
import type { AllianceApplicationWrite } from "../contracts/applications";
import type { AlliancePersistenceRuntime } from "../contracts/persistence-runtime";

export class AllianceApplicationsRepository
{
    public constructor(
        private readonly tx: AllianceTransaction,
        private readonly runtime: AlliancePersistenceRuntime,
    )
    {}

    public static async read(tx: AllianceTransaction, participants: string[], groups: string[])
    {
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

        return applications;
    }

    public static async readMail(tx: AllianceTransaction, mailId?: string)
    {
        return mailId ? await tx.select().from(mail).where(eq(mail.uid, mailId)) : [];
    }

    public async write(
        write: AllianceApplicationWrite,
        participants: readonly string[],
        allowed: ReadonlySet<string>,
    )
    {
        const { tx } = this;
        const { check } = this.runtime;

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
    }

    public async updateMail(write: AllianceApplicationWrite, owner: string)
    {
        const { tx } = this;
        const { text } = this.runtime;

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
    }
}
