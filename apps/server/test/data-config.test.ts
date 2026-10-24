import { expect, test } from "bun:test";
import type { GameStore } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import { Game } from "@opencok/controllers/game";
import { dataConfig } from "@opencok/dtos/bootstrap";
import { Rules, type Rule } from "@opencok/rules/game";
import { decode, encode, fields, sfs, Type } from "@opencok/messages/sfs";

const now = Date.UTC(2026, 9, 23, 12);
function catalog(records: Record<string, Record<string, string>> = {}, kingdomId = 2) {
  const rules = new Rules(
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    kingdomId,
  );
  rules.items.set("player_max", { id: "player_max", k1: "0010" });
  for (const [id, values] of Object.entries(records)) rules.items.set(id, { id, ...values });
  return rules;
}
const project = (rules: Rules, context: Parameters<typeof dataConfig>[1] = {}) =>
  fields(decode(encode(dataConfig(rules, { now, ...context }))).dataConfig);

test("data config exposes supported game catalogs while preserving strings and excluding unrelated items", () => {
  const rules = catalog({
    hero_soul: { k1: "soul" },
    hero: { k1: "general" },
    FB_follow: { k1: "follow" },
    mail: { k1: "0100" },
    alliance_cost: { k1: "alliance" },
    chat_voice: { k1: "voice" },
    equipment_refine: { k1: "refine" },
    civilization: { k1: "civilization" },
    new_resource_battle_base: { k1: "battle" },
    kingdom_neutralServer: { k4: "1200" },
    kingdom_neutralServer_time: { k7: "60" },
    world_fire1: { k1: "1000", k2: "30" },
    world_fire2: { k1: "second" },
    red_envelopes: { k1: "reward" },
    private_unrelated: { password: "synthetic-must-not-be-exposed" },
  });
  const result = project(rules);
  expect(fields(result.hero)).toEqual({ k1: sfs.string("soul") });
  expect(fields(result.hero_yutao)).toEqual({ k1: sfs.string("general") });
  expect(fields(result.followFB)).toEqual({ k1: sfs.string("follow") });
  expect(fields(result.mail)).toEqual({ k1: sfs.string("0100") });
  for (const key of [
    "alliance_cost",
    "chat_voice",
    "equipment_refine",
    "civilization",
    "new_resource_battle_base",
    "red_envelopes",
  ])
    expect(fields(result[key]).id).toBeUndefined();
  expect(result.private_unrelated).toBeUndefined();
  expect(result.hero_soul).toBeUndefined();
  expect(result.FB_follow).toBeUndefined();
  expect(fields(result.world_fire1).k1).toEqual(sfs.string("1000"));
  expect(result.cityDefMax).toEqual(sfs.int(1000));
  expect(result.cityDefInterval).toEqual(sfs.int(30));
  expect(fields(result.world_fire2).k1?.value).toBe("second");
  expect(result.neutral_row).toEqual(sfs.int(1200));
  expect(result.neutral_CD_time).toEqual(sfs.int(60));
});

test("special projections keep only the documented keys and preserve wire aliases", () => {
  const result = project(
    catalog({
      worldmap_pve: { k1: "private", k5: "low", k6: "high", k7: "hidden" },
      facebook_gift: { k1: "hidden", k7: "facebook" },
      ranking: { k1: "hidden", k3: "visible" },
      worldboss: { k1: "10", k2: "hidden", k10: "20" },
      worldboss_elite_10_19: { k1: "11", k10: "21" },
      worldboss_special_30_40: { k1: "30", k10: "22" },
      worldboss_npc: { k1: "1", k10: "0" },
      worldboss_elite_20_29_other: { k1: "other" },
      monster: { k3: "100", k4: "60", k6: "10", k8: "30", k10: "40", k11: "boss;005" },
      loading_show_type: { k1: "002" },
      overlord: { k1: "3" },
    }),
  );
  expect(fields(result.worldmap_pve)).toEqual({ k1: sfs.string("low"), k2: sfs.string("high") });
  expect(fields(result.facebook_gift)).toEqual({ k7: sfs.string("facebook") });
  expect(fields(result.ranking)).toEqual({ k3: sfs.string("visible") });
  expect(fields(result.worldboss)).toEqual({
    physicalcost: sfs.string("20"),
    citylevel: sfs.string("10"),
  });
  expect(fields(result.worldboss_elite_10_19)).toEqual({
    physicalcost: sfs.string("21"),
    citylevel: sfs.string("11"),
  });
  expect(fields(result.worldboss_special_30_40).citylevel?.value).toBe("30");
  expect(fields(result.worldboss_npc).physicalcost?.value).toBe("0");
  expect(fields(result.worldboss_elite_20_29_other)).toEqual({ k1: sfs.string("other") });
  expect(result.monster_count).toEqual(sfs.int(100));
  expect(result.monster_interval).toEqual(sfs.string("60"));
  expect(result.boss_max_member).toEqual(sfs.string("005"));
  expect(result.loading_show_type).toEqual(sfs.string("002"));
  expect(result.overlord_open_type).toEqual(sfs.string("3"));
});

test("realm controls calculate quest, terms, scout and normalized switches without mutating rules", () => {
  const rules = catalog({
    function_on8: { k2: "2-4" },
    alliance_quest: { k10: "6", k12: "quest" },
    alliance_quest_chat: { k1: "1", k2: "chat", k4: "2", k5: "3" },
    on_trumpet: { k2: "1;2" },
    serviceterms_on: { k1: "1", k2: "terms", k3: "2" },
    scoutmark_on: { k1: "2-5", k2: "scout" },
    wa_switch: { k1: "2", k2: "keep" },
    graveyard: { k3: "3", k4: "keep" },
  });
  const before = structuredClone(rules.items);
  const result = project(rules);
  expect(result.alliance_quest?.value).toBe("quest");
  expect(result.alliance_quest_chat?.value).toBe("chat");
  expect(result.alliance_quest_tab).toEqual(sfs.int(1));
  expect(result.alliance_quest_push).toEqual(sfs.int(0));
  expect(result.alliance_quest_init_level).toEqual(sfs.int(6));
  expect(result.on_trumpet_k2).toEqual(sfs.int(1));
  expect(result.serviceTerms_on?.value).toBe("terms");
  expect(result.scoutmark_on?.value).toBe("scout");
  expect(fields(result.wa_switch)).toEqual({ k1: sfs.string("1"), k2: sfs.string("keep") });
  expect(fields(result.graveyard)).toEqual({ k3: sfs.string("0"), k4: sfs.string("keep") });
  expect(rules.items).toEqual(before);
  const otherRealm = catalog(Object.fromEntries(rules.items), 8);
  const closed = project(otherRealm);
  expect(closed.alliance_quest?.value).toBe("0");
  expect(closed.alliance_quest_chat?.value).toBe("0");
  expect(closed.alliance_quest_tab?.value).toBe(0);
  expect(closed.on_trumpet_k2?.value).toBe(0);
  expect(closed.serviceTerms_on).toBeUndefined();
  expect(closed.scoutmark_on).toBeUndefined();
});

test("world cup projections select the matching resources and retain exact signed long scores", () => {
  const rules = catalog({
    wa_army: { k1: "normal" },
    wag_army: { k1: "cup" },
    wa_score: { k10: "9007199254740993" },
    wag_score: { k10: "9223372036854775807" },
    wa_scene: { k1: "1200" },
    wag_scene: { k1: "600" },
  });
  expect(project(rules).dbf_maxScoreView).toEqual(sfs.long(9007199254740993n));
  expect(fields(project(rules).wa_army).k1?.value).toBe("normal");
  const cup = project(rules, { worldCup: true });
  expect(cup.dbf_maxScoreView).toEqual(sfs.long(9223372036854775807n));
  expect(cup.dragon_world_row).toEqual(sfs.int(600));
  expect(fields(cup.wa_army).k1?.value).toBe("cup");
  expect(cup.wag_army).toBeUndefined();
});

test("stamina and mission availability depend on player level, version, realm and time", () => {
  const rules = catalog({ monster: { k3: "100" } });
  rules.roles.set("100105", { id: "100105", stamina: "150" });
  for (const id of ["stamina_limit", "alliance_mission"])
    rules.features.set(id, {
      id,
      online: "2",
      test: "3",
      version: "12.6.0",
      start: "2026-10-23-12-00",
      end: "2026-10-24-12-00",
    });
  expect(project(rules, { profileLevel: 5 }).monster_count).toEqual(sfs.int(150));
  expect(project(rules).monster_count).toEqual(sfs.int(100));
  expect(project(rules).alliance_mission?.value).toBe("on");
  for (const context of [
    { now: now - 1 },
    { now: now + 86_400_001 },
    { version: "12.5.99" },
    { testServer: true },
  ]) {
    expect(project(rules, { ...context, profileLevel: 5 }).monster_count?.value).toBe(100);
    expect(project(rules, context).alliance_mission?.value).toBe("off");
  }
  expect(() => project(rules, { profileLevel: 9 })).toThrow();
});

test("date conversion, client exceptions and server defaults have stable wire types", () => {
  const rules = catalog({
    icon: { k1: "icon", k4: "2026-10-23", k5: "2026-10-24" },
    activityconfig2: { k12: "9" },
  });
  const result = project(rules);
  expect(fields(result.icon).k4).toEqual(sfs.string(String(Date.UTC(2026, 9, 23))));
  expect(fields(result.icon).k5).toEqual(sfs.string(String(Date.UTC(2026, 9, 24))));
  expect(fields(result.serverConfig)).toEqual({
    chat_interval: sfs.int(1),
    feed_maxCount: sfs.int(3),
  });
  expect(fields(project(rules, { chatInterval: 5, feedMaxCount: 7 }).serverConfig)).toEqual({
    chat_interval: sfs.int(5),
    feed_maxCount: sfs.int(7),
  });
  expect(fields(project(rules, { version: "1.1.10" }).activityconfig2).k12?.value).toBe("0");
  expect(fields(result.activityconfig2).k12?.value).toBe("9");
  expect(result.cross_open).toEqual(sfs.bool(false));
  expect(project(rules, { crossOpen: true, version: "1.0.58" }).cross_open?.value).toBe(false);
  expect(project(rules, { crossOpen: true, version: "1.0.59" }).cross_open?.value).toBe(true);
  expect(rules.items.get("icon")?.k4).toBe("2026-10-23");
});

test("auxiliary catalogs supply general sale limits, pay control and ordered kingdom skill tabs", () => {
  const rules = catalog({ kingdomskill: { k3: "legacy", k9: "unchanged" } });
  rules.configuration.generalSales = new Map([["hero1", { id: "hero1", limit: "003" }]]);
  rules.configuration.payControl = new Map([
    ["69008", { id: "69008", k7: "closed" }],
    ["other", { id: "other", k7: "hidden" }],
  ]);
  const skills: Rule[] = [
    { id: "second", showTab: "3", tabIndex: "2", online: "2", test: "close" },
    { id: "hidden", showTab: "3", tabIndex: "-1", online: "all", test: "all" },
    { id: "first", showTab: "3", tabIndex: "1", online: "3", test: "all" },
  ];
  rules.configuration.kingdomSkills = new Map(skills.map((skill) => [skill.id!, skill]));
  rules.features.set("w_thedoor", { id: "w_thedoor", version: "12.6.0", online: "2" });
  const result = project(rules);
  expect(fields(result.general_buy)).toEqual({ hero1: sfs.string("003") });
  expect(fields(result["69008"])).toEqual({ k7: sfs.string("closed") });
  expect(result.other).toBeUndefined();
  expect(fields(result.kingdomskill)).toEqual({
    k3: sfs.string("first_0;second_1"),
    k9: sfs.string("unchanged"),
  });
  expect(fields(project(rules, { testServer: true }).kingdomskill).k3?.value).toBe(
    "first_1;second_0",
  );
  expect(fields(result.w_thedoor).version?.value).toBe("12.6.0");
  expect(skills[0]?.id).toBe("second");
});

test("malformed integers, long overflows and invalid dates fail before emitting corrupted config", () => {
  for (const value of ["1.5", "NaN", "", "2147483648", "-2147483649", "1e3"])
    expect(() => project(catalog({ resources_basics: { k8: value } }))).toThrow();
  for (const value of ["9223372036854775808", "-9223372036854775809", "2.5", "no"])
    expect(() => project(catalog({ wa_score: { k10: value } }))).toThrow();
  expect(() => project(catalog({ icon: { k4: "2026-02-30" } }))).toThrow();
  expect(() => project(catalog({ monster: { k11: "missing-separator" } }))).toThrow();
  expect(project(catalog({ resources_basics: { k8: "2147483647" } })).freeSpdT?.value).toBe(
    2147483647,
  );
  expect(
    project(catalog({ wa_score: { k10: "-9223372036854775808" } })).dbf_maxScoreView?.value,
  ).toBe(-9223372036854775808n);
});

test("login.dataconfig reads the authenticated profile, echoes correlation and rejects banned/missing players", async () => {
  const rules = catalog({ monster: { k3: "100" } });
  rules.features.set("stamina_limit", { id: "stamina_limit", online: "2", version: "12.6.0" });
  rules.roles.set("100105", { id: "100105", stamina: "150" });
  const unused = async (): Promise<never> => {
    throw new Error("Config must not read or mutate city state");
  };
  let calls = 0;
  const store: GameStore = {
    profile: async (uid) => {
      expect(uid).toBe("synthetic");
      calls++;
      return { uid, level: 5 };
    },
    playerRanking: unused,
    publicProfile: unused,
    playerSummaries: unused,
    configuration: unused,
    power: unused,
    accounts: unused,
    city: unused,
    world: unused,
  };
  const result = await new Game(store, rules, { kingdomId: 2 }, () => now).execute(
    "synthetic",
    "login.dataconfig",
    { _cok_: sfs.string("request"), cmdBaseTime: sfs.string("123") },
  );
  expect(fields(result.body.dataConfig).monster_count).toEqual({ type: Type.Int, value: 150 });
  expect(result.body._cok_?.value).toBe("request");
  expect(result.body.cmdBaseTime?.value).toBe("123");
  expect(result.pushes).toEqual([]);
  expect(calls).toBe(1);
  const rejected: (Row | undefined)[] = [undefined, { banFlag: 1 }, { banTime: BigInt(now + 1) }];
  for (const profile of rejected) {
    const game = new Game(
      { ...store, profile: async () => profile },
      rules,
      { kingdomId: 2 },
      () => now,
    );
    await expect(game.execute("synthetic", "login.dataconfig", {})).rejects.toThrow();
  }
});
