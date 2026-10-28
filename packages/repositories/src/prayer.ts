import { eq } from "drizzle-orm";
import { user_pray } from "@opencok/drizzle/schema/opencok_kingdom/user_pray";
import { pray_record } from "@opencok/drizzle/schema/opencok_kingdom/pray_record";
import { cityInteger, cityAmount } from "@opencok/rules/city-progression";
import { prayerFields } from "@opencok/rules/prayer";
import type { PrayerWrite } from "@opencok/contracts/prayer";
import type { MutationTransaction } from "./mutation";

export async function readPrayer(tx: MutationTransaction, owner: string)
{
    const [record] = await tx.select().from(user_pray).where(eq(user_pray.uid, owner)).for(
        "update",
    );

    return { record };
}

export async function writePrayer(tx: MutationTransaction, owner: string, write: PrayerWrite)
{
    const row = write.record;

    if (row.uid !== owner)
    {
        throw new Error("Foreign prayer state");
    }

    const counters: Record<string, number> = {};

    for (
        const key of [
            "freeFromItem",
            "itemPrayCount",
            "prayCount",
            "isFirstFree",
            "isFirstPay",
            ...prayerFields,
            ...prayerFields.map((field) => `gold${field}`),
        ]
    )
    {
        counters[key] = cityInteger(row[key] ?? 0);
    }

    if (counters.isFirstFree! > 1 || counters.isFirstPay! > 1)
    {
        throw new Error("Invalid prayer first-use flags");
    }

    const value = { uid: owner, ...counters, lastPrayTime: cityAmount(row.lastPrayTime) };
    await tx
        .insert(user_pray)
        .values(value)
        .onConflictDoUpdate({ target: user_pray.uid, set: value });

    if (write.history)
    {
        const entry = write.history;

        if (!prayerFields.includes(entry.resource as (typeof prayerFields)[number]))
        {
            throw new Error("Invalid prayer history resource");
        }

        await tx.insert(pray_record).values({
            uid: owner,
            cost: cityInteger(entry.cost),
            resource: entry.resource,
            num: cityInteger(entry.amount),
            hit: cityInteger(entry.hit, 1, 10),
            prayTime: cityAmount(entry.at),
        });
    }
}
