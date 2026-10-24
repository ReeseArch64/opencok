import type { Rule, Rules } from "./game.ts";
import { javaDecimal } from "./java-integer.ts";
import { javaFloat } from "./java-float.ts";
import { javaIntHashMapOrder } from "./java-hash-map-order.ts";
import { mailBlank } from "./mail.ts";

export interface NewGeneralSkillState {
  id: number;
  star: number;
  baseSkill: string | null;
  talent: string | null;
}

function split(raw: string | null | undefined, separator: string, limit = 65535): string[] {
  if (raw != null && (typeof raw !== "string" || raw.length > limit))
    throw new Error("Invalid new-general skill content");
  if (mailBlank(raw)) return [];
  const values = raw!
    .split(separator)
    .filter((value, i, all) => value.length > 0 || i === all.length - 1);
  if (values.length > 4096) throw new Error("Too many new-general skill values");
  return values;
}

function integer(raw: unknown): number {
  return Number(javaDecimal(raw, 32));
}

function levels(raw: string | null, limit: number): Map<number, number> {
  const result = new Map<number, number>();
  for (const entry of split(raw, "|", limit)) {
    const parts = split(entry, ";");
    if (parts.length === 2) result.set(integer(parts[0]), integer(parts[1]));
  }
  return result;
}

function addSkill(result: Map<number, number>, skill: Rule | undefined, level: () => number) {
  if (integer(skill?.type) !== 0) return;
  const ids = split(skill?.para1, ";");
  const bases = split(skill?.base, ";").map(javaFloat);
  const additions = split(skill?.add, ";").map(javaFloat);
  for (let i = 0; i < ids.length; i++) {
    const id = integer(ids[i]);
    const factor = Math.fround((level() - 1) | 0);
    const value = Math.fround((bases[i] ?? 0) + Math.fround((additions[i] ?? 0) * factor));
    result.set(id, Math.fround((result.get(id) ?? 0) + value));
  }
}

export function newGeneralSkillEffects(state: NewGeneralSkillState, rules: Rules) {
  if (
    !Number.isInteger(state.id) ||
    state.id < -2147483648 ||
    state.id > 2147483647 ||
    !Number.isInteger(state.star) ||
    state.star < -2147483648 ||
    state.star > 2147483647
  )
    throw new Error("Invalid new-general skill state");
  const talents = levels(state.talent, 5000);
  const saved = levels(state.baseSkill, 256);
  const base = rules.power.newGeneralBases?.get(String(state.id));
  const ids = split(base?.base_skill, ";");
  const stars = Object.keys(base ?? {})
    .filter((key) => /^base_skill_[1-9]\d*$/.test(key))
    .map((key) => Number(key.slice(11)))
    .filter((star) => star >= 2 && star <= state.star)
    .sort((a, b) => a - b);
  for (const star of stars) {
    const extra = base?.[`base_skill_${star}`];
    if (!mailBlank(extra)) {
      const next = split(extra, ";");
      if (ids.length) ids.push(...next);
      if (ids.length > 4096) throw new Error("Too many new-general skills");
    }
  }
  const skills = new Map<number, number>();
  for (const id of ids) {
    const skill = rules.power.newGeneralSkills?.get(id);
    if (mailBlank(skill?.condition_type))
      addSkill(skills, skill, () => saved.get(integer(id)) ?? 1);
  }
  const talentEffects = new Map<number, number>();
  for (const id of javaIntHashMapOrder(talents.keys()))
    addSkill(talentEffects, rules.power.newGeneralSkills?.get(String(id)), () => talents.get(id)!);
  return {
    skills: new Map(javaIntHashMapOrder(skills.keys()).map((id) => [id, skills.get(id)!])),
    talents: new Map(
      javaIntHashMapOrder(talentEffects.keys()).map((id) => [id, talentEffects.get(id)!]),
    ),
  };
}
