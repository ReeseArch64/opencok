import type { ProfilePreferenceField } from "@opencok/contracts/game";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { DependencyError } from "@opencok/errors/dependency";
import { eq } from "drizzle-orm";
import type { Database } from "./game.ts";

const columns = {
  showEquip: user_mixed_info.showEquip,
  showMedal: user_mixed_info.showMedal,
  marchSoldierShow: user_mixed_info.marchSoldierShow,
  colorblind: user_mixed_info.colorblind,
  scrollEquip: user_mixed_info.scrollEquip,
  showBanner: user_mixed_info.showBanner,
  clientSaveFlag: user_mixed_info.clientSaveFlag,
};

export async function updateProfilePreference(
  db: Database["kingdom"]["db"],
  uid: string,
  kingdomId: number,
  field: ProfilePreferenceField,
  now: number,
  readValue: () => number,
): Promise<number | undefined> {
  if (
    !uid ||
    uid.length > 40 ||
    uid.includes("\0") ||
    !uid.isWellFormed() ||
    !Number.isSafeInteger(now) ||
    now < 0 ||
    !Number.isInteger(kingdomId) ||
    kingdomId < 1 ||
    !Object.hasOwn(columns, field)
  )
    throw new DependencyError("profile preference input");
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
        throw new DependencyError("profile preference owner");
      const [mixed] = await tx
        .select({ uid: user_mixed_info.uid, value: columns[field] })
        .from(user_mixed_info)
        .where(eq(user_mixed_info.uid, uid))
        .limit(1)
        .for("update");
      if (!mixed) {
        if (field === "clientSaveFlag" || field === "showBanner") return undefined;
        throw new DependencyError("profile preference missing");
      }
      if (mixed.uid !== uid) throw new DependencyError("profile preference selection");
      const current = Number(mixed.value ?? 0);
      if (!Number.isInteger(current) || current < -2147483648 || current > 2147483647)
        throw new DependencyError("profile preference stored value");
      const value = readValue();
      if (
        !Number.isInteger(value) ||
        value < -2147483648 ||
        value > 2147483647 ||
        (field === "scrollEquip" && value !== 0 && value !== 1)
      )
        throw new DependencyError("profile preference value");
      if (field === "clientSaveFlag" || current !== value)
        await tx
          .update(user_mixed_info)
          .set({ [field]: field === "showBanner" ? BigInt(value) : value })
          .where(eq(user_mixed_info.uid, uid));
      return value;
    },
    { isolationLevel: "read committed", accessMode: "read write" },
  );
}
