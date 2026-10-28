import { eq } from "drizzle-orm";
import { new_sercum_recharge } from "@opencok/drizzle/schema/opencok_kingdom/new_sercum_recharge";
import { user_lord } from "@opencok/drizzle/schema/opencok_kingdom/user_lord";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { long } from "@opencok/contracts/rows";
import { cityAmount } from "@opencok/rules/city-progression";
import type { RechargeActivityWrite } from "@opencok/contracts/recharge-activity";
import type { MutationTransaction } from "./mutation";

export async function readRechargeActivity(tx: MutationTransaction, owner: string)
{
    const claims = await tx
        .select()
        .from(new_sercum_recharge)
        .where(eq(new_sercum_recharge.uid, owner))
        .limit(1025)
        .for("update");

    if (claims.length > 1024)
    {
        throw new Error("Too many recharge activity claims");
    }

    const [server] = await tx.select().from(server_info).where(eq(server_info.uid, "server"));

    return { claims, openedAt: long(server ?? {}, "activityTime") };
}

export async function writeRechargeActivity(
    tx: MutationTransaction,
    owner: string,
    write: RechargeActivityWrite,
)
{
    if (write.total !== undefined)
    {
        const total = cityAmount(write.total);
        await tx
            .insert(user_lord)
            .values({ uid: owner, newSerCumRechargeTotal: total })
            .onConflictDoUpdate({ target: user_lord.uid, set: { newSerCumRechargeTotal: total } });
    }

    if (
        (write.claims?.length ?? 0) > 1024
        || new Set(write.claims).size !== (write.claims?.length ?? 0)
    )
    {
        throw new Error("Invalid recharge activity claims");
    }

    for (const id of write.claims ?? [])
    {
        if (!/^\d{1,10}$/.test(id))
        {
            throw new Error("Invalid recharge activity threshold");
        }

        await tx.insert(new_sercum_recharge).values({ uid: owner, id });
    }
}
