import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { alliance_science } from "@opencok/drizzle/schema/opencok_kingdom/alliance_science";
import { alliance_vedio } from "@opencok/drizzle/schema/opencok_kingdom/alliance_vedio";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { and, asc, eq, sql, sum } from "drizzle-orm";
import type { PublicAllianceState } from "@opencok/contracts/profile";
import type { Database } from "./game.ts";

type Transaction = Parameters<Parameters<Database["kingdom"]["db"]["transaction"]>[0]>[0];

export async function readProfileAlliance(
  tx: Transaction,
  allianceId: string,
  withEffects: boolean,
): Promise<PublicAllianceState> {
  const record = (
    await tx
      .select({
        uid: alliance.uid,
        alliancename: alliance.alliancename,
        abbr: alliance.abbr,
        abbrRename: alliance.abbrRename,
        intro: alliance.intro,
        announce: alliance.announce,
        icon: alliance.icon,
        language: alliance.language,
        country: alliance.country,
        curMember: alliance.curMember,
        maxMember: alliance.maxMember,
        recruit: alliance.recruit,
        oldfightpower: alliance.oldfightpower,
        giftlevel: alliance.giftlevel,
        alliancepoint: alliance.alliancepoint,
        reicon: alliance.reicon,
        rankone: alliance.rankone,
        ranktwo: alliance.ranktwo,
        rankthree: alliance.rankthree,
        rankfour: alliance.rankfour,
        rankfive: alliance.rankfive,
        createtime: alliance.createtime,
        dau: alliance.dau,
        rallyPoint: alliance.rallyPoint,
        ally: alliance.ally,
        enemy: alliance.enemy,
        other: alliance.other,
        powerRestriction: alliance.powerRestriction,
        castleRestriction: alliance.castleRestriction,
        camp: alliance.camp,
        crossFightEnemy: alliance.crossFightEnemy,
        ckfThroneFightFlag: alliance.ckfThroneFightFlag,
        cdfIndex: alliance.cdfIndex,
        cdfVersion: alliance.cdfVersion,
        targetScience: alliance.targetScience,
        permission: alliance.permission,
        wood: alliance.wood,
        food: alliance.food,
        iron: alliance.iron,
        stone: alliance.stone,
        sandstone: alliance.sandstone,
        diamond: alliance.diamond,
        marble: alliance.marble,
        granite: alliance.granite,
        limestone: alliance.limestone,
        donateItem: alliance.donateItem,
        bannerStyle: alliance.bannerStyle,
        taskNum: alliance.taskNum,
        taskLimit: alliance.taskLimit,
        taskFlushTime: alliance.taskFlushTime,
      })
      .from(alliance)
      .where(eq(alliance.uid, allianceId))
      .limit(1)
  )[0];
  if (!record) throw new Error("Missing public profile alliance");
  const leaders = await tx
    .select({ uid: userprofile.uid, name: userprofile.name })
    .from(alliance_member)
    .innerJoin(userprofile, eq(userprofile.uid, alliance_member.uid))
    .where(and(eq(alliance_member.allianceId, allianceId), eq(alliance_member.rank, 5)))
    .orderBy(asc(alliance_member.uid))
    .limit(2);
  if (leaders.length !== 1) throw new Error("Ambiguous public alliance leader");
  const totals = (
    await tx
      .select({ member: sql<string>`count(*)::text`, fightpower: sum(playerinfo.power) })
      .from(alliance_member)
      .innerJoin(playerinfo, eq(playerinfo.uid, alliance_member.uid))
      .where(eq(alliance_member.allianceId, allianceId))
  )[0];
  if (!totals || totals.member === "0") throw new Error("Missing public alliance member totals");
  const sciences = withEffects
    ? await tx
        .select({ scienceId: alliance_science.scienceId, level: alliance_science.level })
        .from(alliance_science)
        .where(eq(alliance_science.allianceId, allianceId))
        .orderBy(asc(alliance_science.scienceId))
        .limit(32768)
    : [];
  if (sciences.length > 32767) throw new Error("Public alliance science collection exceeds limit");
  const video = (
    await tx
      .select({
        allianceId: alliance_vedio.allianceId,
        vedioURL: alliance_vedio.vedioURL,
        thumbnailURL: alliance_vedio.thumbnailURL,
        vedioH: alliance_vedio.vedioH,
        vedioW: alliance_vedio.vedioW,
        vedioSize: alliance_vedio.vedioSize,
        vedioLength: alliance_vedio.vedioLength,
        checkSign: alliance_vedio.checkSign,
      })
      .from(alliance_vedio)
      .where(eq(alliance_vedio.allianceId, allianceId))
      .limit(1)
  )[0];
  return { alliance: record, leader: leaders[0]!, totals, sciences, video, withEffects };
}
