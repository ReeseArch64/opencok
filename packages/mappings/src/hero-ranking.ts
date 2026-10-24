import type { Row } from "@opencok/contracts/rows";
import { javaDecimal } from "@opencok/rules/java-integer";
import type { HeroSelfRanking } from "@opencok/contracts/hero-ranking";
import { sfs, type Fields } from "@opencok/messages/sfs";
import {
  heroSelfRankingSchema,
  heroInsideRankingSchema,
  heroHistorySchema,
} from "@opencok/validations/hero-ranking";
import { validateFields } from "./validation.ts";

export function heroSelfRanking(result: HeroSelfRanking): Fields {
  return validateFields(heroSelfRankingSchema, {
    eventList: sfs.array([]),
    ranking: sfs.int(result.ranking),
    rankingAlliance: sfs.int(result.rankingAlliance),
    type: sfs.int(result.type),
  });
}

export function heroInsideRanking(rows: readonly Row[]): Fields {
  return validateFields(heroInsideRankingSchema, {
    rankList: sfs.array(
      rows.map((row, index) => {
        const result: Fields = {};
        for (const key of ["uid", "name", "pic"])
          if (row[key] != null) result[key] = sfs.string(String(row[key]));
        for (const key of ["picVer", "picfraId"])
          result[key] = sfs.int(Number(javaDecimal(String(row[key] ?? 0), 32)));
        const power = javaDecimal(String(row.power ?? 0), 64);
        if (power > 0n) result.power = sfs.long(power);
        for (const key of ["abbr", "lang"])
          if (row[key] != null) result[key] = sfs.string(String(row[key]));
        if (Number(row.mainBuildingLevel) > 0)
          result.mainBuildingLevel = sfs.int(Number(row.mainBuildingLevel));
        if (row.allianceId != null) result.allianceId = sfs.string(String(row.allianceId));
        for (const key of ["gmFlag", "crossFightSrcServerId", "vipLevel", "svipLevel"])
          result[key] = sfs.int(
            Number(javaDecimal(String(row[key] ?? (key === "crossFightSrcServerId" ? -1 : 0)), 32)),
          );
        for (const key of ["vipEndTime", "offLineTime"]) {
          const value = javaDecimal(String(row[key] ?? 0), 64);
          if (value > 0n) result[key] = sfs.long(value);
        }
        result.rank = sfs.int(index + 1);
        result.score = sfs.int(Number(javaDecimal(String(row.score), 32)));
        return sfs.object(result);
      }),
    ),
  });
}

export function heroHistory(
  rows: readonly { event: Row; members: readonly Row[]; realms: readonly Row[] }[],
): Fields {
  const byTime = new Map<bigint, Fields>();
  for (const row of rows) {
    const end = javaDecimal(String(row.event.endTime), 64);
    const members = row.members.map((member) => {
      const fields: Fields = {};
      for (const key of ["uid", "allianceId", "rewardId"])
        if (member[key] != null) fields[key] = sfs.string(String(member[key]));
      fields.rank = sfs.int(Number(member.rank));
      for (const key of ["name", "server", "pic", "picVer", "picfraId", "abbr", "icon"])
        if (member[key] != null)
          fields[key] = ["server", "picVer", "picfraId"].includes(key)
            ? sfs.int(Number(member[key]))
            : sfs.string(String(member[key]));
      return sfs.object(fields);
    });
    const realms = row.realms.map((realm) => {
      const fields: Fields = { id: sfs.int(Number(realm.id)), rank: sfs.int(Number(realm.rank)) };
      for (const key of ["name", "banner"])
        if (realm[key] != null) fields[key] = sfs.string(String(realm[key]));
      return sfs.object(fields);
    });
    byTime.set(BigInt.asIntN(64, -end), {
      eventId: sfs.string(String(row.event.eventId)),
      endTime: sfs.long(end),
      userList: sfs.array(members),
      kingdomList: sfs.array(realms),
    });
  }
  return validateFields(heroHistorySchema, {
    history: sfs.array(
      [...byTime]
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([, fields]) => sfs.object(fields)),
    ),
  });
}
