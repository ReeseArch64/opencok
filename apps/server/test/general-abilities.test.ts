import type { Rule } from "@opencok/rules/game";
import { text } from "@opencok/contracts/rows";
import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { generalRecruit } from "@opencok/hero/rules/general-progression";
import { activateGeneralTalent } from "@opencok/hero/rules/general-talents";
import {
  generalProperties,
  activateGeneralRefinement,
  refineGeneralValues,
} from "@opencok/hero/rules/general-refinement";
import { generalRefinement } from "@opencok/hero/mappings/generals";
const rules = await loadRules();
test("talent ownership, prerequisite alternatives, maxima, and point budgets", () => {
  const base = rules.power.newGeneralBases!.get("53500")!;
  rules.power.newGeneralBases!.set("53500", { ...base, talent: "987" });
  for (const rule of [
    { id: "90001", skill_group: "987", max_lv: "5", learn_lv: "1" },
    { id: "90002", skill_group: "987", max_lv: "1", condition_skill: "90001;2" },
    { id: "90003", skill_group: "988", max_lv: "1" },
  ] as Rule[])
    {rules.power.newGeneralSkills!.set(rule.id!, rule);}
  const row = generalRecruit(rules, 53500, "owner", 1n);
  expect(() => activateGeneralTalent(rules, row, 90002, 0)).toThrow();
  expect(() => activateGeneralTalent(rules, row, 90003, 0)).toThrow();
  const learned = activateGeneralTalent(
    rules,
    activateGeneralTalent(rules, row, 90001, 0),
    90001,
    0,
  );
  expect(learned.talentpoint).toBe(1);
  expect(activateGeneralTalent(rules, learned, 90002, 0).talentpoint).toBe(0);
  expect(
    activateGeneralTalent(rules, { ...learned, talent: "90001;4" }, 90002, 0).talentpoint,
  ).toBe(0);
  expect(activateGeneralTalent(rules, row, 90001, 1).talentpoint).toBe(0);
});
test("refinement proposals preserve applied effects until confirmation and serialize native fields", () => {
  const row = generalRecruit(rules, 53500, "owner", 1n),
    activated = activateGeneralRefinement(rules, row, () => 0).row;
  expect(generalProperties(String(activated.refineproperty)).size).toBe(1);
  const result = refineGeneralValues(rules, activated, false, () => 0);
  expect(text(result.row, "refineproperty")).toBe(activated.refineproperty);
  expect(result.row.oldrefineproperty).not.toBe("");
  expect(generalRefinement(result.row, rules).canbackrefinepropertylist).toBeDefined();
  for (const raw of ["1;1_0_0|1;1_1_1", "1;1_-2_0", "1;1_NaN_0", "6;1_1_1"])
    {expect(() => generalProperties(raw)).toThrow();}
});
