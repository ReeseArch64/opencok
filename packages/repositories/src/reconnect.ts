import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { asc, eq } from "drizzle-orm";
import type { ReconnectBaseState } from "@opencok/contracts/reconnect";
import type { Database } from "./game.ts";

export function readReconnectBase(
  db: Database["kingdom"]["db"],
  uid: string,
): Promise<ReconnectBaseState> {
  if (!uid.trim() || uid.length > 40) throw new Error("Invalid reconnect identity");
  return db.transaction(
    async (tx) => {
      const profile = (
        await tx
          .select({
            uid: userprofile.uid,
            serverId: userprofile.serverId,
            banFlag: userprofile.banFlag,
            banTime: userprofile.banTime,
            gold: userprofile.gold,
            paidGold: userprofile.paidGold,
            paidSpecialGold: userprofile.paidSpecialGold,
            dmmGold: userprofile.dmmGold,
            dmmPaidGold: userprofile.dmmPaidGold,
            dmmPaidSpecialGold: userprofile.dmmPaidSpecialGold,
          })
          .from(userprofile)
          .where(eq(userprofile.uid, uid))
          .limit(1)
      )[0];
      if (!profile) return { profile: undefined, armies: [] };
      const armies = await tx
        .select({
          armyId: user_army.armyId,
          free: user_army.free,
          march: user_army.march,
          level: user_army.level,
          train: user_army.train,
          finishTime: user_army.finishTime,
        })
        .from(user_army)
        .where(eq(user_army.uid, uid))
        .orderBy(asc(user_army.armyId))
        .limit(32768);
      if (armies.length > 32767) throw new Error("Reconnect armies exceed wire limit");
      return { profile, armies };
    },
    { isolationLevel: "repeatable read", accessMode: "read only" },
  );
}
