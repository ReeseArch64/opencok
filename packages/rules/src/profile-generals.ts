import type { GeneralAbility, GeneralPreview } from "@opencok/contracts/profile";
import type { OwnGeneralSnapshot, ReconnectProgressWrite } from "@opencok/contracts/reconnect";
import { text, type Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import type { Rules } from "./game.ts";
import { hashOrder } from "./power-hash-order.ts";

const supportedSkills = new Set([
  "601000",
  "602700",
  "610700",
  "612000",
  "622300",
  "11612400",
  "621900",
  "622000",
  "622100",
  "622200",
  "603100",
  "612400",
  "622700",
  "622800",
  "622900",
]);
const ready = 9223372036854775807n;

function invalid(): never {
  throw new GameError(errors.unsupported, "public_profile");
}

function long(value: unknown): bigint {
  if (typeof value === "number" && !Number.isSafeInteger(value)) return invalid();
  if (!/^[+-]?\d+$/.test(String(value))) return invalid();
  const result = BigInt(String(value));
  if (BigInt.asIntN(64, result) !== result) return invalid();
  return result;
}

function integer(value: unknown): number {
  const result = long(value);
  if (BigInt.asIntN(32, result) !== result) return invalid();
  return Number(result);
}

function float(value: unknown): number {
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(String(value).trim()))
    return invalid();
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return invalid();
  return Math.fround(parsed);
}

function attribute(level: number, offset: unknown, base: unknown): number {
  const result = Math.fround(Math.fround(Math.fround(level) + float(offset)) * float(base));
  if (Number.isNaN(result)) return 0;
  return Math.max(-2147483648, Math.min(2147483647, Math.trunc(result)));
}

function skillsForPreview(
  rows: readonly Row[],
  uid: string,
  now: number,
  rules: Rules,
): readonly Row[] {
  const ordered = rows
    .filter((row) => supportedSkills.has(text(row, "skillId")))
    .map((row) => {
      if (text(row, "ownerId") !== uid || !text(row, "uuid")) return invalid();
      integer(rules.power.generalSkills?.get(text(row, "skillId"))?.cd_time);
      return { row, end: long(row.endTime) };
    })
    .sort((a, b) => {
      if (a.end !== b.end) return a.end < b.end ? -1 : 1;
      const left = text(a.row, "uuid");
      const right = text(b.row, "uuid");
      return left < right ? -1 : left > right ? 1 : 0;
    });
  const selected = new Map<string, Row>();
  for (const { row, end } of ordered) {
    const reset = BigInt.asIntN(64, BigInt(now) + 5000n) >= end;
    const start = long(row.startTime);
    const stat = integer(row.stat ?? 0);
    selected.set(text(row, "skillId"), {
      uuid: text(row, "uuid"),
      ownerId: uid,
      skillId: text(row, "skillId"),
      startTime: reset || start === ready ? 0n : start,
      endTime: reset || end === ready ? 0n : end,
      actTime: long(row.actTime ?? 0),
      stat: stat === 2 ? 0 : stat,
      param1: integer(row.param1 ?? 0),
      param2: integer(row.param2 ?? 0),
    });
  }
  return hashOrder(selected.keys()).map((key) => selected.get(key)!);
}

function repairedAbilities(
  trees: readonly GeneralAbility[],
  rules: Rules,
): readonly GeneralAbility[] {
  const combat = trees.find((tree) => tree.id === "50000");
  if (!combat || integer(combat["602700"] ?? 0) <= 0) return trees;
  const full = (id: string) => integer(rules.power.generalSkills?.get(id)?.max_lv ?? 20);
  if (integer(combat["601300"] ?? 0) < full("601300")) return [];
  if (
    integer(combat["601100"] ?? 0) < full("601100") &&
    integer(combat["601200"] ?? 0) < full("601200")
  )
    return [];
  return trees;
}

export function reconnectGeneralRepairs(
  generals: readonly Row[],
  skills: readonly Row[],
  abilities: ReadonlyMap<string, readonly GeneralAbility[]>,
  uid: string,
  rules: Rules,
  now: number,
): Pick<ReconnectProgressWrite, "generalResets" | "skillResets" | "skillCooldownResets"> {
  if (!Number.isSafeInteger(now) || !uid) return invalid();
  const generalResets: string[] = [];
  const skillResets: string[] = [];
  const skillCooldownResets: string[] = [];
  if (!generals.length) return { generalResets, skillResets, skillCooldownResets };
  const seen = new Set<string>();
  for (const general of generals) {
    const uuid = text(general, "uuid");
    const trees = abilities.get(uuid);
    if (!uuid || seen.has(uuid) || !trees) return invalid();
    seen.add(uuid);
    if (repairedAbilities(trees, rules) !== trees) generalResets.push(uuid);
  }
  seen.clear();
  for (const skill of skills) {
    const uuid = text(skill, "uuid");
    if (!uuid || seen.has(uuid) || text(skill, "ownerId") !== uid) return invalid();
    seen.add(uuid);
    const end = long(skill.endTime);
    if (end !== ready && end <= BigInt.asIntN(64, BigInt(now) + 5000n))
      skillCooldownResets.push(uuid);
    if (supportedSkills.has(text(skill, "skillId")) && integer(skill.stat ?? 0) === 2)
      skillResets.push(uuid);
  }
  return { generalResets, skillResets, skillCooldownResets };
}

export function publicGeneralPreviews(
  generals: readonly Row[],
  skills: readonly Row[],
  abilities: ReadonlyMap<string, readonly GeneralAbility[]>,
  uid: string,
  rules: Rules,
  now: number,
): readonly GeneralPreview[] {
  if (!generals.length) return invalid();
  return projectGenerals(generals, skills, abilities, uid, rules, now, true).map((general) => {
    const preview: GeneralPreview & { abilityIndex?: number } = { ...general };
    delete preview.abilityIndex;
    return preview;
  });
}

export function ownGeneralSnapshots(
  generals: readonly Row[],
  skills: readonly Row[],
  abilities: ReadonlyMap<string, readonly GeneralAbility[]>,
  uid: string,
  rules: Rules,
  now: number,
): readonly OwnGeneralSnapshot[] {
  return projectGenerals(generals, skills, abilities, uid, rules, now, false).map((general) => {
    const snapshot: OwnGeneralSnapshot & { plusSkillPoint?: number } = { ...general };
    delete snapshot.plusSkillPoint;
    return snapshot;
  });
}

function projectGenerals(
  generals: readonly Row[],
  skills: readonly Row[],
  abilities: ReadonlyMap<string, readonly GeneralAbility[]>,
  uid: string,
  rules: Rules,
  now: number,
  publicPreview: boolean,
): readonly (GeneralPreview & { abilityIndex: number })[] {
  if (!Number.isSafeInteger(now) || !uid) return invalid();
  if (!generals.length) return [];
  const selected = new Map<string, Row>();
  for (const row of generals) {
    const uuid = text(row, "uuid");
    if (!uuid || selected.has(uuid)) return invalid();
    selected.set(uuid, row);
  }
  const initiative = skillsForPreview(skills, uid, now, rules);
  const injected = initiative
    .map((row) => text(row, "skillId"))
    .filter((id) => id === "622800" || id === "622900");
  return hashOrder(selected.keys()).map((uuid) => {
    const row = selected.get(uuid)!;
    const generalId = text(row, "generalId");
    const rule = rules.power.generals?.get(generalId);
    const progression = rules.items.get("hero_up");
    const level = integer(row.level);
    const trees = abilities.get(uuid);
    if (!rule || !progression || !trees) return invalid();
    const preview = repairedAbilities(trees, rules).flatMap((tree, index) => {
      if (publicPreview && Object.hasOwn(tree, "ids")) return [];
      const copy: Record<string, string | number | null> = { ...tree };
      if (index === 0) for (const id of injected) copy[id] = 1;
      delete copy["620700"];
      return [copy];
    });
    return {
      uuid,
      generalId,
      level,
      status: integer(row.status),
      attack: attribute(level, progression.k1, rule.attack),
      defence: attribute(level, progression.k2, rule.defence),
      plusSkillPoint: publicPreview ? integer(row.plusSkillPoint ?? 0) : 0,
      abilityIndex: publicPreview ? 0 : integer(row.abilityIndex ?? 0),
      ability: preview,
      skills: initiative,
    };
  });
}
