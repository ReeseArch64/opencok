import { sfs, Type, type Fields } from "../protocol/sfs.ts";
import { GameError, errors, type Rules } from "./rules.ts";
import { long, num, text, type Row } from "./rows.ts";

// Core city/world configuration only. XML data remains external to the implementation.
export function dataConfig(rules: Rules): Fields {
  if (!rules.items.size) throw new GameError(errors.unsupported);
  const result: Fields = {};
  for (const name of [
    "player_max",
    "building_base",
    "building_sync",
    "bingying_star_on",
    "cd_time",
    "cd_cost",
    "cd_gold",
    "world_distance",
    "world_marchtime",
    "world_detect",
    "world_fire",
    "resource_cost",
    "resource_num1",
    "resource_num2",
    "resource_num3",
    "resources_weight",
    "march",
    "worldmap_time",
    "physical",
    "physical_bug",
    "fight_position",
    "fight_number",
    "hero_up",
    "hero_number",
    "hero_ability",
    "ability_lv",
    "ability_cost",
    "hero_skillpoint",
    "hero_soulstone",
    "account",
    "simplemode",
    "bank_info",
    "power_info",
  ]) {
    const rule = rules.items.get(name);
    if (rule)
      result[name] = sfs.object(
        Object.fromEntries(
          Object.entries(rule)
            .filter(([key]) => key !== "id")
            .map(([key, value]) => [key, sfs.string(value)]),
        ),
      );
  }
  for (const [target, id, key] of [
    ["freeSpdT", "resources_basics", "k8"],
    ["resources_basics", "resources_basics", "k7"],
    ["cityDefMax", "world_fire1", "k1"],
    ["cityDefInterval", "world_fire1", "k2"],
    ["monster_count", "monster", "k3"],
    ["monster_decr", "monster", "k6"],
    ["beginner_move", "beginner_move", "k1"],
    ["resKey", "worldmap_city", "k4"],
    ["shield_base_2", "shield_base", "k2"],
  ] as const) {
    const value = rules.items.get(id)?.[key];
    if (value !== undefined) result[target] = sfs.int(Number(value));
  }
  for (const [target, id, key] of [
    ["quickEndBattle", "resources_basics", "k5"],
    ["chatShieldMax", "resources_basics", "k6"],
    ["monster_interval", "monster", "k4"],
    ["monster_power_limit", "monster", "k8"],
    ["boss_decr", "monster", "k10"],
  ] as const) {
    const value = rules.items.get(id)?.[key];
    if (value !== undefined) result[target] = sfs.string(value);
  }
  result.cross_open = sfs.bool(false);
  return { dataConfig: sfs.object(result) };
}

export function serverClock(now: number, offsetHours: number): Fields {
  const offset = offsetHours * 3600;
  const seconds = Math.floor(now / 1000);
  return {
    // The legacy names are inverted. Preserve their wire values for the APK.
    db_utc_timestamp: sfs.int(offsetHours),
    db_timezone_offset: sfs.int(seconds),
    tomorrow: sfs.int((Math.floor((seconds + offset) / 86400) + 1) * 86400 - offset),
  };
}

export function featureConfig(rules: Rules): Fields {
  // Advertise the experiment's unavailable optional modules as closed.
  return {
    funcOn: sfs.array(
      [...rules.features.values()].map((rule) =>
        sfs.object({
          funcKey: sfs.string(rule.id!),
          pf: sfs.string(rule.pf ?? "all"),
          version: sfs.string(rule.version ?? ""),
          onOff: sfs.bool(false),
        }),
      ),
    ),
  };
}

export function armySnapshot(row: Row, rules: Rules): Fields {
  const id = text(row, "armyId");
  const rule = rules.arms.get(id);
  if (!rule) throw new GameError(errors.unsupported);
  const out: Fields = { id: sfs.string(id) };
  for (const key of ["free", "march", "level"]) out[key] = sfs.int(num(row, key));
  if (num(row, "train")) {
    out.train = sfs.int(num(row, "train"));
    out.finish = sfs.long(long(row, "finishTime"));
  }
  for (const key of [
    "health",
    "range",
    "move",
    "speed",
    "wood",
    "stone",
    "iron",
    "food",
    "time",
    "heal_res",
    "heal_time",
    "load",
    "new_arms",
    "weak_res",
    "weak_time",
    "fine_iron",
    "mix_numtype",
    "unlock_civi_science",
  ])
    if (rule[key] !== undefined) out[key] = sfs.int(Math.trunc(Number(rule[key])));
  out.attack = sfs.int(
    Math.trunc(Math.fround(Number(rule.attack)) + num(row, "level") * Number(rule.attack_add)),
  );
  out.defen = sfs.int(
    Math.trunc(Math.fround(Number(rule.defence))) + num(row, "level") * Number(rule.defence_add),
  );
  out.upkeep = { type: Type.Float, value: Math.fround(Math.fround(Number(rule.upkeep)) / 24) };
  out.power = { type: Type.Float, value: Number(rule.power) };
  out.new_arms ??= sfs.int(0);
  if (rule.science) out.science = sfs.string(rule.science);
  return out;
}

export function inventoryItem(row: Row, rules: Rules): Fields {
  const rule = rules.goods.get(text(row, "itemId").trim());
  if (!rule) throw new GameError(errors.unsupported);
  const out: Fields = {
    uuid: sfs.string(text(row, "uuid")),
    itemId: sfs.string(text(row, "itemId")),
    count: sfs.int(num(row, "count")),
    vanishTime: sfs.long(long(row, "vanishTime")),
  };
  for (let i = 1; i < 10; i++)
    if (rule[`para${i}`]) out[`para${i}`] = sfs.string(rule[`para${i}`]!);
  return out;
}
