import { sfs, type Fields } from "../protocol/sfs.ts";
import { long, num, text, type Row } from "./rows.ts";
import { Rules } from "./rules.ts";
import { createHash } from "node:crypto";

export const FOREVER = 9223372036854775807n;
export function building(row: Row, rules: Rules, next = false): Fields {
  const itemId = text(row, "itemId");
  const rule = next
    ? rules.nextBuilding(itemId, num(row, "level"), num(row, "star"), num(row, "progress"))
    : rules.building(itemId, num(row, "level"), num(row, "star"), num(row, "progress"));
  const level = Number(rule.level);
  const out: Fields = {
    uuid: sfs.string(text(row, "uuid")),
    itemId: sfs.string(text(row, "itemId")),
    pos: sfs.int(num(row, "pos")),
    level: sfs.int(level),
    opType: sfs.int(num(row, "opType")),
    starNum: sfs.int(Number(rule.s)),
    starRate: sfs.int(Number(rule.p)),
    starMax: sfs.int(rules.maxStar(itemId)),
    putId: sfs.string(text(row, "putId")),
    unlockFlag: sfs.int(next ? 0 : num(row, "unlockFlag")),
    unlock_costNum: sfs.int(num(row, "costUnlockTimes")),
  };
  for (const key of [
    "building",
    "star_building",
    "star_building_new",
    "unlock_type",
    "unlock_value",
  ])
    out[key] = sfs.string(rule[key] ?? "");
  for (const key of ["wood", "stone", "iron", "food", "silver"])
    out[key] = sfs.long(rules.cost(rule, key));
  for (const key of [
    "time",
    "exp",
    "civilization_level",
    "resource",
    "ban_luckyday",
    "destroy_time",
  ])
    out[key] = sfs.int(Number(rule[key] ?? 0));
  for (const key of ["power", "unlock_costType", "unlock_costValue"])
    if (rule[key] !== undefined) out[key] = sfs.int(Number(rule[key]));
  for (const key of ["item", "para1", "para2", "para3", "para4", "para5"])
    if (rule[key] !== undefined) out[key] = sfs.string(rule[key]);
  const nextRule = rules.nextBuilding(itemId, level, Number(rule.s), Number(rule.p));
  const paras = [1, 2, 3, 4, 5].map((i) => nextRule?.[`para${i}`]).filter((v) => v !== undefined);
  if (paras.length) out.nextLevelParas = sfs.string(paras.join(","));
  if (long(row, "refreshTime")) out.refreshTime = sfs.long(long(row, "refreshTime"));
  if (long(row, "effectTime")) {
    if (text(row, "itemId") === "417000") out.cdTime = sfs.long(long(row, "effectTime") / 1000n);
    else out.effectTime = sfs.long(long(row, "effectTime"));
  }
  return out;
}
export function queue(row: Row, item: Fields = {}, helped = true): Fields {
  const timestamp = (key: string) => sfs.long(long(row, key) === FOREVER ? 0n : long(row, key));
  const result: Fields = {
    uuid: sfs.string(text(row, "uuid")),
    qid: sfs.int(num(row, "qid")),
    type: sfs.int(num(row, "type")),
    itemObj: sfs.object(item),
    startTime: timestamp("startTime"),
    endTime: timestamp("endTime"),
    updateTime: timestamp("updateTime"),
    totalTime: sfs.long(long(row, "totalTime") || long(row, "updateTime") - long(row, "startTime")),
  };
  if (helped) result.isHelped = sfs.int(num(row, "isHelped"));
  return result;
}
export function resource(row: Row): Fields {
  const result: Fields = {};
  for (const key of ["wood", "stone", "iron", "food"]) {
    result[key] = sfs.long(long(row, key) < 0n ? 0n : long(row, key));
    result[`${key}_bind`] = sfs.long(long(row, `${key}bind`));
  }
  for (const key of [
    "silver",
    "chip",
    "diamond",
    "sandstone",
    "diamondstone",
    "marble",
    "granite",
    "limestone",
  ])
    result[key] = sfs.int(Math.max(0, num(row, key)));
  result.dragonFood = sfs.int(num(row, "dragon_food"));
  result.dragonGold = sfs.int(num(row, "dragon_gold"));
  return result;
}
export function gold(profile: Row) {
  return long(profile, "gold") + long(profile, "paidGold") + long(profile, "paidSpecialGold");
}
export function user(profile: Row, rules: Rules, kingdomId: number): Fields {
  const result: Fields = {
    buildcode: sfs.string(createHash("md5").update(text(profile, "uid")).digest("hex")),
    serverType: sfs.int(0),
    payTotalDollar: sfs.double(num(profile, "payTotalDollar")),
    uuid: sfs.string(text(profile, "deviceUuid")),
    gold: sfs.long(gold(profile)),
    freeGold: sfs.long(long(profile, "gold")),
    serverId: sfs.int(kingdomId),
    serverMax: sfs.int(kingdomId),
    country: sfs.int(1),
    newCountry: sfs.string(text(profile, "country")),
    maxExp: sfs.int(Number(rules.role(num(profile, "level")).player_exp)),
    material: sfs.long(long(profile, "skillMaterial")),
    allBuildScore: sfs.long(long(profile, "allianceBuildScore")),
  };
  for (const key of ["uid", "name", "allianceId", "openedPos", "pic", "guideStep"])
    result[key] = sfs.string(text(profile, key));
  for (const key of [
    "level",
    "exp",
    "chNameCount",
    "picVer",
    "picfraId",
    "gmFlag",
    "crossFightSrcServerId",
  ])
    result[key] = sfs.int(num(profile, key));
  for (const key of [
    "paidGold",
    "paidSpecialGold",
    "crystal",
    "crystalGold",
    "dmmGold",
    "dmmPaidGold",
    "dmmPaidSpecialGold",
    "payTotal",
    "regTime",
    "neutralScore",
    "csmodBalance",
  ])
    result[key] = sfs.long(long(profile, key));
  return result;
}
