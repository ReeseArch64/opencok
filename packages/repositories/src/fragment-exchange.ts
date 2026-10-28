import { eq } from "drizzle-orm";
import { exchange_activity } from "@opencok/drizzle/schema/opencok_kingdom/exchange_activity";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import { readFragmentExchangeOffers } from "@opencok/rules/fragment-exchange";
import { num, text, type Row } from "@opencok/contracts/rows";
import type { MutationTransaction } from "./mutation";

export async function readFragmentExchanges(tx: MutationTransaction, owner: string)
{
    const rows = await tx
        .select()
        .from(exchange_activity)
        .where(eq(exchange_activity.uid, owner))
        .limit(65)
        .for("update");

    if (rows.length > 64)
    {
        throw new Error("Fragment exchange aggregate exceeds bound");
    }

    return rows;
}

export async function writeFragmentExchanges(
    tx: MutationTransaction,
    owner: string,
    rows: readonly Row[],
)
{
    if (rows.length > 64 || new Set(rows.map((row) => row.actId)).size !== rows.length)
    {
        throw new Error("Invalid fragment exchange writes");
    }

    for (const row of rows)
    {
        const id = text(row, "actId");

        if (row.uid !== owner || !/^\d{1,10}$/.test(id) || !Buffer.isBuffer(row.reward))
        {
            throw new Error("Invalid owned fragment exchange");
        }

        readFragmentExchangeOffers(row.reward);
        const value = {
            reward: row.reward,
            refresh: cityInteger(num(row, "refresh")),
            refreshTime: cityAmount(row.refreshTime),
        };
        await tx
            .insert(exchange_activity)
            .values({ uid: owner, actId: id, ...value })
            .onConflictDoUpdate({
                target: [exchange_activity.uid, exchange_activity.actId],
                set: value,
            });
    }
}
