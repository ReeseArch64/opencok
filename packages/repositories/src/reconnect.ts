import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_general } from "@opencok/drizzle/schema/opencok_kingdom/user_general";
import { user_skill } from "@opencok/drizzle/schema/opencok_kingdom/user_skill";
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
      if (!profile) return { profile: undefined, armies: [], generals: [], skills: [] };
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
      const generals = await tx
        .select({
          uuid: user_general.uuid,
          generalId: user_general.generalId,
          level: user_general.level,
          status: user_general.status,
          ability: user_general.ability,
          abilityIndex: user_general.abilityIndex,
        })
        .from(user_general)
        .where(eq(user_general.uid, uid))
        .orderBy(asc(user_general.uuid))
        .limit(32768);
      if (generals.length > 32767) throw new Error("Reconnect generals exceed wire limit");
      const skills = generals.length
        ? await tx
            .select({
              uuid: user_skill.uuid,
              ownerId: user_skill.ownerId,
              skillId: user_skill.skillId,
              startTime: user_skill.startTime,
              endTime: user_skill.endTime,
              actTime: user_skill.actTime,
              stat: user_skill.stat,
              param1: user_skill.param1,
              param2: user_skill.param2,
            })
            .from(user_skill)
            .where(eq(user_skill.ownerId, uid))
            .orderBy(asc(user_skill.endTime), asc(user_skill.uuid))
            .limit(32768)
        : [];
      if (skills.length > 32767) throw new Error("Reconnect skills exceed wire limit");
      return { profile, armies, generals, skills };
    },
    { isolationLevel: "repeatable read", accessMode: "read only" },
  );
}
