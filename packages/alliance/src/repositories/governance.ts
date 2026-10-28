import { inArray, sql } from "drizzle-orm";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { alliance_blacklist } from "@opencok/drizzle/schema/opencok_kingdom/alliance_blacklist";
import type { AllianceTransaction } from "../contracts/persistence";
import type { AllianceGovernanceWrite } from "../contracts/governance";
import type { AlliancePersistenceRuntime } from "../contracts/persistence-runtime";

export class AllianceGovernanceRepository
{
    public constructor(
        private readonly tx: AllianceTransaction,
        private readonly runtime: AlliancePersistenceRuntime,
    )
    {}

    public static async readBlacklist(tx: AllianceTransaction, groups: string[])
    {
        return groups.length
            ? await tx.select().from(alliance_blacklist).where(
                inArray(alliance_blacklist.allianceId, groups),
            )
            : [];
    }

    public static async writeAlliances(
        tx: AllianceTransaction,
        owner: string,
        allowed: Set<string>,
        write: AllianceGovernanceWrite,
        text: AlliancePersistenceRuntime["text"],
    )
    {
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
    }

    public async writeMembers(write: AllianceGovernanceWrite, participants: readonly string[])
    {
        const { tx } = this;
        const { text, check } = this.runtime;

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
    }

    public async writeBlacklist(write: AllianceGovernanceWrite)
    {
        const { tx } = this;
        const { check } = this.runtime;

        for (const row of write.blacklist ?? [])
        {
            check(row);
            const value = row as typeof alliance_blacklist.$inferInsert;
            await tx
                .insert(alliance_blacklist)
                .values(value)
                .onConflictDoUpdate({ target: alliance_blacklist.allianceId, set: value });
        }
    }
}
