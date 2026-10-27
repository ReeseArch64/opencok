import { activity } from "@opencok/drizzle/schema/opencok_kingdom/activity";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import type { ActivityDirectorySnapshot } from "@opencok/contracts/activity-directory";
import { asc, eq, gt } from "drizzle-orm";
import type { Database } from "./game";

export async function readActivityDirectory(
  db: Database["kingdom"]["db"],
  owner: string,
): Promise<ActivityDirectorySnapshot> {
  if (!owner || owner.length > 40) throw new Error("Invalid activity directory owner");

  return db.transaction(
    async (tx) => {
      const [profile] = await tx
        .select({
          uid: userprofile.uid,
          serverId: userprofile.serverId,
          banFlag: userprofile.banFlag,
          banTime: userprofile.banTime,
        })
        .from(userprofile)
        .where(eq(userprofile.uid, owner))
        .limit(1);

      if (!profile) return { activities: [] };

      const activities = await tx
        .select()
        .from(activity)
        .where(gt(activity.openTime, 0n))
        .orderBy(asc(activity.id))
        .limit(4097);

      if (activities.length > 4096) throw new Error("Activity directory bound exceeded");

      return { profile, activities };
    },
    { isolationLevel: "repeatable read", accessMode: "read only" },
  );
}
