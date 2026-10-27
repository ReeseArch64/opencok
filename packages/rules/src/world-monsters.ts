import { num, text, long, type Row } from "@opencok/contracts/rows";
import type { Rules } from "./game";
import { cityInteger } from "./city-progression";
import { worldFootprint, worldMutationFailure } from "./world-march-runtime";
import { worldMonsterMaximum } from "./world-monster-detail";

export function worldMonsterConfiguration(rules: Rules, id: string) {
  const rule = rules.world.fieldMonsters?.get(id);

  if (!rule || rule.id !== id) worldMutationFailure();

  return { id, four: rule.num === "4", boss: rule.boss === "1" || rule.boss === "2" };
}

export function worldMonsterSpawn(
  rules: Rules,
  source: Row,
  id: string,
  now: bigint,
  seconds: number,
  custom: boolean,
) {
  const config = worldMonsterConfiguration(rules, id);
  cityInteger(seconds, 1);

  if (now < 0n || now > 9223372036854775807n - BigInt(seconds) * 1000n) worldMutationFailure();

  return {
    ...source,
    pointType: config.boss ? 15 : 9,
    pointItem: id,
    startTime: now,
    flushTime: now + BigInt(seconds) * 1000n,
    monsterCurrHP: 0,
    flushFlag: custom ? 1 : 0,
  };
}

export function worldMonsterProp(
  rules: Rules,
  points: readonly Row[],
  id: number,
  monsterId: string,
  size: number,
  now: bigint,
) {
  if (now < 5000n) worldMutationFailure();

  const config = worldMonsterConfiguration(rules, monsterId),
    source = points.find((row) => num(row, "id") === id);

  if (!source) worldMutationFailure();

  const result: Row[] = [
    worldMonsterSpawn(
      rules,
      source,
      monsterId,
      now - 5000n,
      cityInteger(rules.items.get("monster_time")?.k1, 1),
      true,
    ),
  ];

  if (config.four)
    for (const other of worldFootprint(id, size, true)) {
      if (other === id) continue;

      const row = points.find((row) => num(row, "id") === other);

      if (
        !row ||
        num(row, "pointType") !== 0 ||
        text(row, "ownerId") ||
        text(row, "ownerMarchUUid")
      )
        worldMutationFailure();

      result.push({ ...row, pointType: 17 });
    }

  return result;
}

export function reusableWorldMonster(
  point: Row,
  id: string,
  minimum: bigint,
  now: bigint,
  rules: Rules,
) {
  return (
    num(point, "pointType") === 9 &&
    text(point, "pointItem") === id &&
    long(point, "flushTime") - now > minimum &&
    (num(point, "monsterCurrHP") > 0 || worldMonsterMaximum(9, id, rules) > 0)
  );
}

export function worldMonsterAreaRanges(area: number, side: number, size: number) {
  cityInteger(area, 0);
  cityInteger(side, 1, size);
  const normal = Math.floor(size / side),
    x = (area % normal === 0 ? Math.floor(area / normal) - 1 : Math.floor(area / normal)) * side,
    y = (area % normal === 0 ? normal - 1 : (area % normal) - 1) * side;

  if (x < size - 1 && y < size - 1)
    return [[x, Math.min(size - 1, x + side - 1), y, Math.min(size - 1, y + side - 1)]];

  return [
    [size - 1, size - 1, 0, size - 1],
    [0, size - 1, size - 1, size - 1],
  ];
}

export function chooseWorldMonsterCells(
  points: readonly Row[],
  four: boolean,
  size: number,
  random: (maximum: number) => number,
) {
  const candidates = [...points],
    lookup = new Map(points.map((row) => [num(row, "id"), row]));

  while (candidates.length) {
    const index = random(candidates.length);

    if (!Number.isInteger(index) || index < 0 || index >= candidates.length) worldMutationFailure();

    const point = candidates[index]!,
      id = num(point, "id");

    if (!four) return [point];

    let ids: readonly number[] = [];

    try {
      ids = worldFootprint(id, size, true);
    } catch {
      ids = [];
    }

    if (ids.length === 4 && ids.every((id) => lookup.has(id)))
      return [point, ...ids.filter((other) => other !== id).map((other) => lookup.get(other)!)];

    candidates.splice(index, 1);
    lookup.delete(id);
  }

  return [];
}

export function spawnWorldMonsterCells(
  rules: Rules,
  points: readonly Row[],
  id: string,
  now: bigint,
  seconds: number,
) {
  const config = worldMonsterConfiguration(rules, id);

  if (points.length !== (config.four ? 4 : 1)) worldMutationFailure();

  return [
    worldMonsterSpawn(rules, points[0]!, id, now, seconds, false),
    ...points.slice(1).map((row) => ({
      ...row,
      pointType: 17,
      pointItem: id,
      startTime: now,
      flushTime: now + BigInt(seconds) * 1000n,
      monsterCurrHP: 0,
      flushFlag: 0,
    })),
  ];
}
