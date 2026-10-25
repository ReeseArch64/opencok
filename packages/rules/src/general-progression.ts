import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { cityInteger } from "./city-progression";
import type { Rule, Rules } from "./game";
import { num, text, type Row } from "@opencok/contracts/rows";

export function generalFailure(): never {
  throw new GameError(errors.invalid, "city_progression");
}
export function generalBase(rules: Rules, id: number): Rule {
  const base = rules.power.newGeneralBases?.get(String(cityInteger(id, 1)));
  if (!base || base.is_unlock === "0") generalFailure();
  return base;
}
export function generalPairs(raw: string | undefined | null, limit = 4096): Map<number, number> {
  const result = new Map<number, number>();
  if (!raw) return result;
  const entries = raw.split("|");
  if (entries.length > limit) generalFailure();
  for (const entry of entries) {
    const parts = entry.split(";");
    if (parts.length !== 2) generalFailure();
    const id = cityInteger(parts[0], 1),
      value = cityInteger(parts[1]);
    if (result.has(id)) generalFailure();
    result.set(id, value);
  }
  return result;
}
export function generalContent(values: ReadonlyMap<number, number>) {
  return [...values].map(([id, count]) => `${id};${count}`).join("|");
}
export function generalList(raw: string | null | undefined): number[] {
  if (!raw) return [];
  const values = raw.split(";").map((value) => cityInteger(value, 1));
  if (values.length > 4096 || new Set(values).size !== values.length) generalFailure();
  return values;
}
export function generalLevel(rules: Rules, base: Rule, level: number) {
  const rule = rules.general.levels?.get(String(53700 + cityInteger(level, 1)));
  if (!rule || !["0", "1"].includes(base.type ?? "")) generalFailure();
  return {
    exp: cityInteger(rule[base.type === "0" ? "exp1" : "exp"], 1),
    points: cityInteger(rule[base.type === "0" ? "point1" : "point"]),
  };
}
export function generalRecruit(rules: Rules, id: number, owner: string, now: bigint): Row {
  const base = generalBase(rules, id),
    level = cityInteger(base.base_level, 1);
  return {
    uid: owner,
    id,
    level,
    exp: 0,
    quality: cityInteger(base.base_quality, 1),
    talentpoint: generalLevel(rules, base, level).points,
    state: 1,
    predatoruid: "",
    relivetime: 0n,
    buildingUuid: "",
    skillInfo: "",
    createtime: now,
    talent: "",
    serverid: rules.kingdomId,
    robtime: 0n,
    killtime: 0n,
    gethomttime: 0n,
    optime: "",
    refineproperty: "",
    oldrefineproperty: "",
    refinegold: 0,
    refinecard: 0,
    refinecount: 0,
    lockproperty: "",
    refreshproperty: "",
    breach: "",
    star: cityInteger(base.base_star ?? 1, 1, 5),
    baseSkill: "",
  };
}
export function generalExperience(rules: Rules, row: Row, amount: number, count = 1) {
  const base = generalBase(rules, num(row, "id")),
    previous = num(row, "level");
  const breached = new Set(generalList(text(row, "breach"))),
    gates = generalList(base.breach_level);
  const maximum = Math.min(
    cityInteger(base.max_level, 1),
    ...[...(rules.general.levels?.values() ?? [])]
      .map((rule) => cityInteger(rule.level, 1))
      .sort((a, b) => b - a)
      .slice(0, 1),
  );
  let level = previous,
    exp = cityInteger(num(row, "exp")),
    used = 0;
  cityInteger(amount, 1);
  cityInteger(count, 1, 10000);
  if (level >= maximum || (gates.includes(level) && !breached.has(level))) generalFailure();
  const cap = Math.min(
    maximum,
    gates.filter((gate) => gate > level && !breached.has(gate)).sort((a, b) => a - b)[0] ?? maximum,
  );
  for (; used < count; used++) {
    if (level >= cap) break;
    exp = cityInteger(exp + amount);
    while (exp >= generalLevel(rules, base, level).exp && level < cap) {
      const threshold = generalLevel(rules, base, level).exp;
      level++;
      if (level >= cap) exp = threshold;
      else exp -= threshold;
    }
  }
  if (used === 0) generalFailure();
  const points = cityInteger(
    num(row, "talentpoint") +
      generalLevel(rules, base, level).points -
      generalLevel(rules, base, previous).points,
  );
  return { row: { ...row, level, exp, talentpoint: points }, used };
}
export function generalBreach(rules: Rules, row: Row) {
  const base = generalBase(rules, num(row, "id")),
    level = num(row, "level"),
    done = generalList(text(row, "breach"));
  const index = generalList(base.breach_level).indexOf(level);
  if (index < 0 || done.includes(level)) generalFailure();
  const cost = base.breach_goods?.split("|")[index];
  if (!cost) generalFailure();
  return { row: { ...row, breach: [...done, level].join(";") }, costs: generalPairs(cost) };
}
export function generalStar(rules: Rules, row: Row) {
  const base = generalBase(rules, num(row, "id")),
    star = num(row, "star");
  if (star >= cityInteger(base.star_max_level, 1, 5)) generalFailure();
  const cost = base.star_goods?.split("|")[star - 1];
  if (!cost) generalFailure();
  const skills = generalPairs(text(row, "baseSkill"));
  for (const id of generalList(base[`base_skill_${star + 1}`]))
    skills.set(id, (skills.get(id) ?? 0) + 1);
  return {
    row: { ...row, star: star + 1, baseSkill: generalContent(skills) },
    costs: generalPairs(cost),
  };
}
export function generalBaseSkills(rules: Rules, row: Row) {
  const base = generalBase(rules, num(row, "id")),
    ids = generalList(base.base_skill);
  for (let star = 2; star <= num(row, "star"); star++)
    ids.push(...generalList(base[`base_skill_${star}`]));
  return ids;
}
export function generalBaseSkillUpgrade(rules: Rules, row: Row, id: number) {
  const rule = rules.power.newGeneralSkills?.get(String(id));
  if (!rule || !generalBaseSkills(rules, row).includes(id)) generalFailure();
  const skills = generalPairs(text(row, "baseSkill")),
    level = skills.get(id) ?? 1;
  if (level >= cityInteger(rule.max_lv, 1)) generalFailure();
  const item = rule.item?.split(";")[level - 1],
    count = rule.num?.split(";")[level - 1];
  if (!item || count === undefined) generalFailure();
  skills.set(id, level + 1);
  return {
    row: { ...row, baseSkill: generalContent(skills) },
    costs: new Map([[cityInteger(item, 1), cityInteger(count)]]),
  };
}
