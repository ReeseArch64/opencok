import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { generalRecruit, generalPairs } from "@opencok/rules/general-progression";
import { activateGeneralTalent, validateGeneralTalents } from "@opencok/rules/general-talents";
const rules = await loadRules();

test("legacy blank prerequisites allow learning and validating restored talent trees", () => {
  const base = rules.power.newGeneralBases!.get("53535")!;
  const root = [...rules.power.newGeneralSkills!.values()].find(
    (skill) =>
      skill.skill_group === base.talent &&
      skill.condition_skill === " " &&
      Number(skill.max_lv) > 1,
  )!;
  expect(root).toBeDefined();
  const row = generalRecruit(rules, 53535, "owner", 1n);
  const learned = activateGeneralTalent(rules, row, Number(root.id), 0);
  expect(learned.talent).toBe(`${root.id};1`);
  expect(validateGeneralTalents(rules, learned, generalPairs(learned.talent))).toBe(2);
  const next = activateGeneralTalent(rules, learned, Number(root.id), 0);
  expect(next.talent).toBe(`${root.id};2`);
  expect(next.talentpoint).toBe(1);
});

test("saved talent balances remain authoritative when restored allocations exceed a current level table", () => {
  const base = rules.power.newGeneralBases!.get("53535")!;
  const root = [...rules.power.newGeneralSkills!.values()].find(
    (skill) =>
      skill.skill_group === base.talent &&
      skill.condition_skill === " " &&
      Number(skill.max_lv) >= 5,
  )!;
  const row = {
    ...generalRecruit(rules, 53535, "owner", 1n),
    talent: `${root.id};4`,
    talentpoint: 2,
  };
  const learned = activateGeneralTalent(rules, row, Number(root.id), 0);
  expect(learned.talent).toBe(`${root.id};5`);
  expect(learned.talentpoint).toBe(1);
  expect(() =>
    activateGeneralTalent(rules, { ...row, talentpoint: 0 }, Number(root.id), 0),
  ).toThrow();
  expect(activateGeneralTalent(rules, { ...row, level: 55 }, Number(root.id), 0).talentpoint).toBe(
    1,
  );
});
