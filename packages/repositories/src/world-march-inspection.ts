import { and, eq } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { ob_user } from "@opencok/drizzle/schema/opencok_kingdom/ob_user";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_pet_dragon } from "@opencok/drizzle/schema/opencok_kingdom/user_pet_dragon";
import { new_general_skill } from "@opencok/drizzle/schema/opencok_kingdom/new_general_skill";
import type { WorldMarchInspectionStore } from "@opencok/contracts/world-march-inspection";
import { readWorldResourceOwner } from "./world-resource-owner";
import type { Database } from "./game";

function identity(value: string) {
  if (!value || value.length > 40 || !value.isWellFormed() || value.includes("\0"))
    throw new Error("Invalid world march inspection identity");
}
export function createWorldMarchInspectionStore(
  db: Database["kingdom"]["db"],
): WorldMarchInspectionStore {
  return {
    async read(observer, owner, id, kingdomId, now) {
      for (const value of [observer, owner, id]) identity(value);
      if (!Number.isInteger(kingdomId) || kingdomId < 1 || !Number.isSafeInteger(now) || now < 0)
        throw new Error("Invalid world march inspection realm");
      return db.transaction(
        async (tx) => {
          const [self] = await tx
              .select({
                uid: userprofile.uid,
                alliance: userprofile.allianceId,
                serverId: userprofile.serverId,
                banTime: userprofile.banTime,
                banFlag: userprofile.banFlag,
              })
              .from(userprofile)
              .where(eq(userprofile.uid, observer)),
            [target] = await tx
              .select({
                uid: userprofile.uid,
                alliance: userprofile.allianceId,
                serverId: userprofile.serverId,
              })
              .from(userprofile)
              .where(eq(userprofile.uid, owner)),
            [observerRole] = await tx
              .select({ uid: ob_user.uid })
              .from(ob_user)
              .where(eq(ob_user.uid, observer));
          if (
            !self ||
            !target ||
            self.serverId !== kingdomId ||
            target.serverId !== kingdomId ||
            (self.banFlag ?? 0) !== 0 ||
            (self.banTime ?? 0n) > BigInt(now) ||
            (self.uid !== target.uid &&
              !observerRole &&
              (!self.alliance || self.alliance !== target.alliance))
          )
            return undefined;
          const [march] = await tx
            .select()
            .from(world_march)
            .where(
              and(
                eq(world_march.uuid, id),
                eq(world_march.ownerUid, owner),
                eq(world_march.worldId, 0),
              ),
            );
          if (!march) return undefined;
          const [point] = await tx
            .select()
            .from(worldpoint)
            .where(and(eq(worldpoint.worldId, 0), eq(worldpoint.id, march.targetId!)));
          const ownerState = await readWorldResourceOwner(tx, owner);
          if (!point || !ownerState) return undefined;
          const armies = await tx
              .select()
              .from(user_army)
              .where(eq(user_army.uid, owner))
              .limit(4097),
            dragons = await tx
              .select()
              .from(user_pet_dragon)
              .where(eq(user_pet_dragon.uid, owner))
              .limit(4097),
            skills = await tx
              .select()
              .from(new_general_skill)
              .where(eq(new_general_skill.uid, owner))
              .limit(4097);
          if ([armies, dragons, skills].some((rows) => rows.length > 4096))
            throw new Error("World march inspection bound exceeded");
          return { march, point, owner: ownerState, armies, dragons, skills };
        },
        { isolationLevel: "repeatable read", accessMode: "read only" },
      );
    },
  };
}
