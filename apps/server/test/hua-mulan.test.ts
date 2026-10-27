import { expect, test } from "bun:test";
import type { Row } from "@opencok/contracts/rows";
import { loadRules } from "@opencok/resources/rules";
import { loadCatalog } from "@opencok/resources/catalogs";
import { GameplayCatalog } from "@opencok/enums/gameplay-catalog";
import {
  generalBaseSkillUpgrade,
  generalRecruit,
  generalLevel,
  generalStar,
} from "@opencok/rules/general-progression";
import { activateGeneralTalent } from "@opencok/rules/general-talents";
import { newGeneralSkillEffects } from "@opencok/rules/new-general-skills";
import { generalCombatSnapshot } from "@opencok/services/general-combat";
import { cityFixture } from "./fixtures/city-progression";

const rules = await loadRules();

test("Hua Mulan recruits with infantry health and attack and unlocks each star skill", () => {
  let row = generalRecruit(rules, 53571, "owner", 1n);
  expect(row).toMatchObject({ id: 53571, star: 1 });
  expect(
    newGeneralSkillEffects({ id: 53571, star: 1, baseSkill: "", talent: "" }, rules).skills,
  ).toEqual(
    new Map([
      [1011, 50],
      [1012, 50],
      [1051, 50],
      [1052, 50],
    ]),
  );
  expect(() => generalBaseSkillUpgrade(rules, row, 54232)).toThrow();
  for (let star = 2; star <= 5; star++) {
    const plan = generalStar(rules, row);
    expect(plan.costs).toEqual(new Map([[213293, [6000, 15000, 30000, 60000][star - 2]!]]));
    row = plan.row;
    expect(row.star).toBe(star);
  }
  expect(() => generalStar(rules, row)).toThrow();
  const upgraded = generalBaseSkillUpgrade(rules, row, 54232);
  expect(upgraded.costs).toEqual(new Map([[211453, 25]]));
  expect(
    newGeneralSkillEffects(
      { id: 53571, star: 5, baseSkill: String(upgraded.row.baseSkill), talent: "" },
      rules,
    ).skills.get(6631),
  ).toBe(15);
  expect(() => generalBaseSkillUpgrade(rules, row, 54231)).toThrow();
});

test("Hua Mulan has 60 talents and spends the level 99 budget without inventing points", () => {
  const nodes = [...rules.power.newGeneralSkills!.values()].filter(
    (skill) => skill.general === "53571" && skill.skill_group === "72",
  );
  expect(nodes).toHaveLength(60);
  expect(new Set(nodes.map((node) => Number(node.max_lv)))).toEqual(new Set([1, 10]));
  expect(nodes.reduce((sum, node) => sum + Number(node.max_lv), 0)).toBe(582);
  const base = rules.power.newGeneralBases!.get("53571")!;
  expect(base.max_level).toBe("99");
  expect(base.general_ab).toBe("41020011;53571201;53571202");
  const row: Row = {
    ...generalRecruit(rules, 53571, "owner", 1n),
    level: 99,
    talentpoint: generalLevel(rules, base, 99).points,
  };
  expect(() => activateGeneralTalent(rules, row, 53571101, 0)).toThrow();
  expect(() => activateGeneralTalent(rules, { ...row, id: 53572 }, 53571100, 0)).toThrow();
  let learned = row;
  for (const node of nodes) {
    if (Number(learned.talentpoint) === 0) break;
    learned = activateGeneralTalent(rules, learned, Number(node.id), 1);
  }
  expect(learned.talentpoint).toBe(0);
  expect(
    String(learned.talent)
      .split("|")
      .reduce((sum, entry) => sum + Number(entry.split(";")[1]), 0),
  ).toBe(564);
  expect(() => activateGeneralTalent(rules, learned, 53571157, 0)).toThrow();
  expect(() =>
    activateGeneralTalent(rules, { ...row, level: 1, talent: "53571100;3" }, 53571100, 0),
  ).toThrow();
});

test("Hua Mulan trees branch like native heroes and either completed path unlocks a merge", async () => {
  const catalog = await loadCatalog(GameplayCatalog.GeneralAb);
  for (const tree of catalog.records.filter((record) =>
    [41020011, 53571201, 53571202].includes(record.id),
  )) {
    expect(tree.skill).toHaveLength(20);
    expect(new Set(tree.position.map(([depth]) => depth)).size).toBe(12);
    expect(new Set(tree.position.map(([, column]) => column))).toEqual(new Set([2, 4, 6]));
    expect(tree.relation.some((children) => children.length === 2)).toBe(true);
    expect(tree.relation.some((children) => children.length === 3)).toBe(true);
    for (const [index, children] of tree.relation.entries()) {
      for (const child of children) {
        expect(rules.power.newGeneralSkills!.get(String(child))!.condition_skill).toContain(
          `${tree.skill[index]};`,
        );
      }
    }
  }
  const nodes = [...rules.power.newGeneralSkills!.values()].filter(
    (node) => node.general === "53571" && node.skill_group === "72" && node.type_value === "0",
  );
  for (const node of nodes) {
    const maximum =
      Number(node.base!.split(";")[0]) +
      Number(node.add!.split(";")[0]) * (Number(node.max_lv) - 1);
    expect(maximum).toBeGreaterThanOrEqual(50);
    expect(maximum).toBeLessThanOrEqual(500);
  }
  const row = { ...generalRecruit(rules, 53571, "owner", 1n), level: 99 };
  const root = activateGeneralTalent(rules, row, 53571100, 1);
  const right = activateGeneralTalent(rules, root, 53571102, 1);
  expect(right.talent).toBe("53571100;10|53571102;10");
  expect(activateGeneralTalent(rules, right, 53571103, 0).talent).toContain("53571103;1");
  expect(() => activateGeneralTalent(rules, { ...right, level: 1 }, 53571103, 0)).toThrow();
});

test("Hua Mulan combat snapshots include all six infantry bonuses without mounted effects", () => {
  const f = cityFixture(rules);
  const row = {
    ...generalRecruit(rules, 53571, "owner", 1n),
    star: 5,
    state: 3,
    baseSkill: "54228;15|54229;15|54230;15|54231;1|54232;15",
    talent: "53571100;10|53571101;10|53571102;10|53571103;10",
  };
  f.state.generalRoster = { generals: [row], purchases: [], offices: [], skills: [], statuses: [] };
  const snapshot = generalCombatSnapshot(f.context, 53571, false);
  const effects = new Map(snapshot.effects.map(({ id, value }) => [id, value]));
  expect([...effects.keys()].sort((a, b) => a - b)).toEqual([
    406, 407, 1011, 1012, 1051, 1052, 1061, 1062, 1321, 1322, 6631,
  ]);
  for (const [id, value] of [
    [1051, 620],
    [1052, 620],
    [1011, 470],
    [1012, 470],
    [1321, 130],
    [1322, 130],
    [1061, 360],
    [1062, 360],
    [406, 1],
    [407, 1],
    [6631, 80],
  ] as const) {
    expect(effects.get(id)).toBeCloseTo(value, 5);
  }
  expect(Object.isFrozen(snapshot.effects)).toBe(true);
  for (const id of [53572, 53573]) {
    const reserved = generalRecruit(rules, id, "owner", 1n);
    expect(
      newGeneralSkillEffects({ id, star: Number(reserved.star), baseSkill: "", talent: "" }, rules)
        .skills.size,
    ).toBe(0);
  }
});
