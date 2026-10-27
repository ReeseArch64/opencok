import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import type { Rules, Rule } from "./game";
import { cityInteger } from "./city-progression";
import { serverFeature } from "./power-context";

export function dragonFailure(): never {
  throw new GameError(errors.invalid, "city_progression");
}

export function dragonFeature(rules: Rules, key: string, now: bigint) {
  return serverFeature(rules, key, {
    kingdomId: rules.kingdomId,
    version: "12.06.0",
    now: Number(now),
  });
}

export function dragonDefinition(rules: Rules, row: Row) {
  const base = rules.power.dragonBases?.get(text(row, "itemId"));
  const levels = [...(rules.power.dragonLevels?.values() ?? [])].filter(
    (rule) => Number(rule.base_id) === num(row, "itemId") && Number(rule.level) === num(row, "lv"),
  );

  if (!base || levels.length !== 1) dragonFailure();

  return { base, level: levels[0]! };
}

export function dragonJson<T extends object>(raw: unknown, empty: T): T {
  if (raw === null || raw === undefined || raw === "" || raw === "null")
    return structuredClone(empty);

  if (typeof raw !== "string" || raw.length > 4000) dragonFailure();

  const parsed: unknown = JSON.parse(raw);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) dragonFailure();

  return { ...empty, ...parsed };
}

export function dragonFriendly(row: Row, amount: number, maximum: number, now: bigint) {
  const previous = num(row, "friendly");
  row.friendly = cityInteger(Math.max(0, Math.min(maximum, previous + amount)));

  if (previous === 0 && amount > 0) row.friendShipDecreaseTime = now;

  if (row.friendly === 0) row.friendShipDecreaseTime = 0n;
}

export function dragonDecay(
  row: Row,
  level: Rule,
  rules: Rules,
  now: bigint,
  effect: (id: number) => number,
) {
  if (num(row, "dragonState") !== 3) return;

  if (num(row, "initFriendShipFlag") === 0) {
    row.friendly = cityInteger(level.friendship);
    row.initFriendShipFlag = 1;
    row.friendShipDecreaseTime = 0n;
  }

  if (!dragonFeature(rules, "dragon_friendship", now)) {
    row.friendShipDecreaseTime = 0n;

    return;
  }

  if (long(row, "friendShipDecreaseTime") === 0n) {
    row.friendShipDecreaseTime = now;

    return;
  }

  const seconds = Math.trunc(
    Math.fround(Number(level.friendship_decrease_time)) /
      Math.fround(1 - Math.max(Math.fround(effect(485) / 100), 0)),
  );

  if (!Number.isSafeInteger(seconds) || seconds <= 0) return;

  const interval = BigInt(seconds) * 1000n,
    elapsed = now - long(row, "friendShipDecreaseTime");

  if (elapsed < 0n) dragonFailure();

  const decrease = elapsed / interval;

  if (decrease > 0n && num(row, "friendly") > 0) {
    row.friendShipDecreaseTime = now - (elapsed % interval);
    dragonFriendly(row, -Number(decrease), cityInteger(level.friendship), now);
  }
}

export function dragonPower(row: Row, rules: Rules, attackPercent = 0) {
  if (num(row, "dragonState") !== 3) return 0n;

  const { base, level } = dragonDefinition(rules, row),
    global = rules.items.get("dragon_new");
  const attack = Math.fround(
    Math.fround(Number(level.attack)) *
      Math.fround(1 + Math.max(Math.fround(attackPercent / 100), 0)),
  );
  const power =
    Math.pow(
      Math.fround(attack / Math.fround(Number(global?.k10))),
      Math.fround(Number(global?.k11)),
    ) *
      Math.fround(Number(global?.k12)) +
    Number(base.initFight);

  if (!Number.isFinite(power) || power < 0 || power > Number.MAX_SAFE_INTEGER) dragonFailure();

  return BigInt(Math.trunc(power));
}

export const emptyDragonTravel = {
  travelState: 0,
  travelType: 0,
  travelItemId: 0,
  travelStartTime: 0,
  travelEndTime: 0,
  rewardId: null as string | null,
  rewardGoods: null as string | null,
};

export type DragonTravel = typeof emptyDragonTravel;
