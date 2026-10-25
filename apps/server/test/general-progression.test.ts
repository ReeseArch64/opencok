import { describe, expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
  generalRecruit,
  generalExperience,
  generalBreach,
  generalStar,
  generalBaseSkillUpgrade,
  generalPairs,
} from "@opencok/rules/general-progression";
import { generalPurchase } from "@opencok/mappings/generals";
import { decode, fields, Type } from "@opencok/messages/sfs";
import { generalsDomain } from "@opencok/services/generals";
import { cityFixture } from "./fixtures/city-progression";
const rules = await loadRules();
const base = {
  id: "53500",
  type: "1",
  base_level: "1",
  base_quality: "1",
  base_star: "1",
  max_level: "5",
  breach_level: "3",
  breach_goods: "211128;2",
  star_max_level: "3",
  star_goods: "211128;2|211128;4",
  base_skill: "53900",
  base_skill_2: "53901",
};
function fixture() {
  const r = Object.create(rules) as typeof rules;
  Object.defineProperty(r, "power", {
    value: {
      ...rules.power,
      newGeneralBases: new Map([[base.id, base]]),
      newGeneralSkills: new Map([
        ["53900", { id: "53900", max_lv: "3", item: "211128;211128", num: "2;4" }],
      ]),
    },
  });
  return { r, row: generalRecruit(r, 53500, "owner", 1234n) };
}
describe("general progression", () => {
  test("large login purchase rosters keep the full response and a bounded initialization event", async () => {
    const { r } = fixture();
    Object.defineProperty(r, "features", {
      value: new Map([["general", { version: "1.0.0", online: "all" }]]),
    });
    const { state, context } = cityFixture(r);
    state.generalRoster = {
      generals: [],
      purchases: Array.from({ length: 1000 }, (_, index) => ({
        generalId: 53500 + index,
        countType1: index,
      })),
      skills: [],
      statuses: [],
      offices: [],
    };
    const result = await generalsDomain.prepare(context, "general.init", {});
    expect(result.response.byteLength).toBeGreaterThan(65536);
    const body = fields(decode(Buffer.from(result.response)).data);
    expect(body.generalBuyList?.type).toBe(Type.Array);
    expect(body.generalBuyList?.value).toHaveLength(1000);
    expect(result.event).toBeInstanceOf(Uint8Array);
    expect(result.event!.byteLength).toBeLessThanOrEqual(65536);
    expect(decode(Buffer.from(result.event!))).toEqual({
      at: { type: Type.Long, value: context.now },
    });
    expect(state.generalRoster.purchases).toHaveLength(1000);
  });

  test("starts at catalog values without granting player levels", () => {
    const { row } = fixture();
    expect(row).toMatchObject({
      level: 1,
      exp: 0,
      state: 1,
      star: 1,
      talentpoint: 3,
      createtime: 1234n,
    });
  });
  test("stops at breach and consumes only usable experience items", () => {
    const { r, row } = fixture(),
      result = generalExperience(r, row, 1000, 10);
    expect(result.row).toMatchObject({ level: 3, talentpoint: 9 });
    expect(result.used).toBe(2);
    expect(() => generalExperience(r, result.row, 1000)).toThrow();
    const breach = generalBreach(r, result.row);
    expect(breach.costs.get(211128)).toBe(2);
    expect(() => generalBreach(r, breach.row)).toThrow();
    expect(generalExperience(r, breach.row, 10000, 10).row.level).toBe(5);
  });
  test("star and basic skill costs are indexed by current progression", () => {
    const { r, row } = fixture();
    expect(generalStar(r, row)).toMatchObject({ row: { star: 2, baseSkill: "53901;1" } });
    const skill = generalBaseSkillUpgrade(r, row, 53900);
    expect(skill.row.baseSkill).toBe("53900;2");
    expect(skill.costs.get(211128)).toBe(2);
    expect(generalBaseSkillUpgrade(r, skill.row, 53900).costs.get(211128)).toBe(4);
    expect(() => generalBaseSkillUpgrade(r, row, 53901)).toThrow();
  });
  test("rejects malformed quantities and preserves native purchase field names", () => {
    for (const raw of ["1;-1", "1;1|1;2", "1;1;1", "0;1"])
      expect(() => generalPairs(raw)).toThrow();
    expect(generalPurchase({ generalId: 53500, countType1: 2 }).buyCountType1).toEqual({
      type: Type.Int,
      value: 2,
    });
  });
});
