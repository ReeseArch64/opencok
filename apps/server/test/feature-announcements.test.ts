import { expect, test } from "bun:test";
import { featureConfig } from "@opencok/mappings/bootstrap";
import { fields, sfs, type Value } from "@opencok/messages/sfs";
import { featureAnnouncementEnabled, type FeatureContext } from "@opencok/rules/features";
import { Rules, type Rule } from "@opencok/rules/game";

const context: FeatureContext = {
  uid: "synthetic",
  platform: "market_global",
  kingdomId: 2,
  version: "12.6.0",
  now: Date.UTC(2026, 9, 24),
};
const fresh = () => new Rules(new Map(), new Map(), new Map());
const gate = { online: "2", test: "9", version: "12.6.0" };
const project = (rules: Rules, ctx = context) =>
  (featureConfig(rules, ctx).funcOn!.value as Value[]).map(fields);

function account(key: "payelex" | "role_on") {
  const rules = fresh();
  const feature = key === "payelex" ? "cn_bind" : "role_on";
  const item = key === "payelex" ? "cn_bind" : "role_info";
  const channel = key === "payelex" ? "k1" : "k4";
  const uid = key === "payelex" ? "k2" : "k5";
  rules.features.set(feature, { id: feature, ...gate });
  rules.items.set(item, { id: item, [channel]: "all", [uid]: "all" });
  return { rules, feature, item, channel, uid };
}

test("account overrides use global rules even when announcement selectors are closed or blank", () => {
  for (const key of ["payelex", "role_on"] as const) {
    const { rules, feature } = account(key);
    const announcement: Rule = { id: key, pf: "", version: "99.0.0", online: "close" };
    rules.configuration.featureRecords = [announcement];
    const before = structuredClone(rules.configuration.featureRecords);
    expect(project(rules)[0]?.onOff).toEqual(sfs.bool(true));
    expect(rules.configuration.featureRecords).toEqual(before);
    announcement.online = "";
    announcement.version = "";
    expect(project(rules)[0]?.onOff).toEqual(sfs.bool(true));
    rules.features.get(feature)!.online = "close";
    announcement.online = "all";
    announcement.version = "1.0.0";
    expect(project(rules)[0]?.onOff).toEqual(sfs.bool(false));
    rules.features.get(feature)!.online = "2";
    rules.features.get(feature)!.start = "2026-10-25-00-00";
    expect(project(rules)[0]?.onOff).toEqual(sfs.bool(false));
    delete rules.features.get(feature)!.start;
    expect(project(rules, { ...context, version: "12.5.0" })[0]?.onOff).toEqual(sfs.bool(false));
    expect(project(rules, { ...context, testServer: true, kingdomId: 9 })[0]?.onOff).toEqual(
      sfs.bool(true),
    );
  }
});

test("account overrides still evaluate announcement selectors before account gates", () => {
  for (const key of ["payelex", "role_on"] as const) {
    const { rules, feature } = account(key);
    const announcement = { id: key, pf: "all", version: "1.0.0", online: "bad;2" };
    expect(() => featureAnnouncementEnabled(announcement, rules, context)).toThrow();
    rules.features.delete(feature);
    expect(() => featureAnnouncementEnabled(announcement, rules, context)).toThrow();
    announcement.online = "2;bad";
    expect(featureAnnouncementEnabled(announcement, rules, context)).toBe(false);
    announcement.online = "bad";
    announcement.version = "\u2000";
    expect(featureAnnouncementEnabled(announcement, rules, context)).toBe(false);
  }
});

test("account allowlists preserve Java blank checks, exact tokens and all semantics", () => {
  for (const key of ["payelex", "role_on"] as const) {
    const { rules, item, channel, uid } = account(key);
    const announcement = { id: key };
    const binding = rules.items.get(item)!;
    expect(
      featureAnnouncementEnabled(announcement, rules, { ...context, uid: "", platform: "" }),
    ).toBe(true);
    for (const selector of [undefined, "", " ", "\t", "\u2000", "0", ";;"]) {
      if (selector === undefined) {delete binding[channel];}
      else {binding[channel] = selector;}
      expect(featureAnnouncementEnabled(announcement, rules, context)).toBe(false);
    }
    binding[channel] = ";market_global;;AppStore;";
    binding[uid] = ";synthetic;;other;";
    expect(featureAnnouncementEnabled(announcement, rules, context)).toBe(true);
    expect(featureAnnouncementEnabled(announcement, rules, { ...context, uid: "" })).toBe(false);
    expect(
      featureAnnouncementEnabled(announcement, rules, { ...context, platform: "market" }),
    ).toBe(false);
    expect(featureAnnouncementEnabled(announcement, rules, { ...context, uid: "synthetic " })).toBe(
      false,
    );
    binding[channel] = "\u00a0";
    binding[uid] = "all";
    expect(
      featureAnnouncementEnabled(announcement, rules, { ...context, platform: "\u00a0" }),
    ).toBe(true);
    binding[channel] = "all";
    binding[uid] = ";0;";
    expect(featureAnnouncementEnabled(announcement, rules, { ...context, uid: "0" })).toBe(true);
    binding[uid] = "0";
    expect(featureAnnouncementEnabled(announcement, rules, { ...context, uid: "0" })).toBe(false);
    rules.items.delete(item);
    expect(featureAnnouncementEnabled(announcement, rules, context)).toBe(false);
  }
});

test("boss availability skips announcement gates and selects the service-specific global feature key", () => {
  for (const [id, key] of [
    ["worldboss", "worldboss"],
    ["worldboss_elite", "world_boss_elite"],
    ["worldboss_special", "world_boss_special"],
    ["worldboss_npc", "world_boss_npc"],
  ] as const) {
    const rules = fresh();
    const announcement = {
      id,
      pf: "",
      version: "metadata-only",
      online: "invalid",
      start: "future",
    };
    rules.features.set(key, { id: key, ...gate });
    if (id !== key) {rules.features.set(id, { id, ...gate, online: "close" });}
    let calls = 0;
    const running = {
      ...context,
      bossRunning: (requested: string) => {
        expect(requested).toBe(id);
        calls++;
        return true;
      },
    };
    expect(featureAnnouncementEnabled(announcement, rules, running)).toBe(true);
    expect(calls).toBe(1);
    rules.features.get(key)!.end = "2026-10-23-00-00";
    expect(featureAnnouncementEnabled(announcement, rules, running)).toBe(false);
    delete rules.features.get(key)!.end;
    rules.features.get(key)!.online = "invalid";
    expect(featureAnnouncementEnabled(announcement, rules, context)).toBe(false);
    expect(
      featureAnnouncementEnabled(announcement, rules, { ...context, bossRunning: () => false }),
    ).toBe(false);
    expect(() => featureAnnouncementEnabled(announcement, rules, running)).toThrow();
    rules.features.delete(key);
    expect(featureAnnouncementEnabled(announcement, rules, running)).toBe(false);
  }
});

test("only boss announcements read running state and each declaration observes its own result", () => {
  const rules = fresh();
  const row = { id: "worldboss", pf: "all", ...gate };
  rules.features.set("worldboss", row);
  rules.configuration.featureRecords = [{ id: "subscribe", pf: "all", ...gate }, row, row];
  let calls = 0;
  const output = project(rules, { ...context, bossRunning: () => ++calls === 1 });
  expect(output.map((item) => item.onOff)).toEqual([
    sfs.bool(true),
    sfs.bool(true),
    sfs.bool(false),
  ]);
  expect(calls).toBe(2);
  rules.configuration.featureRecords = [
    { ...row, id: "ordinary" },
    { ...row, id: "subscribe" },
  ];
  expect(
    project(rules, {
      ...context,
      bossRunning: () => {
        throw new Error("unused provider");
      },
    }),
  ).toHaveLength(2);
  rules.configuration.featureRecords = [row];
  expect(() =>
    project(rules, {
      ...context,
      bossRunning: () => {
        throw new Error("provider failure");
      },
    }),
  ).toThrow("provider failure");
});

test("boss running checks precede required output metadata but missing IDs stop before service access", () => {
  const rules = fresh();
  rules.features.set("worldboss", { id: "worldboss", ...gate });
  let calls = 0;
  const ctx = {
    ...context,
    bossRunning: () => {
      calls++;
      return true;
    },
  };
  for (const missing of ["pf", "version"]) {
    const row: Rule = { id: "worldboss", pf: "all", ...gate };
    delete row[missing];
    rules.configuration.featureRecords = [row];
    expect(() => project(rules, ctx)).toThrow();
  }
  expect(calls).toBe(2);
  rules.configuration.featureRecords = [{ pf: "all", version: "1.0.0" }];
  expect(() => project(rules, ctx)).toThrow();
  expect(calls).toBe(2);
});

test("subscription announcements use realm metadata and exact platform without version or time comparison", () => {
  const rules = fresh();
  const row = {
    id: "subscribe",
    pf: "metadata",
    version: "99",
    online: "2",
    start: "future",
    end: "past",
  };
  for (const platform of ["AppStore", "market_global", "market_global2"])
    {expect(featureAnnouncementEnabled(row, rules, { ...context, platform })).toBe(true);}
  for (const platform of ["", "appstore", "Google", "market_global "])
    {expect(featureAnnouncementEnabled(row, rules, { ...context, platform })).toBe(false);}
  row.online = "close";
  expect(featureAnnouncementEnabled(row, rules, context)).toBe(false);
  row.online = "bad";
  expect(() => featureAnnouncementEnabled(row, rules, context)).toThrow();
  row.version = "";
  expect(featureAnnouncementEnabled(row, rules, context)).toBe(false);
});
