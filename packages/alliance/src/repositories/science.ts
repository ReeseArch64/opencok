import { eq, inArray } from "drizzle-orm";
import { alliance_science } from "@opencok/drizzle/schema/opencok_kingdom/alliance_science";
import { alliance_science_upgrade } from "@opencok/drizzle/schema/opencok_kingdom/alliance_science_upgrade";
import { alliance_donate } from "@opencok/drizzle/schema/opencok_kingdom/alliance_donate";
import { donate_history } from "@opencok/drizzle/schema/opencok_kingdom/donate_history";
import type { AllianceTransaction } from "../contracts/persistence";
import type { AllianceScienceWrite } from "../contracts/science";
import type { AllianceSciencePersistenceRuntime } from "../contracts/science-runtime";

export class AllianceScienceRepository
{
    public constructor(
        private readonly tx: AllianceTransaction,
        private readonly owner: string,
        private readonly allowed: ReadonlySet<string>,
        private readonly runtime: AllianceSciencePersistenceRuntime,
    )
    {}

    public static async readSciences(tx: AllianceTransaction, groups: string[])
    {
        return groups.length
            ? await tx.select().from(alliance_science).where(
                inArray(alliance_science.allianceId, groups),
            )
            : [];
    }

    public static async readResearch(tx: AllianceTransaction, groups: string[])
    {
        return groups.length
            ? await tx.select().from(alliance_science_upgrade).where(
                inArray(alliance_science_upgrade.allianceId, groups),
            )
            : [];
    }

    public static readHistory(tx: AllianceTransaction, owner: string)
    {
        return tx.select().from(donate_history).where(eq(donate_history.uid, owner));
    }

    public static readDonations(tx: AllianceTransaction, owner: string)
    {
        return tx.select().from(alliance_donate).where(eq(alliance_donate.uerid, owner));
    }

    public static readPublishedSciences(tx: AllianceTransaction, id: string)
    {
        return tx.select().from(alliance_science).where(eq(alliance_science.allianceId, id));
    }

    public static readPublishedResearch(tx: AllianceTransaction, id: string)
    {
        return tx.select().from(alliance_science_upgrade).where(
            eq(alliance_science_upgrade.allianceId, id),
        );
    }

    public static removeDonations(tx: AllianceTransaction, owner: string)
    {
        return tx.delete(alliance_donate).where(eq(alliance_donate.uerid, owner));
    }

    public static async removeAlliance(tx: AllianceTransaction, id: string)
    {
        await tx.delete(alliance_science).where(eq(alliance_science.allianceId, id));
        await tx.delete(alliance_science_upgrade).where(
            eq(alliance_science_upgrade.allianceId, id),
        );
    }

    public async write(write: AllianceScienceWrite)
    {
        const { tx, owner, allowed } = this;
        const { check } = this.runtime;

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
    }
}
