import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import { user_science } from "@opencok/drizzle/schema/opencok_kingdom/user_science";
import { user_civilization_science } from "@opencok/drizzle/schema/opencok_kingdom/user_civilization_science";
import { asc, eq } from "drizzle-orm";
import { text, num, long, type Row } from "@opencok/contracts/rows";

type ResearchTransaction = Parameters<Parameters<DatabaseClient<"kingdom">["transaction"]>[0]>[0];

export class ResearchRepository
{
    public constructor(private readonly tx: ResearchTransaction, private readonly owner: string)
    {}

    public async read()
    {
        const { tx, owner } = this;

        return tx.select().from(user_science).where(eq(user_science.uid, owner))
            .orderBy(asc(user_science.itemId)).limit(4097);
    }

    public async readCivilization()
    {
        const { tx, owner } = this;

        return tx.select().from(user_civilization_science).where(
            eq(user_civilization_science.userID, owner),
        ).limit(4097);
    }

    public async levels()
    {
        const { tx, owner } = this;

        return tx.select({ itemId: user_science.itemId, level: user_science.level })
            .from(user_science).where(eq(user_science.uid, owner));
    }

    public async writeValidated(rows: readonly Row[])
    {
        const { tx, owner } = this;

        for (const row of rows)
        {
            const value = {
                uid: owner,
                itemId: text(row, "itemId"),
                level: num(row, "level"),
                cd: long(row, "cd"),
            };
            await tx
                .insert(user_science)
                .values(value)
                .onConflictDoUpdate({
                    target: [user_science.uid, user_science.itemId],
                    set: value,
                });
        }
    }

    public async writeCivilization(rows: readonly Row[])
    {
        const { tx, owner } = this;

        for (const row of rows)
        {
            if (row.userID !== owner)
            {
                throw new Error("Foreign civilization science write");
            }

            const value = {
                userID: owner,
                baseItemID: num(row, "baseItemID"),
                level: num(row, "level"),
            };
            await tx
                .insert(user_civilization_science)
                .values(value)
                .onConflictDoUpdate({
                    target: [
                        user_civilization_science.baseItemID,
                        user_civilization_science.userID,
                    ],
                    set: { level: value.level },
                });
        }
    }
}
