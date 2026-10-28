import { eq, asc, and } from "drizzle-orm";
import { egg_activity } from "@opencok/drizzle/schema/opencok_kingdom/egg_activity";
import { user_egg } from "@opencok/drizzle/schema/opencok_kingdom/user_egg";
import { eggActivityRecord, eggActivityCollection } from "@opencok/rules/egg-activity";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import { text } from "@opencok/contracts/rows";
import type { EggActivityState, EggActivityWrite } from "@opencok/contracts/egg-activity";
import type { MutationTransaction } from "./mutation";

export async function readEggActivity(
    tx: MutationTransaction,
    owner: string,
): Promise<EggActivityState>
{
    const [record] = await tx
        .select()
        .from(egg_activity)
        .where(eq(egg_activity.uid, owner))
        .for("update");
    const collections = await tx
        .select()
        .from(user_egg)
        .where(eq(user_egg.uid, owner))
        .orderBy(asc(user_egg.eggId))
        .limit(33);

    if (collections.length > 32)
    {
        throw new Error("Egg collections exceed bound");
    }

    return { record, collections };
}

export async function writeEggActivity(
    tx: MutationTransaction,
    owner: string,
    write: EggActivityWrite,
)
{
    if (write.record)
    {
        const row = eggActivityRecord(write.record, owner),
            value = {
                uid: owner,
                curEgg: text(row, "curEgg"),
                eggCd: cityAmount(row.eggCd),
                exp: cityInteger(row.exp ?? 0),
                curExpStage: cityInteger(row.curExpStage ?? 0),
            };
        await tx
            .insert(egg_activity)
            .values(value)
            .onConflictDoUpdate({ target: egg_activity.uid, set: value });
    }

    if (write.collection)
    {
        const row = eggActivityCollection(write.collection, owner),
            value = {
                uid: owner,
                eggId: text(row, "eggId"),
                goods: text(row, "goods"),
                reward: cityInteger(row.reward ?? 0, 0, 1),
            };

        if (!value.goods)
        {
            throw new Error("Empty egg collection mutation");
        }

        const [before] = await tx
            .select()
            .from(user_egg)
            .where(and(eq(user_egg.uid, owner), eq(user_egg.eggId, value.eggId)));

        if (before?.reward === 1 && value.reward !== 1)
        {
            throw new Error("Reversed egg collection claim");
        }

        await tx
            .insert(user_egg)
            .values(value)
            .onConflictDoUpdate({ target: [user_egg.uid, user_egg.eggId], set: value });
    }
}
