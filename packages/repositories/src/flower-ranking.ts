import { eq, inArray } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { flower_ranking } from "@opencok/drizzle/schema/opencok_kingdom/flower_ranking";
import { time_notice } from "@opencok/drizzle/schema/opencok_kingdom/time_notice";
import type { FlowerRankingState } from "@opencok/contracts/flower-ranking";
import type { Database } from "./game.ts";

export async function readFlowerRanking(
  db: Database["kingdom"]["db"],
  uid: string,
  uids: readonly string[],
): Promise<FlowerRankingState> {
  if (!uid || uid.length > 40 || uids.length > 32767 || uids.some((id) => !id || id.length > 40))
    {throw new Error("Invalid flower ranking identities");}

  return db.transaction(
    async (tx) => {
      const profile = (
        await tx
          .select({
            uid: userprofile.uid,
            serverId: userprofile.serverId,
            banFlag: userprofile.banFlag,
            banTime: userprofile.banTime,
          })
          .from(userprofile)
          .where(eq(userprofile.uid, uid))
          .limit(1)
      )[0];

      if (!profile) {return { profile, profiles: [], hide: 0, time: undefined };}

      const hide =
        (
          await tx
            .select({ hide: flower_ranking.hideKing })
            .from(flower_ranking)
            .where(eq(flower_ranking.uid, uid))
            .limit(1)
        )[0]?.hide ?? 0;
      const time =
        (
          await tx
            .select({ value: time_notice.timeVal })
            .from(time_notice)
            .where(eq(time_notice.timeType, 0))
            .limit(1)
        )[0]?.value ?? undefined;
      const profiles = uids.length
        ? await tx
            .select({
              uid: userprofile.uid,
              name: userprofile.name,
              pic: userprofile.pic,
              picVer: userprofile.picVer,
              picfraId: userprofile.picfraId,
            })
            .from(userprofile)
            .where(inArray(userprofile.uid, [...new Set(uids)]))
        : [];

      return { profile, profiles, hide, time };
    },
    { isolationLevel: "repeatable read", accessMode: "read only" },
  );
}
