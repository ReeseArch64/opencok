import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { newGeneralPrestigeLevel } from "./new-general-prestige";
import type {
  CityProgressionState,
  ProgressionActivityData,
} from "@opencok/contracts/city-progression";
import type { BuildingState } from "@opencok/contracts/building";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import type { Rules } from "./game";

export const cityAssets = ["wood", "stone", "iron", "food", "silver"] as const;
export type CityAsset = (typeof cityAssets)[number];
export type CityEffect = (id: number) => number;
export const progressionEffectIds = [
  57, 66, 67, 68, 69, 73, 80, 88, 108, 113, 114, 115, 116, 121, 131, 180, 181, 301, 302, 303, 304,
  310, 415, 453, 454, 751, 752, 753, 754, 755, 756, 757, 758, 759, 760, 761, 762, 763, 764, 772,
  773, 774, 852, 2078, 2143, 2144, 2145, 2146, 2147, 2148, 2149, 2150, 2151, 2152, 2153, 2154, 2155,
  2190, 2191, 2192,
] as const;
export type ProgressionEffectId = (typeof progressionEffectIds)[number];

export function cityInteger(value: unknown, minimum = 0, maximum = 2147483647): number {
  if (!/^[0-9]+$/.test(String(value))) throw new GameError(errors.invalid, "city_progression");
  const result = Number(value);
  if (!Number.isSafeInteger(result) || result < minimum || result > maximum)
    throw new GameError(errors.invalid, "city_progression");
  return result;
}
export function cityAmount(value: unknown): bigint {
  if (!/^[0-9]+$/.test(String(value))) throw new GameError(errors.invalid, "city_progression");
  const result = BigInt(String(value));
  if (result > 9223372036854775807n) throw new GameError(errors.invalid, "city_progression");
  return result;
}
export function reducedCityCost(value: bigint, ...reductions: number[]): bigint {
  let result = Number(value);
  if (!Number.isSafeInteger(result)) throw new GameError(errors.invalid, "city_progression");
  for (const reduction of reductions) {
    if (!Number.isFinite(reduction)) throw new GameError(errors.invalid, "city_progression");
    result *= Math.max(0, 1 - reduction / 100);
  }
  if (!Number.isSafeInteger(Math.trunc(result)))
    throw new GameError(errors.invalid, "city_progression");
  return BigInt(Math.trunc(result));
}
export function cityDuration(seconds: number, speed: number, reductionSeconds = 0): bigint {
  if (
    ![seconds, speed, reductionSeconds].every(Number.isFinite) ||
    seconds < 0 ||
    speed <= -100 ||
    reductionSeconds < 0
  )
    throw new GameError(errors.invalid, "city_progression");
  const millis = Math.max(
    3000,
    Math.trunc((seconds * 1000) / (1 + speed / 100) - reductionSeconds * 1000),
  );
  if (!Number.isSafeInteger(millis)) throw new GameError(errors.invalid, "city_progression");
  return BigInt(millis);
}
export function cityLevel(row: Row) {
  return num(row, "level") + num(row, "star");
}
export function cityPrestige(
  state: CityProgressionState,
  rules: Rules,
  civilization = num(state.profile, "civilizationType"),
): number {
  const prestiges = state.effects.prestige.map((row) => ({
    civilizationType: num(row, "civilizationType"),
    prestigeValue: long(row, "prestigeValue"),
  }));
  if (civilization) return newGeneralPrestigeLevel(civilization, prestiges, rules);
  return Math.max(
    0,
    ...prestiges.map((row) => newGeneralPrestigeLevel(row.civilizationType, prestiges, rules)),
  );
}
export function checkCityBuildingRequirements(
  state: CityProgressionState,
  rule: BuildingState,
  rules: Rules,
) {
  if (rule.limit === 1) throw new GameError(errors.buildingLimited, "city_progression");
  for (const requirement of rule.requiredBuildings ?? [])
    if (
      !state.buildings.some(
        (row) =>
          num(row, "itemId") === requirement.buildingId && cityLevel(row) >= requirement.level,
      )
    )
      throw new GameError(errors.resource, "city_progression");
  for (const requirement of rule.requiredStarBuildings ?? []) {
    const base = Math.trunc(requirement.levelId / 100) * 100,
      star = requirement.levelId % 100;
    if (
      state.buildings.filter((row) => num(row, "itemId") === base && num(row, "star") >= star)
        .length < requirement.quantity
    )
      throw new GameError(errors.resource, "city_progression");
  }
  if (
    (rule.civilizationLevel ?? 0) >
    (num(state.profile, "civilizationType") === 0 ? 0 : cityPrestige(state, rules))
  )
    throw new GameError(errors.prestige, "city_progression");
}
export function checkCityPosition(
  state: CityProgressionState,
  rules: Rules,
  pos: number,
  itemId: string,
) {
  cityInteger(pos);
  const rule = [...rules.positions.values()].find((row) => Number(row.position) === pos);
  if (!rule || !(rule.building?.split(";") ?? []).includes(itemId))
    throw new GameError(errors.invalid, "city_progression");
  const opened = text(state.profile, "openedPos").split(/[;|,]/).includes(String(pos));
  if (rule.unlock !== "1" && !opened) throw new GameError(errors.locked, "city_progression");
}
export function cityQueueType(itemId: number): number | undefined {
  return (
    {
      403000: 6,
      411000: 3,
      416000: 2,
      423000: 1,
      424000: 8,
      425000: 9,
      426000: 10,
      429000: 11,
      436000: 16,
      439000: 17,
      440000: 18,
    } as Record<number, number>
  )[itemId];
}
export function citySpeedGold(rules: Rules, durationMs: bigint, troops = false): bigint {
  const seconds = Number(durationMs / 1000n);
  if (!Number.isSafeInteger(seconds) || seconds < 0)
    throw new GameError(errors.invalid, "city_progression");
  if (!seconds) return 0n;
  const rule = rules.items.get("cd_gold"),
    unit = Number(troops ? rule?.k5 : rule?.k1),
    power = Number(troops ? rule?.k6 : rule?.k2);
  if (!(unit > 0) || !Number.isFinite(power))
    throw new GameError(errors.unsupported, "city_progression");
  return BigInt(
    cityInteger(
      Math.max(
        1,
        Math.trunc(
          seconds / (unit * Math.pow(Math.fround(Math.fround(seconds) / 3600), power / 100)),
        ),
      ),
    ),
  );
}
export function cityResourceGold(rules: Rules, asset: CityAsset, amount: bigint): bigint {
  if (!amount) return 0n;
  if (amount < 0n || amount > BigInt(Number.MAX_SAFE_INTEGER))
    throw new GameError(errors.invalid, "city_progression");
  const limits = rules.items.get("resource_cost"),
    first = rules.items.get("resource_num1"),
    second = rules.items.get("resource_num2"),
    scale = rules.items.get("resource_num3");
  if (!limits || !first || !second || !scale)
    throw new GameError(errors.unsupported, "city_progression");
  if (asset === "silver")
    return BigInt(
      cityInteger(
        Math.ceil(Math.fround(Math.fround(Number(amount)) * Math.fround(Number(scale.k5)))),
      ),
    );
  let tier = 0;
  while (tier < 4 && amount > cityAmount(limits[`k${tier + 1}`])) tier++;
  const source = tier === 4 ? second : first,
    offset = tier === 4 ? 1 : tier * 3 + 1;
  const a = Math.fround(Number(source[`k${offset}`])),
    b = Math.fround(Number(source[`k${offset + 1}`])),
    c = Math.fround(Number(source[`k${offset + 2}`]));
  const multiplier = Math.fround(
    Number(scale[({ food: "k1", wood: "k2", stone: "k3", iron: "k4" } as const)[asset]]),
  );
  if (![a, b, c, multiplier].every(Number.isFinite) || multiplier <= 0)
    throw new GameError(errors.invalid, "city_progression");
  return BigInt(
    cityInteger(
      Math.max(
        1,
        Math.trunc(a * Math.pow(Math.fround(Math.fround(Number(amount)) * multiplier), b) + c),
      ),
    ),
  );
}
export function progressionActivityData(value: unknown): ProgressionActivityData | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "object" || Array.isArray(value))
    throw new GameError(errors.invalid, "city_progression");
  const data = value as ProgressionActivityData;
  if (
    data.schema !== 1 ||
    !["upgrade", "destroy", "research", "train", "heal", "fort"].includes(data.kind) ||
    !data.costs ||
    !data.items ||
    JSON.stringify(data).length > 65536
  )
    throw new GameError(errors.invalid, "city_progression");
  if (data.target) {
    cityInteger(data.target.level, 0, 30);
    cityInteger(data.target.star);
    cityInteger(data.target.progress, 0, 99);
  }
  for (const [asset, cost] of Object.entries(data.costs)) {
    if (![...cityAssets, "woodbind", "stonebind", "ironbind", "foodbind"].includes(asset))
      throw new GameError(errors.invalid, "city_progression");
    cityAmount(cost);
  }
  for (const [itemId, count] of Object.entries(data.items)) {
    if (!/^\d+$/.test(itemId)) throw new GameError(errors.invalid, "city_progression");
    cityInteger(count, 1);
  }
  for (const [id, count] of Object.entries(data.units ?? {})) {
    if (!/^\d+$/.test(id)) throw new GameError(errors.invalid, "city_progression");
    cityInteger(count, 1);
  }
  return data;
}
export function cityUnlockCount(state: CityProgressionState, rules: Rules, type: number): bigint {
  if (type === 0) return 0n;
  if (type === 1) return BigInt(state.tasks.filter((row) => num(row, "state") === 2).length);
  if (type === 2)
    return state.achievements
      .filter(
        (row) =>
          rules.profile.achievements?.findLast((rule) => rule.id === text(row, "id"))?.aim === "9",
      )
      .reduce((max, row) => (long(row, "num") > max ? long(row, "num") : max), 0n);
  if (type === 3) return BigInt(num(state.profile, "level"));
  if (type === 4)
    return state.sciences.reduce(
      (sum, row) =>
        sum +
        cityAmount(
          rules.power.sciences?.get(String(num(row, "itemId") + num(row, "level")))?.power ?? 0,
        ),
      0n,
    );
  if (type === 5)
    return BigInt(
      state.equipment.filter((row) => {
        const rule = rules.power.equipment?.get(text(row, "itemId"));
        return (
          rule !== undefined && cityInteger(rule.color ?? 0) >= 5 && Object.hasOwn(rule, "suit_id")
        );
      }).length,
    );
  if (type === 6)
    return state.armies.reduce(
      (sum, row) =>
        sum +
        ["free", "defence", "march", "pve"].reduce(
          (total, field) => total + BigInt(num(row, field)),
          0n,
        ),
      0n,
    );
  if (type === 7) return long(state.statistics, "attacksWin");
  if (type === 8) return long(state.statistics, "armyCure");
  if (type === 9) return long(state.statistics, "armyKill");
  if (type === 10) return long(state.glory, "expeditionVictoryTimes");
  if (type >= 400000)
    return BigInt(
      Math.max(0, ...state.buildings.filter((row) => num(row, "itemId") === type).map(cityLevel)),
    );
  throw new GameError(errors.invalid, "city_progression");
}
