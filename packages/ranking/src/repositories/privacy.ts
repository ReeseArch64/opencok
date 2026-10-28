import { eq } from "drizzle-orm";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";

export async function readRankingPrivacy(
    db: DatabaseClient<"kingdom">,
    uid: string,
    kind: "payment" | "consumption",
): Promise<number>
{
    if (!uid || uid.length > 40 || (kind !== "payment" && kind !== "consumption"))
    {
        throw new Error("Invalid ranking privacy request");
    }

    const column = kind === "payment" ? user_mixed_info.payHide : user_mixed_info.costHide;
    const rows = await db
        .select({ hide: column })
        .from(user_mixed_info)
        .where(eq(user_mixed_info.uid, uid))
        .limit(1);

    return rows[0]?.hide ?? 0;
}
