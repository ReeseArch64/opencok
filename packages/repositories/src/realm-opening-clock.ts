import { eq, sql } from "drizzle-orm";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export async function initializeRealmOpeningClock(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
    now = Date.now(),
)
{
    if (!Number.isSafeInteger(now) || now <= 0)
    {
        throw new Error("Invalid realm opening clock");
    }

    return db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        await tx.execute(sql`select pg_advisory_xact_lock(728215, 0)`);
        const [existing] = await tx
            .select({ activityTime: server_info.activityTime })
            .from(server_info)
            .where(eq(server_info.uid, "server"));

        if (existing)
        {
            return existing.activityTime;
        }

        const [profile] = await tx.select({ uid: userprofile.uid }).from(userprofile).limit(1);

        if (profile)
        {
            return null;
        }

        const [created] = await tx
            .insert(server_info)
            .values({ uid: "server", activityTime: BigInt(now) })
            .onConflictDoNothing()
            .returning({ activityTime: server_info.activityTime });

        return created?.activityTime ?? null;
    });
}
