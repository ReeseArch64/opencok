import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { generalRecruit } from "@opencok/rules/general-progression";
import {
  generalMarch,
  generalMarchReturn,
  generalOfficeExperience,
} from "@opencok/rules/general-assignments";
const rules = await loadRules();
test("march assignment excludes occupied heroes and return restores eligibility", () => {
  const row = generalRecruit(rules, 53500, "owner", 1n),
    marching = generalMarch(rules, row);
  expect(marching.state).toBe(3);
  expect(() => generalMarch(rules, marching)).toThrow();
  for (const state of [2, 4, 5, 6]) expect(() => generalMarch(rules, { ...row, state })).toThrow();
  expect(generalMarchReturn(marching).state).toBe(1);
  expect(() => generalMarchReturn(row)).toThrow();
});
test("office experience checkpoints preserve sub-point time across repeated refreshes", () => {
  const office = { startTime: 1n, lastRefreshExpTime: 1n, position: 1 },
    rule = { pos_exp: "1;1000" };
  expect(generalOfficeExperience(office, rule, 3600n).amount).toBe(0);
  const first = generalOfficeExperience(office, rule, 4000n);
  expect(first).toEqual({ amount: 1, at: 3601n });
  expect(generalOfficeExperience({ ...office, lastRefreshExpTime: first.at }, rule, 7201n)).toEqual(
    { amount: 1, at: 7201n },
  );
});
