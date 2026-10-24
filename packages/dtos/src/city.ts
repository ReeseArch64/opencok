import { z } from "zod";
import { createZodDto, wire, wireFields } from "./dto.ts";

import { sfs, type Fields } from "@opencok/messages/sfs";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import { Rules } from "@opencok/rules/game";
import { createHash } from "node:crypto";

export const FOREVER = 9223372036854775807n;
function serializeBuilding(row: Row, rules: Rules, next = false, now = Date.now()): Fields {
  const itemId = text(row, "itemId");
  const rule = next
    ? rules.nextBuilding(itemId, num(row, "level"), num(row, "star"), num(row, "progress"), now)
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
    starMax: sfs.int(rules.maxStar(itemId, now)),
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
  const nextRule = rules.nextBuilding(itemId, level, Number(rule.s), Number(rule.p), now);
  const paras = [1, 2, 3, 4, 5].map((i) => nextRule?.[`para${i}`]).filter((v) => v !== undefined);
  if (paras.length) out.nextLevelParas = sfs.string(paras.join(","));
  if (long(row, "refreshTime")) out.refreshTime = sfs.long(long(row, "refreshTime"));
  if (long(row, "effectTime")) {
    if (text(row, "itemId") === "417000") out.cdTime = sfs.long(long(row, "effectTime") / 1000n);
    else out.effectTime = sfs.long(long(row, "effectTime"));
  }
  return out;
}
function serializeQueue(row: Row, item: Fields = {}, helped = true): Fields {
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
function serializeResource(row: Row): Fields {
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
function serializeUser(
  profile: Row,
  rules: Rules,
  kingdomId: number,
  civilizationPrestige = 0n,
): Fields {
  const result: Fields = {
    buildcode: sfs.string(createHash("md5").update(text(profile, "uid")).digest("hex")),
    serverType: sfs.int(0),
    civilization_type: sfs.int(num(profile, "civilizationType")),
    civilization_score: sfs.long(long(profile, "civilizationSorce")),
    civilization_prestige: sfs.long(civilizationPrestige),
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

export class BuildingDto extends createZodDto(
  z.strictObject({
    uuid: wire.string,
    itemId: wire.string,
    putId: wire.string,
    building: wire.string,
    star_building: wire.string,
    star_building_new: wire.string,
    unlock_type: wire.string,
    unlock_value: wire.string,
    item: wire.string.optional(),
    para1: wire.string.optional(),
    para2: wire.string.optional(),
    para3: wire.string.optional(),
    para4: wire.string.optional(),
    para5: wire.string.optional(),
    nextLevelParas: wire.string.optional(),
    pos: wire.int,
    level: wire.int,
    opType: wire.int,
    starNum: wire.int,
    starRate: wire.int,
    starMax: wire.int,
    unlockFlag: wire.int,
    unlock_costNum: wire.int,
    time: wire.int,
    exp: wire.int,
    civilization_level: wire.int,
    resource: wire.int,
    ban_luckyday: wire.int,
    destroy_time: wire.int,
    power: wire.int.optional(),
    unlock_costType: wire.int.optional(),
    unlock_costValue: wire.int.optional(),
    wood: wire.long,
    stone: wire.long,
    iron: wire.long,
    food: wire.long,
    silver: wire.long,
    refreshTime: wire.long.optional(),
    cdTime: wire.long.optional(),
    effectTime: wire.long.optional(),
  }),
) {}

export class QueueDto extends createZodDto(
  z
    .strictObject({
      uuid: wire.string,
      qid: wire.int,
      type: wire.int,
      isHelped: wire.int.optional(),
      startTime: wire.long,
      endTime: wire.long,
      updateTime: wire.long,
      totalTime: wire.long,
    })
    .extend({ itemObj: wire.object(wireFields) }),
) {}

export class ResourceDto extends createZodDto(
  z.strictObject({
    wood: wire.long,
    wood_bind: wire.long,
    stone: wire.long,
    stone_bind: wire.long,
    iron: wire.long,
    iron_bind: wire.long,
    food: wire.long,
    food_bind: wire.long,
    silver: wire.int,
    chip: wire.int,
    diamond: wire.int,
    sandstone: wire.int,
    diamondstone: wire.int,
    marble: wire.int,
    granite: wire.int,
    limestone: wire.int,
    dragonFood: wire.int,
    dragonGold: wire.int,
  }),
) {}

export class UserDto extends createZodDto(
  z.strictObject({
    buildcode: wire.string,
    uuid: wire.string,
    newCountry: wire.string,
    uid: wire.string,
    name: wire.string,
    allianceId: wire.string,
    openedPos: wire.string,
    pic: wire.string,
    guideStep: wire.string,
    serverType: wire.int,
    civilization_type: wire.int,
    serverId: wire.int,
    serverMax: wire.int,
    country: wire.int,
    maxExp: wire.int,
    level: wire.int,
    exp: wire.int,
    chNameCount: wire.int,
    picVer: wire.int,
    picfraId: wire.int,
    gmFlag: wire.int,
    crossFightSrcServerId: wire.int,
    civilization_score: wire.long,
    civilization_prestige: wire.long,
    gold: wire.long,
    freeGold: wire.long,
    material: wire.long,
    allBuildScore: wire.long,
    paidGold: wire.long,
    paidSpecialGold: wire.long,
    crystal: wire.long,
    crystalGold: wire.long,
    dmmGold: wire.long,
    dmmPaidGold: wire.long,
    dmmPaidSpecialGold: wire.long,
    payTotal: wire.long,
    regTime: wire.long,
    neutralScore: wire.long,
    csmodBalance: wire.long,
    payTotalDollar: wire.double,
  }),
) {}

export function building(...args: Parameters<typeof serializeBuilding>): Fields {
  return new BuildingDto(serializeBuilding(...args));
}

export function queue(...args: Parameters<typeof serializeQueue>): Fields {
  return new QueueDto(serializeQueue(...args));
}

export function resource(...args: Parameters<typeof serializeResource>): Fields {
  return new ResourceDto(serializeResource(...args));
}

export function user(...args: Parameters<typeof serializeUser>): Fields {
  return new UserDto(serializeUser(...args));
}
