import { expect, test } from "bun:test";
import { dataConfig } from "@opencok/dtos/bootstrap";
import { decode, encode, fields, sfs } from "@opencok/messages/sfs";
import { Rules } from "@opencok/rules/game";
import { dataConfigItems } from "./fixtures/data-config.ts";

const catalog = () => new Rules(new Map(), new Map(), new Map(), new Map(), dataConfigItems());
const project = (rules: Rules, context: Parameters<typeof dataConfig>[1] = {}) =>
  fields(decode(encode(dataConfig(rules, { now: 1000, ...context }))).dataConfig);

test("each required normal-world catalog record must exist before configuration can be returned", () => {
  const source = dataConfigItems();
  expect(source.size).toBe(200);
  const rules = catalog();
  const baseline = project(rules);
  expect(baseline.general_buy).toEqual(sfs.object());
  expect(baseline.w_thedoor).toEqual(sfs.object());
  expect(baseline["69008"]).toEqual(sfs.object());
  for (const [id, rule] of source) {
    rules.items.delete(id);
    expect(() => project(rules), id).toThrow();
    rules.items.set(id, rule);
  }
  expect(project(rules)).toEqual(baseline);
  const group = new Map(rules.items);
  rules.configuration.dataConfig = group;
  group.delete("mail");
  expect(() => project(rules)).toThrow();
  expect(rules.items.has("mail")).toBe(true);
});

test("required numeric, scalar string and boss attributes cannot silently disappear", () => {
  const attributes: [string, string][] = [
    ["resources_basics", "k5"],
    ["resources_basics", "k6"],
    ["resources_basics", "k7"],
    ["resources_basics", "k8"],
    ["world_fire1", "k2"],
    ["shield_base", "k2"],
    ...["k3", "k4", "k6", "k8", "k10", "k11"].map((key): [string, string] => ["monster", key]),
    ["beginner_move", "k1"],
    ["worldmap_city", "k4"],
    ["function_on8", "k2"],
    ["on_trumpet", "k2"],
    ["serviceterms_on", "k1"],
    ["chrisms", "k12"],
    ["function_on2", "k8"],
    ["function_on3", "k2"],
    ["wb_info", "k8"],
    ["wa_score", "k10"],
    ["wa_scene", "k1"],
    ["graveyard", "k3"],
    ["kingdom_neutralServer", "k4"],
    ["kingdom_neutralServer_time", "k7"],
    ["overlord", "k1"],
  ];
  for (const id of dataConfigItems().keys())
    if (id.startsWith("worldboss") && !id.endsWith("_other"))
      attributes.push([id, "k1"], [id, "k10"]);
  for (const [id, key] of attributes) {
    const rules = catalog();
    delete rules.items.get(id)![key];
    expect(() => project(rules), `${id}.${key}`).toThrow();
  }
  const rules = catalog();
  rules.items.get("resources_basics")!.k5 = "";
  rules.items.get("worldboss")!.k10 = "";
  expect(project(rules).quickEndBattle).toEqual(sfs.string(""));
  expect(fields(project(rules).worldboss).physicalcost).toEqual(sfs.string(""));
});

test("optional records keep distinct absent, empty and present-field contracts", () => {
  const rules = catalog();
  const optional = ["FB_follow", "lordtips_time", "loading_show_type"];
  for (const id of optional) rules.items.delete(id);
  let result = project(rules);
  for (const key of ["followFB", "lordtips_time", "loading_show_type", "alliance_quest_init_level"])
    expect(result[key]).toBeUndefined();
  for (const id of optional) rules.items.set(id, {});
  result = project(rules);
  for (const key of ["followFB", "lordtips_time", "loading_show_type"])
    expect(result[key]).toBeUndefined();
  rules.items.set("FB_follow", { id: "FB_follow" });
  rules.items.set("lordtips_time", { id: "lordtips_time" });
  result = project(rules);
  expect(result.followFB).toEqual(sfs.object());
  expect(result.lordtips_time).toEqual(sfs.object());
  rules.items.set("loading_show_type", { id: "loading_show_type" });
  expect(() => project(rules)).toThrow();
  rules.items.get("loading_show_type")!.k1 = "";
  expect(project(rules).loading_show_type).toEqual(sfs.string(""));
  rules.items.set("alliance_quest", { k10: "bad" });
  expect(() => project(rules)).toThrow();
});

test("quest, scout and terms fields are required only after their reference gates pass", () => {
  const rules = catalog();
  expect(project(rules).alliance_quest?.value).toBe("0");
  rules.items.get("function_on8")!.k2 = "all";
  expect(() => project(rules)).toThrow();
  rules.items.set("alliance_quest", { k12: "quest" });
  expect(() => project(rules)).toThrow();
  rules.items.set("alliance_quest_chat", { k1: "0" });
  expect(project(rules).alliance_quest_chat?.value).toBe("0");
  rules.items.get("alliance_quest_chat")!.k1 = "1";
  expect(() => project(rules)).toThrow();
  rules.items.get("alliance_quest_chat")!.k2 = "";
  expect(project(rules).alliance_quest_chat).toEqual(sfs.string(""));
  rules.items.set("scoutmark_on", { k1: "close" });
  expect(project(rules).scoutmark_on).toBeUndefined();
  rules.items.get("scoutmark_on")!.k1 = "all";
  expect(() => project(rules)).toThrow();
  rules.items.get("scoutmark_on")!.k2 = "";
  expect(project(rules).scoutmark_on).toEqual(sfs.string(""));
  rules.items.set("serviceterms_on", { k1: "0", k3: "bad" });
  expect(project(rules).serviceTerms_on).toBeUndefined();
  rules.items.get("serviceterms_on")!.k1 = "1";
  expect(() => project(rules)).toThrow();
  rules.items.get("serviceterms_on")!.k3 = "close";
  expect(project(rules).serviceTerms_on).toBeUndefined();
  rules.items.get("serviceterms_on")!.k3 = "all";
  expect(() => project(rules)).toThrow();
  rules.items.get("serviceterms_on")!.k2 = "";
  expect(project(rules).serviceTerms_on).toEqual(sfs.string(""));
});

test("only the selected world mode requires its army, score and scene records", () => {
  const rules = catalog();
  const normal = ["wa_army", "wa_score", "wa_scene"];
  const cup = ["wag_army", "wag_score", "wag_scene"];
  expect(project(rules).dragon_world_row).toEqual(sfs.int(0));
  expect(() => project(rules, { worldCup: true })).toThrow();
  rules.items.set("wag_army", {});
  rules.items.set("wag_score", { k10: "5" });
  rules.items.set("wag_scene", { k1: "10" });
  for (const id of normal) rules.items.delete(id);
  expect(project(rules, { worldCup: true }).dragon_world_row).toEqual(sfs.int(10));
  expect(() => project(rules)).toThrow();
  for (const id of cup) {
    const record = rules.items.get(id)!;
    rules.items.delete(id);
    expect(() => project(rules, { worldCup: true })).toThrow();
    rules.items.set(id, record);
  }
  delete rules.items.get("wag_score")!.k10;
  expect(() => project(rules, { worldCup: true })).toThrow();
});

test("configuration scalars use bounded Java Integer and Long parsing with exact SFS types", () => {
  const rules = catalog();
  for (const [raw, expected] of [
    ["+２１４７４８３６４７", 2147483647],
    ["-٢١٤٧٤٨٣٦٤٨", -2147483648],
    ["-０", 0],
    ["0".repeat(65534) + "1", 1],
  ] as const) {
    rules.items.get("resources_basics")!.k8 = raw;
    expect(project(rules).freeSpdT).toEqual(sfs.int(expected));
  }
  rules.items.get("resources_basics")!.k8 = "0";
  for (const [raw, expected] of [
    ["+９２２３３７２０３６８５４７７５８０７", 9223372036854775807n],
    ["-٩٢٢٣٣٧٢٠٣٦٨٥٤٧٧٥٨٠٨", -9223372036854775808n],
  ] as const) {
    rules.items.get("wa_score")!.k10 = raw;
    expect(project(rules).dbf_maxScoreView).toEqual(sfs.long(expected));
  }
  rules.items.get("wa_score")!.k10 = "0";
  for (const invalid of [
    "2147483648",
    "-2147483649",
    "1\n",
    " 1",
    "1 ",
    "1.0",
    "1E2",
    "𝟙",
    "0".repeat(65536),
  ]) {
    rules.items.get("resources_basics")!.k8 = invalid;
    expect(() => project(rules)).toThrow();
  }
  rules.items.get("resources_basics")!.k8 = "0";
  for (const invalid of ["9223372036854775808", "-9223372036854775809", "1\n", "0".repeat(65536)]) {
    rules.items.get("wa_score")!.k10 = invalid;
    expect(() => project(rules)).toThrow();
  }
});
