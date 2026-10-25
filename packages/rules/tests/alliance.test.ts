import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
  allianceCreationCost,
  allianceJoinAllowed,
  allianceMember,
  allianceRight,
  changeAlliancePermissions,
} from "../src/alliance";
import { allianceScienceRule, allianceScienceStage } from "../src/alliance-science";
const rules = await loadRules();
test("alliance creation respects castle thresholds and rank capabilities", () => {
  expect(() => allianceCreationCost(rules, 3)).toThrow();
  expect(allianceCreationCost(rules, 4)).toBe(200n);
  expect(allianceCreationCost(rules, 6)).toBe(0n);
  expect(() => allianceRight({ rank: 3 }, rules, "invite")).toThrow();
  expect(() => allianceRight({ rank: 4 }, rules, "invite")).not.toThrow();
  expect(() => allianceRight({ rank: 5 }, rules, "quit")).toThrow();
  expect(() =>
    allianceMember([{ uid: "owner", allianceId: "a", rank: 4 }], "owner", "b"),
  ).toThrow();
});
test("editable permissions cannot grant gameplay capabilities or accept duplicate entries", () => {
  expect(changeAlliancePermissions({ rank: 5 }, "", "0_1:0;2_2:1")["0_1"]).toBe(0);
  for (const input of ["invite:1", "0_1:2", "0_1:1;0_1:0", "__proto__:1"])
    expect(() => changeAlliancePermissions({ rank: 5 }, "", input)).toThrow();
  expect(() => changeAlliancePermissions({ rank: 4 }, "", "0_1:0")).toThrow();
});
test("membership capacity and restrictions use authoritative population and power", () => {
  const alliance = { uid: "a", maxMember: 1, powerRestriction: 50n, castleRestriction: 4 };
  expect(() =>
    allianceJoinAllowed({ uid: "owner", allianceId: "" }, alliance, [], 49n, 4),
  ).toThrow();
  expect(() =>
    allianceJoinAllowed(
      { uid: "owner", allianceId: "" },
      alliance,
      [{ uid: "other", allianceId: "a" }],
      50n,
      4,
    ),
  ).toThrow();
  expect(() =>
    allianceJoinAllowed({ uid: "owner", allianceId: "" }, alliance, [], 50n, 4),
  ).not.toThrow();
  expect(() =>
    allianceJoinAllowed({ uid: "owner", allianceId: "b" }, alliance, [], 50n, 4),
  ).toThrow();
});
test("science progress crosses donation stages and rejects level ids as base ids", () => {
  const rule = allianceScienceRule(rules, 250000);
  expect(allianceScienceStage(rule, 8000)).toEqual({
    stage: 1,
    current: 0,
    required: 8000,
    total: 40000,
  });
  expect(allianceScienceStage(rule, 40000)).toEqual({
    stage: 2,
    current: 24000,
    required: 24000,
    total: 40000,
  });
  expect(() => allianceScienceRule(rules, 250001)).toThrow();
  expect(() => allianceScienceRule(rules, 250000, 5)).toThrow();
});
