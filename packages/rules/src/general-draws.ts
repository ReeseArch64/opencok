import type { Row } from "@opencok/contracts/rows";
import { num, long } from "@opencok/contracts/rows";
import type { Rules } from "./game";
import { cityInteger } from "./city-progression";
import { ruleTime } from "./availability";
import { generalFailure } from "./general-progression";

export function generalDrawPeriod(rules: Rules, now: bigint) {
  const panel = rules.power.activityPanels?.get("57153");

  if (!panel?.start || !panel.end) generalFailure();

  const start = ruleTime(panel.start),
    end = ruleTime(panel.end);

  if (end <= start) generalFailure();

  return { start, end, open: now >= start && now <= end };
}

export function generalDrawScore(rules: Rules, row: Row) {
  const config = rules.items.get("golden_opentime");

  return cityInteger(
    cityInteger(num(row, "normal_total")) * cityInteger(config?.k11) +
      cityInteger(num(row, "silver_total")) * cityInteger(config?.k12) +
      cityInteger(num(row, "gold_total")) * cityInteger(config?.k13),
  );
}

export function generalDrawState(
  rules: Rules,
  previous: Row | undefined,
  owner: string,
  now: bigint,
): Row {
  const period = generalDrawPeriod(rules, now),
    config = rules.items.get("golden_opentime");
  let row: Row = { uid: owner, ...previous };
  const latest = [
    "normal_last_free_millis",
    "silver_last_free_millis",
    "silver_last_add_millis",
    "gold_last_add_millis",
    "last_normal_wheel_millis",
  ].reduce((max, key) => (long(row, key) > max ? long(row, key) : max), 0n);

  if (!previous || (period.open && latest < period.start))
    row = {
      uid: owner,
      hide_king: num(previous ?? {}, "hide_king"),
      normal_free: 1,
      normal_total: 0,
      silver_usable: 0,
      silver_usable_free: 1,
      silver_daily: 0,
      silver_total: 0,
      gold_daily: 0,
      gold_usable: 0,
      gold_total: 0,
      normal_last_free_millis: now,
      silver_last_free_millis: now,
      silver_last_add_millis: 0n,
      gold_last_add_millis: 0n,
      last_normal_wheel_millis: 0n,
      rewardFlags: "",
    };

  if (period.open) {
    for (const [count, at, minutes] of [
      ["normal_free", "normal_last_free_millis", config?.k7],
      ["silver_usable_free", "silver_last_free_millis", config?.k8],
    ] as const)
      if (
        num(row, count) === 0 &&
        now - long(row, at) >= BigInt(cityInteger(minutes, 1)) * 60000n
      ) {
        row[count] = 1;
        row[at] = now;
      }

    for (const prefix of ["silver", "gold"])
      if (long(row, `${prefix}_last_add_millis`) / 86400000n !== now / 86400000n) {
        row[`${prefix}_daily`] = 0;
        row[`${prefix}_last_add_millis`] = 0n;
      }
  }

  return row;
}

export function generalDrawPurchase(
  rules: Rules,
  row: Row,
  type: number,
  count: number,
  price: number,
  now: bigint,
) {
  cityInteger(type, 0, 2);
  cityInteger(count, 1, 1000);
  cityInteger(price, 1);
  const config = rules.items.get("golden_opentime"),
    next = { ...row };
  const free =
    type === 0
      ? Math.min(count, num(row, "normal_free"))
      : type === 1
        ? Math.min(count, num(row, "silver_usable_free"))
        : 0;
  const paid = count - free;

  if (
    (type === 1 && num(row, "silver_usable") < paid) ||
    (type === 2 && num(row, "gold_usable") < paid)
  )
    generalFailure();

  if (type === 0) {
    const previous = num(row, "normal_total"),
      total = cityInteger(previous + count);
    next.normal_total = total;
    next.normal_free = num(row, "normal_free") - free;
    next.last_normal_wheel_millis = now;

    if (free) next.normal_last_free_millis = now;

    for (const [prefix, divisor, cap] of [
      ["silver", config?.k1, config?.k9],
      ["gold", config?.k2, config?.k10],
    ] as const) {
      const step = cityInteger(divisor, 1),
        limit = cityInteger(cap),
        added = Math.min(
          Math.max(0, limit - num(row, `${prefix}_daily`)),
          Math.floor(total / step) - Math.floor(previous / step),
        );

      if (added) {
        next[`${prefix}_daily`] = cityInteger(num(row, `${prefix}_daily`) + added);
        next[`${prefix}_usable`] = cityInteger(num(row, `${prefix}_usable`) + added);
        next[`${prefix}_last_add_millis`] = now;
      }
    }
  } else {
    const prefix = type === 1 ? "silver" : "gold";
    next[`${prefix}_usable`] = num(row, `${prefix}_usable`) - paid;
    next[`${prefix}_total`] = cityInteger(num(row, `${prefix}_total`) + count);

    if (type === 1) {
      next.silver_usable_free = num(row, "silver_usable_free") - free;

      if (free) next.silver_last_free_millis = now;
    }
  }

  const unit = count >= 10 ? Math.ceil((price * cityInteger(config?.k15, 1, 100)) / 100) : price;

  return { row: next, free, gold: BigInt(unit) * BigInt(paid) };
}
