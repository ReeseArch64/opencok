import type { Row } from "@opencok/contracts/rows";
import type { Rules } from "./game.ts";
import { javaDecimal } from "./java-integer.ts";
import { javaHashMapOrder } from "./java-hash-map-order.ts";

const integer = (value: unknown) => Number(javaDecimal(String(value ?? 0), 32));

const long = (value: unknown) => {
  if (typeof value === "number" && !Number.isSafeInteger(value))
    {throw new Error("Invalid resource integer");}

  return javaDecimal(String(value ?? 0), 64);
};

const wrap = (value: bigint) => BigInt.asIntN(64, value);

const positive = (value: bigint) => (value > 0n ? value : 0n);

const float = Math.fround;

function floatLong(value: number): bigint {
  if (Number.isNaN(value)) {return 0n;}

  if (value >= 9223372036854775808) {return 9223372036854775807n;}

  if (value <= -9223372036854775808) {return -9223372036854775808n;}

  return BigInt(Math.trunc(value));
}

export interface FoodRates {
  ordinary: number;
  bound: number;
}

export function reconnectFoodRates(
  armies: readonly Row[],
  rules: Rules,
  effects: {
    ordinary: number;
    knight: number;
    knightByArm: ReadonlyMap<number, number>;
    consumeBound: boolean;
  },
): FoodRates {
  const indexed = new Map<string, Row>();

  for (const row of armies) {
    if (typeof row.armyId !== "string" || indexed.has(row.armyId))
      {throw new Error("Invalid upkeep army");}

    indexed.set(row.armyId, row);
  }

  const ordinaryEffect = effects.ordinary > 0 ? float(effects.ordinary) : 0;
  const knightEffect = effects.knight > 0 ? float(effects.knight) : 0;
  let ordinary = 0;
  let bound = 0;

  for (const id of javaHashMapOrder(indexed.keys())) {
    const rule = rules.arms.get(id);

    if (!rule || rule.upkeep === undefined) {continue;}

    const row = indexed.get(id)!;
    const quantity = ["free", "pve", "defence", "march"].reduce(
      (total, key) => (total + integer(row[key])) | 0,
      0,
    );
    let cost = (integer(rule.upkeep) / 86400 / 1000) * quantity;
    const type = integer(rule.new_arms);

    if (type === 0) {ordinary = float(ordinary + cost * (1 - ordinaryEffect / 100));}
    else {
      if (type === 1) {
        const arm = integer(rule.arm);
        const reduction = effects.knightByArm.get(arm) ?? 0;
        cost *=
          (1 - float(knightEffect + ordinaryEffect) / 100) *
          Math.max(0.01, float(1 - float(float(reduction) / 100)));
      }

      if (effects.consumeBound) {bound = float(bound + cost);}
      else {ordinary = float(ordinary + cost);}
    }
  }

  return { ordinary: Math.max(0, ordinary), bound: Math.max(0, bound) };
}

export interface ReconnectFoodSettlement {
  food: bigint;
  foodbind: bigint;
  lastUpdateTime: bigint;
  starvingMillis: bigint;
  foodDelta: bigint;
  boundDelta: bigint;
}

export function settleReconnectFood(
  resource: Row,
  now: bigint,
  rates: FoodRates,
  options: {
    separateBound: boolean;
    protect: boolean;
    protectedFood: number;
    consumptionRatio: number;
  },
): ReconnectFoodSettlement {
  const previous = long(resource.lastUpdateTime);
  long(now);
  let food = long(resource.food);
  let foodbind = long(resource.foodbind);
  const before = { food, foodbind };
  const elapsed = positive(wrap(now - previous));
  let ordinary = floatLong(float(float(Number(elapsed)) * float(rates.ordinary)));
  let bound = floatLong(float(float(Number(elapsed)) * float(rates.bound)));

  if (options.protect) {
    const protectedFood = integer(options.protectedFood);
    const regular = (Number(BigInt.asIntN(32, food)) - protectedFood) | 0;
    const combined = wrap(wrap(food + foodbind) - BigInt(protectedFood));
    const consumable = options.separateBound
      ? Math.max(0, regular)
      : Number(BigInt.asIntN(32, positive(combined)));

    if (BigInt(consumable) < ordinary) {ordinary = BigInt(consumable);}
  }

  ordinary = positive(ordinary);

  if (ordinary !== 0n) {
    const delta = floatLong(
      float(float(Number(wrap(-ordinary))) * float(options.consumptionRatio)),
    );
    food = wrap(food + delta);

    if (food < 0n) {
      if (!options.separateBound) {foodbind = positive(wrap(foodbind + food));}

      food = 0n;
    }
  }

  let starvingMillis = 0n;
  const total = wrap(food + foodbind);

  if (bound > 0n || total === 0n) {
    if (total === 0n) {starvingMillis = elapsed;}
    else if (bound > total) {
      starvingMillis = floatLong(float(float(Number(wrap(bound - total))) / float(rates.bound)));
      bound = total;
    }

    if (bound > 0n) {
      food = wrap(food - bound);

      if (food < 0n) {
        foodbind = positive(wrap(foodbind + food));
        food = 0n;
      }
    }
  }

  return {
    food,
    foodbind,
    lastUpdateTime: now < previous ? previous : now,
    starvingMillis: starvingMillis > elapsed ? elapsed : starvingMillis,
    foodDelta: wrap(food - before.food),
    boundDelta: wrap(foodbind - before.foodbind),
  };
}
