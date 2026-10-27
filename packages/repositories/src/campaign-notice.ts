import { and, eq, inArray, sql } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { flower_info } from "@opencok/drizzle/schema/opencok_kingdom/flower_info";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";
import type { CampaignAudience } from "@opencok/contracts/campaign-notice";
import type { MutationTransaction } from "./mutation";
import type { Database } from "./game";

export async function readCampaignProfile(tx: MutationTransaction, owner: string) {
  const [row] = await tx
    .select({
      flowerRank: flower_info.lastflowerRanking,
      memberRank: alliance_member.rank,
      allianceId: alliance.uid,
      allianceName: alliance.alliancename,
    })
    .from(userprofile)
    .leftJoin(flower_info, eq(flower_info.uid, userprofile.uid))
    .leftJoin(
      alliance_member,
      and(
        eq(alliance_member.uid, userprofile.uid),
        eq(alliance_member.allianceId, userprofile.allianceId),
      ),
    )
    .leftJoin(alliance, eq(alliance.uid, alliance_member.allianceId))
    .where(eq(userprofile.uid, owner))
    .limit(1);

  return row;
}

export function createCampaignAudience(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
): CampaignAudience {
  return {
    select(owners, allianceId, now) {
      if (
        owners.length > 500 ||
        new Set(owners).size !== owners.length ||
        owners.some((owner) => !owner || owner.length > 40) ||
        now < 0n ||
        (allianceId !== undefined && (!allianceId || allianceId.length > 40))
      )
        {throw new Error("Invalid campaign audience page");}

      return db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);

        if (!owners.length) {return [];}

        const rows = await tx
          .select({ uid: userprofile.uid })
          .from(userprofile)
          .leftJoin(alliance_member, eq(alliance_member.uid, userprofile.uid))
          .where(
            and(
              inArray(userprofile.uid, [...owners]),
              eq(userprofile.serverId, authority.kingdomId),
              sql`coalesce(${userprofile.crossFightSrcServerId},-1)<=0 and coalesce(${userprofile.banFlag},0)=0 and coalesce(${userprofile.banTime},0)<=${now}`,
              allianceId
                ? and(
                    eq(userprofile.allianceId, allianceId),
                    eq(alliance_member.allianceId, allianceId),
                  )
                : undefined,
            ),
          );
        authority.assertReady();

        return rows.map((row) => row.uid);
      });
    },
  };
}
