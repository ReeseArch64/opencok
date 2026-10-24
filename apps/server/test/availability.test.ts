import { expect, test } from "bun:test";
import {
  switchRealmEnabled,
  ruleAvailable,
  ruleTime,
  versionAtLeast,
} from "@opencok/rules/availability";
import { Rules } from "@opencok/rules/game";
import { building } from "@opencok/dtos/city";

const now = Date.UTC(2026, 9, 23, 12);
const context = { kingdomId: 2, version: "12.06.0", now };

test("item switches retain exact realms, inclusive ranges and early matching before later invalid entries", () => {
  for (const selector of ["all", "2", "1-2", "2-4", "7;2;11-20", ";2;", "2;bad"])
    expect(switchRealmEnabled(selector, 2), selector).toBe(true);
  for (const selector of ["", "0", "close", "20", "3-8", "1;3-8", "4-2"])
    expect(switchRealmEnabled(selector, 2), selector).toBe(false);
  for (const selector of [undefined, "bad;2", "9007199254740992"])
    expect(() => switchRealmEnabled(selector, 2)).toThrow();
  for (const realm of [1.5, NaN, Infinity])
    expect(() => switchRealmEnabled("all", realm)).toThrow();
  expect(switchRealmEnabled("all", 0)).toBe(true);
  expect(switchRealmEnabled("0", 0)).toBe(false);
});

test("direct version gates compare Java integer components and expose malformed versions", () => {
  expect(versionAtLeast("12.06.0", "12.6.0")).toBe(true);
  expect(versionAtLeast("12.10.0", "12.9.99")).toBe(true);
  expect(versionAtLeast("13.0.0", "12.99.99")).toBe(true);
  expect(versionAtLeast("12.6.1", "12.6.0")).toBe(true);
  expect(versionAtLeast("12.6.0", "12.6.1")).toBe(false);
  expect(versionAtLeast("9.99.99", "12.0.0")).toBe(false);
  for (const version of ["", "12.6", "12.6.0-beta", "12.x.0", "9007199254740992.0.0"])
    expect(() => versionAtLeast(version, "12.6.0")).toThrow();
  expect(() => versionAtLeast("12.6.0", "")).toThrow();
  expect(versionAtLeast("12.6.0.1", "12.6.0")).toBe(true);
});

test("legacy rule dates use an explicit offset and reject calendar rollover", () => {
  expect(ruleTime("2026-10-23-12-00")).toBe(now);
  expect(ruleTime("2026-10-23-12-00", -180)).toBe(now + 3 * 3_600_000);
  expect(ruleTime("2026-10-23-12-00", 480)).toBe(now - 8 * 3_600_000);
  expect(ruleTime("2024-02-29-00-00")).toBe(Date.UTC(2024, 1, 29));
  for (const date of [
    "",
    "2026-02-29-00-00",
    "2026-13-01-00-00",
    "2026-10-23-24-00",
    "2026-10-23-12-60",
    "2026-10-00-00-00",
  ])
    expect(ruleTime(date), date).toBeUndefined();
  expect(ruleTime("2026-10-23-12-00", 841)).toBeUndefined();
  expect(ruleTime("2026-10-23-12-00", 0.5)).toBeUndefined();
});

test("availability combines version, realm, test selector, and inclusive time boundaries", () => {
  const rule = {
    online: "1-2",
    test: "9",
    version: "12.6.0",
    start: "2026-10-23-12-00",
    end: "2026-10-24-12-00",
  };
  expect(ruleAvailable(rule, context)).toBe(true);
  expect(ruleAvailable(rule, { ...context, now: now - 1 })).toBe(false);
  expect(ruleAvailable(rule, { ...context, now: now + 86_400_000 })).toBe(true);
  expect(ruleAvailable(rule, { ...context, now: now + 86_400_001 })).toBe(false);
  expect(ruleAvailable(rule, { ...context, version: "12.5.99" })).toBe(false);
  expect(ruleAvailable(rule, { ...context, kingdomId: 3 })).toBe(false);
  expect(ruleAvailable(rule, { ...context, testServer: true })).toBe(false);
  expect(ruleAvailable(rule, { ...context, testServer: true, kingdomId: 9 })).toBe(true);
  expect(ruleAvailable(rule, { ...context, utcOffsetMinutes: -180 })).toBe(false);
  expect(ruleAvailable({ ...rule, start: "2026-10-25-12-00" }, context)).toBe(false);
  expect(ruleAvailable({ ...rule, start: "invalid" }, context)).toBe(false);
  expect(ruleAvailable({ ...rule, end: "" }, context)).toBe(false);
  expect(ruleAvailable({ ...rule, online: "" }, context)).toBe(false);
  expect(ruleAvailable({ ...rule, version: "" }, context)).toBe(false);
  expect(ruleAvailable(undefined, context)).toBe(false);
  expect(ruleAvailable(rule, { ...context, now: NaN })).toBe(false);
  expect(ruleAvailable({ version: "12.6.0", online: "all" }, context)).toBe(true);
});

test("building star availability and next-level previews use the same supplied instant", () => {
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.buildings.set("400030", {
    id: "400030",
    level: "30",
    star_time: "0;10|100;20",
    para1: "base",
  });
  rules.buildings.set("400031", { id: "400031", level: "30", para1: "star" });
  rules.stars.set("first", {
    id: "first",
    build_id: "400000",
    star: "1",
    online: "all",
    version: "12.6.0",
    start: "2026-10-23-12-00",
    end: "2026-10-24-12-00",
  });
  rules.stars.set("other", {
    id: "other",
    build_id: "401000",
    star: "9",
    online: "all",
    version: "12.6.0",
  });
  rules.stars.set("future", {
    id: "future",
    build_id: "400000",
    star: "8",
    online: "all",
    version: "12.7.0",
  });
  rules.stars.set("bad", {
    id: "bad",
    build_id: "400000",
    star: "invalid",
    online: "all",
    version: "12.6.0",
  });
  const row = { uuid: "synthetic-building", itemId: "400000", level: 30, star: 0, progress: 0 };
  expect(building(row, rules, false, now - 1).starMax?.value).toBe(0);
  expect(building(row, rules, false, now).starMax?.value).toBe(1);
  expect(building(row, rules, false, now).nextLevelParas?.value).toBe("star");
  expect(building(row, rules, false, now + 86_400_001).nextLevelParas?.value).toBe("base");
  expect(rules.buildings.get("400030")?.para1).toBe("base");
});
