import { errors, MOBILE_CLIENT_VERSION } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { sfs, type Fields } from "@opencok/messages/sfs";
import {
  switchRealmEnabled,
  featureRealmEnabled,
  worldActivityRealmEnabled,
  ruleAvailable,
  versionAtLeast,
} from "@opencok/rules/availability";
import { javaDecimal } from "@opencok/rules/java-integer";
import { javaCalendarDate } from "@opencok/rules/java-calendar-date";
import type { Rule, Rules } from "@opencok/rules/game";
import { restoredKingdomSkills, type KingdomSkill } from "@opencok/rules/kingdom-skills";
import { javaIntHashMapOrder } from "@opencok/rules/java-hash-map-order";
import { javaListSort } from "@opencok/rules/java-list-sort";

const objectKeys = [
  "player_max",
  "hero_up",
  "affairs",
  "fight_position",
  "fight_number",
  "physical_bug",
  "physical",
  "mail",
  "building_base",
  "cd_time",
  "cd_cost",
  "cd_gold",
  "vip2sviptime",
  "world_distance",
  "world_marchtime",
  "world_detect",
  "world_fire1",
  "world_fire2",
  "world_rally",
  "world_alliancewar",
  "worldmap_map",
  "resource_cost",
  "resource_num1",
  "resource_num2",
  "resource_num3",
  "showstarskill",
  "tavern_base",
  "alliance_territory",
  "hero_soulstone",
  "function_on",
  "function_on2",
  "function_on3",
  "function_on4",
  "function_on5",
  "function_on6",
  "function_on7",
  "function_on8",
  "function_on9",
  "shake",
  "notice",
  "equip",
  "worldmap_pvenum",
  "hero_number",
  "hero_ability",
  "ability_lv",
  "ability_cost",
  "hero_skillpoint",
  "worldmap_time",
  "march",
  "alliance_cost",
  "alliance_science",
  "alliance_gift",
  "goldmine_fb",
  "resources_weight",
  "online_reward",
  "account",
  "simplemode",
  "recharge_event",
  "bingying_star_on",
  "building_sync",
  "princess_quest",
  "dragonglass",
  "flowers",
  "general_official",
  "civilization_fortress",
  "leader_monster",
  "wk_info_new",
  "trade_type",
  "45skill",
  "scoutmark_time",
  "invite_cost",
  "lottery_cost",
  "lottery_cost2",
  "alliance_territory1",
  "wb_info",
  "wb_condition",
  "wb_score",
  "wb_timing",
  "wb_fire",
  "wb_switch",
  "wa_matchreport",
  "wa_info",
  "wa_time",
  "wap_battle",
  "chat_switch",
  "chat",
  "chat_standalone",
  "chat_bubble",
  "chat_voice",
  "nearby_like",
  "pop_rate",
  "activityconfig",
  "dragonglass_control",
  "wl_res_tile",
  "talktips_time",
  "trade_time",
  "on_kpi",
  "on_war",
  "on_event",
  "on_function",
  "on_trumpet",
  "on_other",
  "smithy_history",
  "world_despoil",
  "wk_info",
  "wonder",
  "science-test",
  "knight_title",
  "activity_name",
  "train",
  "mudi_md5",
  "alliance_war",
  "superarmy",
  "dragon_words",
  "alliance_building_donate",
  "alliance_connon",
  "wk_info_new1",
  "dragon",
  "dragon_new",
  "dragon_notice",
  "dragon_tower",
  "dragon_tower_config",
  "speedup_overflow",
  "alliance_trap",
  "equipment_refine",
  "equipment_combine",
  "subcity_reward",
  "hero_challenge",
  "saga_tower",
  "foreigen_sciences",
  "kingdom_fight_miracle",
  "cn_bind",
  "magic_mirror",
  "phone_bind",
  "mail_bind",
  "bind_reward_disable",
  "kingdom_neutralServer",
  "merge_server",
  "bank_info",
  "power_info",
  "golden_opentime",
  "wk_kingdom_aegis",
  "17_wk",
  "general_random_effect",
  "fight_arena",
  "new_resource_battle_base",
  "p6_arms",
  "week_info",
  "p6_health",
  "dailytasks_info",
  "wb_subsection",
  "golden_egg",
  "civilization",
  "alliance_boss",
  "red_envelopes",
  "overlord_random",
] as const;

export interface DataConfigContext {
  now?: number;
  version?: string;
  profileLevel?: number;
  testServer?: boolean;
  worldCup?: boolean;
  crossOpen?: boolean;
  chatInterval?: number;
  feedMaxCount?: number;
}

function requiredRecord(rule: Rule | undefined): Rule {
  if (!rule) throw new GameError(errors.unsupported, "config_record");
  return rule;
}

function requiredString(rule: Rule | undefined, key: string): string {
  const value = requiredRecord(rule)[key];
  if (typeof value !== "string") throw new GameError(errors.unsupported, "config_string");
  return value;
}

function integer(value: string): number {
  try {
    return Number(javaDecimal(value, 32));
  } catch {
    throw new GameError(errors.unsupported, "config_integer");
  }
}

function signedLong(value: string): bigint {
  try {
    return javaDecimal(value, 64);
  } catch {
    throw new GameError(errors.unsupported, "config_long");
  }
}

function strings(rule: Rule | undefined, projection?: Record<string, string>): Fields {
  const result: Fields = {};
  if (rule)
    for (const [target, source] of Object.entries(
      projection ??
        Object.fromEntries(
          Object.keys(rule)
            .filter((key) => key !== "id")
            .map((key) => [key, key]),
        ),
    )) {
      if (rule[source] !== undefined) result[target] = sfs.string(rule[source]);
    }
  return result;
}

export function dataConfig(rules: Rules, context: DataConfigContext = {}): Fields {
  const items = rules.configuration.dataConfig ?? rules.items;
  if (!items.size) throw new GameError(errors.unsupported);
  const result: Fields = {};
  const version = context.version ?? MOBILE_CLIENT_VERSION;
  const now = context.now ?? Date.now();
  const available = (key: string) =>
    ruleAvailable(rules.features.get(key), {
      kingdomId: rules.kingdomId,
      version,
      now,
      testServer: context.testServer,
    });
  const enabled = (selector: string | undefined) => switchRealmEnabled(selector, rules.kingdomId);
  const object = (target: string, rule: Rule | undefined, projection?: Record<string, string>) => {
    result[target] = sfs.object(strings(requiredRecord(rule), projection));
  };
  for (const key of objectKeys) object(key, items.get(key));
  for (const [target, source] of [
    ["hero", "hero_soul"],
    ["hero_yutao", "hero"],
  ])
    object(target!, items.get(source!));
  for (const [target, source] of [
    ["followFB", "FB_follow"],
    ["lordtips_time", "lordtips_time"],
  ] as const) {
    const rule = items.get(source);
    if (rule && Object.keys(rule).length) object(target, rule);
  }
  object("w_thedoor", rules.features.get("w_thedoor") ?? {});
  object("69008", rules.configuration.payControl?.get("69008") ?? {});
  const pve = requiredRecord(items.get("worldmap_pve"));
  result.worldmap_pve = sfs.object(
    Object.fromEntries(
      [pve.k5, pve.k6]
        .filter((value) => value !== undefined)
        .map((value, index) => [`k${index + 1}`, sfs.string(value)]),
    ),
  );
  object("facebook_gift", items.get("facebook_gift"), { k7: "k7" });
  const ranking = requiredRecord(items.get("ranking"));
  if (ranking.k3 !== undefined) object("ranking", ranking, { k3: "k3" });

  for (const [target, id, key] of [
    ["freeSpdT", "resources_basics", "k8"],
    ["resources_basics", "resources_basics", "k7"],
    ["cityDefInterval", "world_fire1", "k2"],
    ["monster_count", "monster", "k3"],
    ["monster_decr", "monster", "k6"],
    ["beginner_move", "beginner_move", "k1"],
    ["resKey", "worldmap_city", "k4"],
    ["shield_base_2", "shield_base", "k2"],
    ["activityOn", "chrisms", "k12"],
    ["territory_switch", "function_on2", "k8"],
    ["territory_resource_switch", "function_on3", "k2"],
    ["ckf_world_row", "wb_info", "k8"],
    ["neutral_row", "kingdom_neutralServer", "k4"],
    ["neutral_CD_time", "kingdom_neutralServer_time", "k7"],
  ] as const) {
    result[target] = sfs.int(integer(requiredString(items.get(id), key)));
  }
  for (const [target, id, key] of [
    ["quickEndBattle", "resources_basics", "k5"],
    ["chatShieldMax", "resources_basics", "k6"],
    ["monster_interval", "monster", "k4"],
    ["monster_power_limit", "monster", "k8"],
    ["boss_decr", "monster", "k10"],
  ] as const) {
    result[target] = sfs.string(requiredString(items.get(id), key));
  }
  result.overlord_open_type = sfs.string(requiredString(rules.items.get("overlord"), "k1"));
  const loading = items.get("loading_show_type");
  if (loading && Object.keys(loading).length)
    result.loading_show_type = sfs.string(requiredString(loading, "k1"));
  const questLevel = items.get("alliance_quest")?.k10;
  if (questLevel !== undefined) result.alliance_quest_init_level = sfs.int(integer(questLevel));
  if (context.profileLevel !== undefined && available("stamina_limit")) {
    const stamina = rules.role(context.profileLevel).stamina;
    if (stamina === undefined) throw new GameError(errors.unsupported, "stamina_rule");
    result.monster_count = sfs.int(integer(stamina));
  }
  const bossMembers = requiredString(items.get("monster"), "k11").split(";").filter(Boolean)[1];
  if (bossMembers === undefined) throw new GameError(errors.unsupported, "boss_members_rule");
  result.boss_max_member = sfs.string(bossMembers);
  result.cross_open = sfs.bool(!!context.crossOpen && versionAtLeast(version, "1.0.59"));
  const scout = items.get("scoutmark_on");
  if (scout && enabled(scout.k1)) result.scoutmark_on = sfs.string(requiredString(scout, "k2"));
  const terms = requiredRecord(items.get("serviceterms_on"));
  if (requiredString(terms, "k1") === "1" && enabled(terms.k3))
    result.serviceTerms_on = sfs.string(requiredString(terms, "k2"));

  const questSwitch = requiredRecord(items.get("function_on8"));
  const quests = enabled(questSwitch.k2);
  const questChat = items.get("alliance_quest_chat");
  result.alliance_quest = sfs.string(
    quests ? requiredString(items.get("alliance_quest"), "k12") : "0",
  );
  result.alliance_quest_chat = sfs.string(
    quests && requiredString(questChat, "k1") === "1" ? requiredString(questChat, "k2") : "0",
  );
  result.alliance_quest_tab = sfs.int(
    quests && questChat?.k4 !== undefined && enabled(questChat.k4) ? 1 : 0,
  );
  result.alliance_quest_push = sfs.int(
    quests && questChat?.k5 !== undefined && enabled(questChat.k5) ? 1 : 0,
  );
  const trumpet = requiredRecord(items.get("on_trumpet"));
  result.on_trumpet_k2 = sfs.int(enabled(trumpet.k2) ? 1 : 0);
  result.alliance_mission = sfs.string(available("alliance_mission") ? "on" : "off");

  const prefix = context.worldCup ? "wag" : "wa";
  object("wa_army", items.get(`${prefix}_army`));
  result.dbf_maxScoreView = sfs.long(
    signedLong(requiredString(items.get(`${prefix}_score`), "k10")),
  );
  result.dragon_world_row = sfs.int(integer(requiredString(items.get(`${prefix}_scene`), "k1")));
  for (const [key, switchKey] of [
    ["wa_switch", "k1"],
    ["graveyard", "k3"],
  ] as const) {
    const rule = requiredRecord(items.get(key));
    const value = strings(rule);
    if (key === "graveyard" || rule[switchKey] !== undefined) {
      const open =
        key === "wa_switch"
          ? worldActivityRealmEnabled(rule[switchKey], rules.kingdomId)
          : enabled(rule[switchKey]);
      value[switchKey] = sfs.string(open ? "1" : "0");
    }
    result[key] = sfs.object(value);
  }
  const activityFields = strings(requiredRecord(items.get("activityconfig2")));
  if (version === "1.1.10") activityFields.k12 = sfs.string("0");
  result.activityconfig2 = sfs.object(activityFields);
  const icon = requiredRecord(items.get("icon"));
  const iconFields = strings(icon);
  for (const key of ["k4", "k5"]) {
    if (icon[key] === undefined) continue;
    const date = javaCalendarDate(icon[key], 3) ?? 0n;
    iconFields[key] = sfs.string(String(date));
  }
  result.icon = sfs.object(iconFields);
  const boss = (key: string) => {
    const rule = requiredRecord(items.get(key));
    result[key] = sfs.object({
      physicalcost: sfs.string(requiredString(rule, "k10")),
      citylevel: sfs.string(requiredString(rule, "k1")),
    });
  };
  for (const family of ["worldboss", "worldboss_elite", "worldboss_special"]) {
    boss(family);
    for (const range of ["10_19", "20_29", "30_40"]) {
      const key = `${family}_${range}`;
      boss(key);
      object(`${key}_other`, items.get(`${key}_other`));
    }
  }
  boss("worldboss_npc");
  const generalSales = rules.configuration.generalSaleRecords ?? [
    ...(rules.configuration.generalSales?.values() ?? []),
  ];
  result.general_buy = sfs.object(
    Object.fromEntries(
      generalSales.map((rule) => {
        if (typeof rule.id !== "string" || rule.id.length > 255 || typeof rule.limit !== "string")
          throw new GameError(errors.unsupported, "general_sale_rule");
        return [rule.id, sfs.string(rule.limit)];
      }),
    ),
  );
  const skillFields = strings(requiredRecord(items.get("kingdomskill")));
  const tabs = new Map<number, KingdomSkill[]>();
  const records = rules.configuration.kingdomSkillRecords ?? [
    ...(rules.configuration.kingdomSkills?.values() ?? []),
  ];
  for (const skill of restoredKingdomSkills(records)) {
    const tab = skill.showTab;
    const list = tabs.get(tab) ?? [];
    list.push(skill);
    tabs.set(tab, list);
  }
  for (const tab of javaIntHashMapOrder(tabs.keys())) {
    const skills = tabs.get(tab)!;
    skillFields[`k${tab}`] = sfs.string(
      javaListSort(skills, (a, b) => (a.id === b.id ? 0 : (a.tabIndex - b.tabIndex) | 0))
        .map((skill, index) => {
          if (skill.tabIndex === -1) return "";
          const selector = context.testServer ? skill.test : skill.online;
          const enabled = selector !== undefined && featureRealmEnabled(selector, rules.kingdomId);
          return `${skill.id}_${enabled ? "1" : "0"}${index === skills.length - 1 ? "" : ";"}`;
        })
        .join(""),
    );
  }
  result.kingdomskill = sfs.object(skillFields);
  result.serverConfig = sfs.object({
    chat_interval: sfs.int(integer(String(context.chatInterval ?? 1))),
    feed_maxCount: sfs.int(integer(String(context.feedMaxCount ?? 3))),
  });
  return { dataConfig: sfs.object(result) };
}
