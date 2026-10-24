import type { PushPreference } from "@opencok/contracts/game";
import { parse_info } from "@opencok/drizzle/schema/opencok_kingdom/parse_info";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { DependencyError } from "@opencok/errors/dependency";
import { and, eq } from "drizzle-orm";
import type { Database } from "./game.ts";

export async function setPushPreference(
  db: Database["kingdom"]["db"],
  uid: string,
  kingdomId: number,
  input: PushPreference,
  now: number,
): Promise<void> {
  const preference = { type: input.type, status: input.status, audio: input.audio };
  if (
    !uid ||
    uid.length > 40 ||
    uid.includes("\0") ||
    !uid.isWellFormed() ||
    !Number.isSafeInteger(now) ||
    now < 0 ||
    !Number.isInteger(kingdomId) ||
    kingdomId < 1 ||
    Object.values(preference).some(
      (value) => !Number.isInteger(value) || value < -2147483648 || value > 2147483647,
    )
  )
    throw new DependencyError("push preference input");
  await db.transaction(
    async (tx) => {
      const [profile] = await tx
        .select({
          uid: userprofile.uid,
          serverId: userprofile.serverId,
          banFlag: userprofile.banFlag,
          banTime: userprofile.banTime,
        })
        .from(userprofile)
        .where(eq(userprofile.uid, uid))
        .limit(1)
        .for("update");
      if (
        !profile ||
        profile.uid !== uid ||
        profile.serverId !== kingdomId ||
        (profile.banFlag ?? 0) !== 0 ||
        (profile.banTime ?? 0n) > BigInt(now)
      )
        throw new DependencyError("push preference owner");
      const key = and(eq(parse_info.uid, uid), eq(parse_info.type, preference.type));
      const [existing] = await tx.select({ uid: parse_info.uid }).from(parse_info).where(key);
      if (existing) {
        if (existing.uid !== uid) throw new DependencyError("push preference selection");
        await tx
          .update(parse_info)
          .set({ status: preference.status, audio: preference.audio })
          .where(key);
      } else await tx.insert(parse_info).values({ uid, ...preference });
    },
    { isolationLevel: "read committed", accessMode: "read write" },
  );
}
