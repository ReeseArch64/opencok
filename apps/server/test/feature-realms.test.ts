import { expect, test } from "bun:test";
import { featureRealmEnabled, ruleAvailable } from "@opencok/rules/availability";
import { serverFeature } from "@opencok/rules/power-context";
import { featureAnnouncementEnabled } from "@opencok/rules/features";
import { Rules } from "@opencok/rules/game";
import vectors from "./fixtures/feature-realm-vectors.json";

const context = { kingdomId: 2, now: 1000, version: "12.6.0" };

test("function-on selectors match 1020 independent Java 8 integer and regexp queries", () => {
  expect(vectors).toHaveLength(1020);
  for (const [selector, realm, expected] of vectors as [string, number, boolean | "error"][]) {
    if (expected === "error") expect(() => featureRealmEnabled(selector, realm)).toThrow();
    else
      expect(featureRealmEnabled(selector, realm), JSON.stringify([selector, realm])).toBe(
        expected,
      );
  }
});

test("bounded function-on selectors retain signed Int realms, leading zeros and skipped empty segments", () => {
  expect(featureRealmEnabled("0", 0)).toBe(true);
  expect(featureRealmEnabled("-2", -2)).toBe(true);
  expect(featureRealmEnabled("all", -2147483648)).toBe(true);
  expect(featureRealmEnabled("0".repeat(65534) + "2", 2)).toBe(true);
  expect(featureRealmEnabled(";".repeat(65535), 2)).toBe(false);
  expect(featureRealmEnabled(Array(4096).fill("1").join(";"), 2)).toBe(false);
  for (const selector of [undefined, "1".repeat(65536), Array(4097).fill("1").join(";")])
    expect(() => featureRealmEnabled(selector, 2)).toThrow();
  for (const realm of [NaN, Infinity, 1.5, 2147483648, -2147483649])
    expect(() => featureRealmEnabled("all", realm)).toThrow();
});

test("feature ranges defer the upper bound until the lower comparison succeeds and skip later invalid entries after a match", () => {
  expect(featureRealmEnabled("3-2147483648", 2)).toBe(false);
  expect(featureRealmEnabled("3-2147483648;2", 2)).toBe(true);
  expect(featureRealmEnabled("2;2147483648", 2)).toBe(true);
  expect(featureRealmEnabled("1-2;bad", 2)).toBe(true);
  for (const selector of ["1-2147483648", "bad;2", "2147483648;2", "3-4\n;2", "３-４;2"])
    expect(() => featureRealmEnabled(selector, 2)).toThrow();
});

test("feature availability applies blank and version checks before parsing the selected realm", () => {
  expect(ruleAvailable({ version: "99.0.0", online: "bad" }, context)).toBe(false);
  expect(() => ruleAvailable({ version: "1.0.0", online: "bad" }, context)).toThrow();
  expect(() =>
    ruleAvailable({ version: "1.0.0", online: "bad" }, { ...context, version: "" }),
  ).toThrow();
  expect(ruleAvailable({ version: "bad", online: "\u2000" }, context)).toBe(false);
  expect(ruleAvailable({ version: "1.0.0", online: "+２;bad", test: "3" }, context)).toBe(true);
  expect(
    ruleAvailable(
      { version: "1.0.0", online: "bad", test: "+２;bad" },
      { ...context, testServer: true },
    ),
  ).toBe(true);
  expect(ruleAvailable({ version: "1.0.0", online: "bad" }, { ...context, now: NaN })).toBe(false);
  const closed = {
    version: "1.0.0",
    online: "3",
    get start(): string {
      throw new Error("Unused date");
    },
  };
  expect(ruleAvailable(closed, context)).toBe(false);
  expect(ruleAvailable({ version: "1.0.0", online: "2;bad" }, context)).toBe(true);
});

test("server feature gates and ordinary announcements use Java blank metadata and function-on realm parsing", () => {
  const rules = new Rules(new Map(), new Map(), new Map());
  const rule = { id: "synthetic", version: "99.0.0", online: "+２;bad", test: "3" };
  rules.features.set(rule.id, rule);
  const announcement = () =>
    featureAnnouncementEnabled(rule, rules, { ...context, uid: "owner", platform: "test" });
  expect(serverFeature(rules, rule.id, context)).toBe(true);
  expect(announcement()).toBe(true);
  expect(serverFeature(rules, rule.id, { ...context, testServer: true })).toBe(false);
  for (const version of ["\u00a0", "\ufeff", "not-a-client-version"]) {
    rule.version = version;
    expect(serverFeature(rules, rule.id, context)).toBe(true);
    expect(announcement()).toBe(true);
  }
  for (const version of ["", " ", "\u2000", "\u001c"]) {
    rule.version = version;
    expect(serverFeature(rules, rule.id, context)).toBe(false);
    expect(announcement()).toBe(false);
  }
  rule.version = "99.0.0";
  rule.online = "\u2000";
  expect(serverFeature(rules, rule.id, context)).toBe(false);
  expect(announcement()).toBe(false);
  rule.online = "bad;2";
  expect(() => serverFeature(rules, rule.id, context)).toThrow();
  expect(announcement).toThrow();
});
