import {
  buildingDisplayParameters,
  buildingRequirements,
  buildingItemCosts,
  buildingUnlockValues,
} from "./building.ts";
import { validateFields } from "./validation.ts";
import { buildingSchema, queueSchema, resourceSchema, userSchema } from "@opencok/validations/city";

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
  const level = rule.level;
  const out: Fields = {
    uuid: sfs.string(text(row, "uuid")),
    itemId: sfs.string(text(row, "itemId")),
    pos: sfs.int(num(row, "pos")),
    level: sfs.int(level),
    opType: sfs.int(num(row, "opType")),
    starNum: sfs.int(rule.starLevel),
    starRate: sfs.int(rule.starProgress),
    starMax: sfs.int(rules.maxStar(itemId, now)),
    putId: sfs.string(text(row, "putId")),
    unlockFlag: sfs.int(next ? 0 : num(row, "unlockFlag")),
    unlock_costNum: sfs.int(num(row, "costUnlockTimes")),
  };
  const unlock = buildingUnlockValues(rule);
  out.building = sfs.string(buildingRequirements(rule));
  out.star_building = sfs.string(
    rule.requiredStarBuildings?.map((value) => value.levelId).join(",") ?? "",
  );
  out.star_building_new = sfs.string(
    rule.requiredStarBuildings?.map((value) => value.levelId + "," + value.quantity).join(";") ??
      "",
  );
  out.unlock_type = sfs.string(unlock.types);
  out.unlock_value = sfs.string(unlock.values);

  for (const key of ["wood", "stone", "iron", "food", "silver"] as const)
    out[key] = sfs.long(rules.cost(rule, key));

  out.time = sfs.int(rule.constructionSeconds ?? 0);
  out.exp = sfs.int(rule.experience ?? 0);
  out.civilization_level = sfs.int(rule.civilizationLevel ?? 0);
  out.resource = sfs.int(0);
  out.ban_luckyday = sfs.int(0);
  out.destroy_time = sfs.int(rule.demolitionSeconds ?? 0);

  if (rule.power !== undefined) out.power = sfs.int(rule.power);

  if (rule.unlockPayment !== undefined) {
    out.unlock_costType = sfs.int(rule.unlockPayment.paymentId);
    out.unlock_costValue = sfs.int(Number(rule.unlockPayment.amount));
  }

  const item = buildingItemCosts(rule);

  if (item !== undefined) out.item = sfs.string(item);

  const parameters = buildingDisplayParameters(rule);

  for (let index = 0; index < 5; index++) {
    const parameter = parameters[index];

    if (parameter !== undefined) out["para" + (index + 1)] = sfs.string(parameter);
  }

  const nextRule = rules.nextBuilding(itemId, level, rule.starLevel, rule.starProgress, now);
  const paras = buildingDisplayParameters(nextRule)
    .slice(0, 5)
    .filter((value) => value !== undefined);

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

export function building(...args: Parameters<typeof serializeBuilding>): Fields {
  return validateFields(buildingSchema, serializeBuilding(...args));
}

export function queue(...args: Parameters<typeof serializeQueue>): Fields {
  return validateFields(queueSchema, serializeQueue(...args));
}

export function resource(...args: Parameters<typeof serializeResource>): Fields {
  return validateFields(resourceSchema, serializeResource(...args));
}

export function user(...args: Parameters<typeof serializeUser>): Fields {
  return validateFields(userSchema, serializeUser(...args));
}
