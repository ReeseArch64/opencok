import { avatar_completion } from "@opencok/drizzle/schema/opencok_kingdom/avatar_completion";
import { avatarSequence } from "@opencok/rules/avatar";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { pic_upload_record } from "@opencok/drizzle/schema/opencok_kingdom/pic_upload_record";
import type { AvatarGrantInspector, AvatarGrantSnapshot } from "@opencok/contracts/files";
import { and, eq } from "drizzle-orm";
import type { Database } from "./game.ts";

export async function checkAvatarGrantStore(db: Database["kingdom"]["db"]) {
  await db.select({ uid: pic_upload_record.uid }).from(pic_upload_record).limit(0);
  await db.select({ sequence: avatar_completion.sequence }).from(avatar_completion).limit(0);
}

export function readAvatarGrant(
  db: Database["kingdom"]["db"],
  kingdomId: number,
  owner: string,
  now: number,
  inspect: AvatarGrantInspector,
): Promise<AvatarGrantSnapshot> {
  if (
    typeof owner !== "string" ||
    !/^[0-9]{1,20}$/.test(owner) ||
    !Number.isInteger(kingdomId) ||
    kingdomId < 1 ||
    kingdomId > 2147483647 ||
    !Number.isSafeInteger(now) ||
    now < 0
  )
    throw new Error("Invalid avatar grant query");

  return db.transaction(
    async (tx) => {
      const profile = (
        await tx
          .select({
            uid: userprofile.uid,
            serverId: userprofile.serverId,
            banTime: userprofile.banTime,
            banFlag: userprofile.banFlag,
            picVer: userprofile.picVer,
          })
          .from(userprofile)
          .where(eq(userprofile.uid, owner))
          .limit(1)
          .for("update")
      )[0];

      if (
        !profile ||
        profile.uid !== owner ||
        profile.serverId !== kingdomId ||
        (profile.banFlag ?? 0) !== 0 ||
        (profile.banTime ?? 0n) > BigInt(now)
      )
        return { profile };

      const sequence = avatarSequence(profile.picVer);
      let active = true;
      let castleRead = false;
      let recordRead = false;

      try {
        const grant = await inspect(profile, {
          async castleLevel() {
            if (!active || castleRead) throw new Error("Invalid avatar castle read");

            castleRead = true;
            const rows = await tx
              .select({ uid: user_building.uid, level: user_building.level })
              .from(user_building)
              .where(and(eq(user_building.uid, owner), eq(user_building.itemId, 400000)))
              .limit(2);

            if (rows.length > 1 || rows.some((row) => row.uid !== owner))
              throw new Error("Invalid avatar castle state");

            return rows[0]?.level ?? 0;
          },
          async uploadRecord() {
            if (!active || recordRead) throw new Error("Invalid avatar record read");

            recordRead = true;
            const rows = await tx
              .select({
                uid: pic_upload_record.uid,
                updateTime: pic_upload_record.updateTime,
                banTime: pic_upload_record.banTime,
              })
              .from(pic_upload_record)
              .where(eq(pic_upload_record.uid, owner))
              .limit(1);

            if (rows[0] && rows[0].uid !== owner) throw new Error("Invalid avatar record owner");

            return rows[0];
          },
        });
        const completed = await tx
          .select({ sequence: avatar_completion.sequence })
          .from(avatar_completion)
          .where(
            and(eq(avatar_completion.ownerUid, owner), eq(avatar_completion.sequence, sequence)),
          )
          .limit(1);

        if (completed.length) throw new Error("Avatar sequence already committed");

        return { profile, grant };
      } finally {
        active = false;
      }
    },
    { isolationLevel: "repeatable read", accessMode: "read write" },
  );
}
