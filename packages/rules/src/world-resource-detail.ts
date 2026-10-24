import type { Row } from "@opencok/contracts/rows";
import type {
  WorldResourceLoad,
  WorldResourceArmy,
  WorldResourceSoldier,
  WorldResourceLoadEffects,
  WorldResourceCollection,
  WorldResourceMarch,
  WorldResourceSavedCollection,
  WorldResourceOwnerDetail,
  WorldResourceGroupDetail,
} from "@opencok/contracts/world-resource-detail";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { Rules } from "./game.ts";
import { javaDecimal } from "./java-integer.ts";
import { mailBlank } from "./mail.ts";

function invalid(): never {
  throw new GameError(errors.unsupported, "world_resource_detail");
}
function integer(value: number): number {
  if (!Number.isInteger(value) || value < -2147483648 || value > 2147483647) return invalid();
  return value;
}
function long(value: bigint): bigint {
  if (typeof value !== "bigint" || BigInt.asIntN(64, value) !== value) return invalid();
  return value;
}
function speed(value: number): number {
  if (typeof value !== "number" || !Number.isFinite(value) || !Number.isFinite(Math.fround(value)))
    return invalid();
  return Math.fround(value);
}
function narrow(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(-2147483648, Math.min(2147483647, Math.trunc(value))) || 0;
}
export function resourceLongFloat(value: bigint): number {
  long(value);
  const magnitude = value < 0n ? -value : value;
  const shift = magnitude.toString(2).length - 24;
  if (shift <= 0) return Number(value);
  let leading = magnitude >> BigInt(shift);
  const tail = magnitude - (leading << BigInt(shift));
  const half = 1n << BigInt(shift - 1);
  if (tail > half || (tail === half && (leading & 1n) !== 0n)) leading++;
  return (value < 0n ? -1 : 1) * Number(leading) * 2 ** shift;
}
export function resourceRemaining(initial: number, cost: number): number {
  return (integer(initial) - integer(cost)) | 0;
}
export function resourceSavedCollection(row: Row): WorldResourceSavedCollection {
  const rate = row.collectSpd ?? 0;
  if (typeof rate !== "number" || (Number.isFinite(rate) && !Number.isFinite(Math.fround(rate))))
    return invalid();
  const collected = long((row.collectedBeforeSpd ?? 0n) as bigint);
  if (collected < -2147483648n || collected > 2147483647n) return invalid();
  return {
    collectSpd: Math.fround(rate),
    marchArrivalTime: long((row.marchArrivalTime ?? 0n) as bigint),
    collectedBeforeSpd: Number(collected),
    changeCollectSpdTime: long((row.changeCollectSpdTime ?? 0n) as bigint),
    occupyResourceEndTime: long((row.occupyResourceEndTime ?? 0n) as bigint),
  };
}
export function resourceSoldierLoadBase(
  soldier: Pick<WorldResourceSoldier, "total" | "dead"> & { armsId: string | null },
  rules: Rules,
): number | undefined {
  if (
    typeof soldier.armsId !== "string" ||
    soldier.armsId.length > 255 ||
    !soldier.armsId.isWellFormed() ||
    soldier.armsId.includes("\0")
  )
    return invalid();
  const arms = rules.arms.get(soldier.armsId);
  if (!arms) return invalid();
  if (!Object.hasOwn(arms, "load")) return undefined;
  let load: number;
  try {
    load = Number(javaDecimal(arms.load, 32));
  } catch {
    return invalid();
  }
  return Math.imul(load, (integer(soldier.total) - integer(soldier.dead)) | 0);
}
export function resourceModifiedTroopLoad(
  base: number,
  savedEffect: number,
  effects?: WorldResourceLoadEffects,
): number {
  integer(base);
  const float = (value: number): number => {
    if (typeof value !== "number" || !Object.is(Math.fround(value), value)) return invalid();
    return value;
  };
  let effect = Math.fround(0);
  if (effects) {
    effect = Math.fround(float(effects.worldLoad) + float(effects.worldLoadAdd));
    effect = Math.fround(effect + float(effects.general));
    effect = Math.fround(effect + float(effects.newGeneral));
    effect = Math.fround(effect + float(effects.expedition));
  }
  const multiplier = Math.max(
    Math.fround(Math.fround(100 + effect) + Math.fround(integer(savedEffect))),
    20,
  );
  return narrow(Math.fround(Math.fround(Math.fround(base) * multiplier) / 100));
}
export function resourceRawArmyLoad(army: WorldResourceArmy, rules: Rules): number {
  const cached = integer(army.cachedLoad);
  if (typeof army.residentOwner !== "boolean") return invalid();
  if (!army.residentOwner && cached > 0) return cached;
  if (!Array.isArray(army.soldiers) || army.soldiers.length > 4096) return invalid();
  let result = 0;
  for (const soldier of army.soldiers) {
    const base = resourceSoldierLoadBase(soldier, rules);
    if (base === undefined) continue;
    const effects = army.effects;
    if (!effects && army.residentOwner) return invalid();
    result = (result + resourceModifiedTroopLoad(base, soldier.loadEffect, effects)) | 0;
  }
  return result;
}
export function resourceArmyLoad(input: WorldResourceLoad, rules: Rules): number {
  let load = integer(input.rawArmyLoad);
  const type = integer(input.pointType),
    item = input.pointItem;
  if (
    item !== null &&
    (typeof item !== "string" || item.length > 255 || !item.isWellFormed() || item.includes("\0"))
  )
    return invalid();
  if (input.plunder.length > 32767) return invalid();
  if (item !== null && !mailBlank(item) && item !== "null") {
    let numeric = true;
    for (const character of item) {
      try {
        javaDecimal(character, 32);
      } catch {
        numeric = false;
        break;
      }
    }
    if (numeric) {
      try {
        const resource = Number(javaDecimal(item, 32));
        if (resource >= 0 && resource <= 5) {
          const weight = javaDecimal(rules.items.get("resources_weight")?.[`k${resource + 1}`], 32);
          if (weight === 0n) return invalid();
          load = Number(BigInt.asIntN(32, BigInt(load) / weight));
        }
      } catch {
        return invalid();
      }
    }
  }
  const value = input.plunder.length === 1 ? input.plunder[0]!.value : undefined;
  const plunder = type !== 18 && type !== 19 && value !== undefined ? integer(value) : 0;
  return (load - plunder) | 0;
}
export function resourceCollected(
  pointType: number,
  remaining: number,
  march: WorldResourceCollection,
  now: bigint,
): number {
  integer(pointType);
  integer(remaining);
  integer(march.armyLoad);
  const rate = speed(march.collectSpd);
  const elapsed = BigInt.asIntN(64, long(now) - long(march.marchArrivalTime));
  const seconds = Math.fround(resourceLongFloat(elapsed) / Math.fround(1000));
  if (seconds < 0) return 0;
  const collected = narrow(Math.fround(rate * seconds));
  if (pointType === 18) return Math.min(collected, march.armyLoad);
  if (pointType === 37) return collected;
  const result = Math.min(remaining, Math.min(collected, march.armyLoad));
  return ((remaining - result) | 0) === 1 ? remaining : result;
}
export function resourceOwnerDetail(
  pointType: number,
  remaining: number,
  march: WorldResourceMarch,
): WorldResourceOwnerDetail {
  integer(pointType);
  integer(remaining);
  integer(march.armyLoad);
  const rate = speed(march.collectSpd);
  const maximumTime = long(march.maxCollectTime);
  const quantity =
    pointType === 37
      ? narrow(Math.fround(resourceLongFloat(maximumTime / 1000n) * rate))
      : Math.min(remaining, march.armyLoad);
  return {
    quantity,
    speed: rate,
    startTime: long(march.marchArrivalTime),
    remaining,
    collected: integer(march.collectedBeforeSpd),
    speedChangedAt: long(march.changeCollectSpdTime),
    occupyEndTime: long(march.occupyResourceEndTime),
  };
}
export function resourceGroupDetail(
  remaining: number,
  marches: readonly WorldResourceCollection[],
  clock: () => bigint,
): WorldResourceGroupDetail | undefined {
  integer(remaining);
  if (marches.length > 32767) return invalid();
  if (!marches.length) return undefined;
  let totalSpeed = Math.fround(0),
    collected = 0;
  for (const march of marches) {
    totalSpeed = Math.fround(totalSpeed + speed(march.collectSpd));
    collected = (collected + resourceCollected(37, remaining, march, clock())) | 0;
  }
  return {
    speed: totalSpeed,
    remaining: (remaining - collected) | 0,
    sampledAt: Number(long(clock())),
  };
}

export function neutralResourceStart(
  point: Row,
  march: Row | undefined,
  rules: Rules,
): bigint | undefined {
  if (point.pointType !== 60 || point.pointItem == null) return undefined;
  if (
    typeof point.pointItem !== "string" ||
    point.pointItem.length > 255 ||
    !point.pointItem.isWellFormed() ||
    point.pointItem.includes("\0")
  )
    return invalid();
  if (mailBlank(point.pointItem) || !march) return undefined;
  integer(point.id as number);
  if (march.targetId !== point.id || march.state !== 1) return invalid();
  const end = long((march.occupyResourceEndTime ?? 0n) as bigint);
  let seconds: bigint;
  try {
    seconds = javaDecimal(rules.world.neutralResources?.get(point.pointItem)?.gather_time, 32);
  } catch {
    return invalid();
  }
  return BigInt.asIntN(64, end - seconds * 1000n);
}
