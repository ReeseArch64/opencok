import type {
  WorldResourceLoad,
  WorldResourceCollection,
  WorldResourceMarch,
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
