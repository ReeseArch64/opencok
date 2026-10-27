import type { Row } from "@opencok/contracts/rows";
import { long } from "@opencok/contracts/rows";
import type { NormalRechargePeriod } from "@opencok/contracts/normal-recharge";
import type { Rules } from "./game";
import { localEventControlOpen, eventTimestamp } from "./local-events";
import { serverFeature } from "./power-context";
import { cityInteger } from "./city-progression";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

export function normalRechargeFailure(): never {
  throw new GameError(errors.invalid, "city_progression");
}

function dated(startRaw: string | undefined, endRaw: string | undefined, now: bigint) {
  const start = eventTimestamp(startRaw),
    end = eventTimestamp(endRaw);

  return start !== undefined && end !== undefined && end > start && now >= start && now <= end
    ? { start, end }
    : undefined;
}

function normal(rules: Rules, now: bigint): NormalRechargePeriod | undefined {
  const control = rules.configuration.payControl?.get("69022");
  const end = dated(control?.k5, control?.k6, now),
    mid = dated(control?.k7, control?.k8, now);

  return end ? { type: 1, ...end } : mid ? { type: 3, ...mid } : undefined;
}

function mergeEnabled(rules: Rules, server: Row, now: bigint) {
  const merge = long(server, "lastMergeMillis");

  return (
    merge > 0n &&
    merge <= now &&
    serverFeature(rules, "merge_recharge_event", {
      kingdomId: rules.kingdomId,
      version: "12.06.0",
      now: Number(now),
    })
  );
}

export function normalRechargeMergeStart(rules: Rules, server: Row, now: bigint) {
  if (!mergeEnabled(rules, server, now)) {return;}

  const saved = long(server, "mergeTiredRushBeginTime");

  if (saved > 0n) {return saved;}

  const config = rules.items.get("merge_tired_rush");

  if (!config) {return;}

  const base = normal(rules, now)?.end ?? long(server, "lastMergeMillis");

  return base + BigInt(cityInteger(config.k1)) * 86400000n;
}

export function normalRechargePeriod(
  rules: Rules,
  server: Row,
  now: bigint,
  includeMycard = false,
): NormalRechargePeriod | undefined {
  if (
    !localEventControlOpen(rules, "69022", {
      kingdomId: rules.kingdomId,
      version: "12.06.0",
      now: Number(now),
    })
  )
    {return;}

  const admitted = long(server, "payTotalTime");

  if (admitted <= 0n || admitted > now) {return;}

  const begin = long(server, "mergeTiredRushBeginTime");

  if (begin > 0n && mergeEnabled(rules, server, now)) {
    const config = rules.items.get("merge_tired_rush");

    if (config) {
      const end = begin + BigInt(cityInteger(config.k2, 1)) * 86400000n;

      if (now >= begin && now <= end) {return { type: 4, start: begin, end };}
    }
  }

  const period = normal(rules, now);

  if (period || !includeMycard) {return period;}

  const config = rules.items.get("recharge_event"),
    other = dated(config?.k3, config?.k4, now);

  return other ? { type: 2, ...other } : undefined;
}

export function normalRechargeThresholds(rules: Rules, type: number) {
  const rows = [...(rules.advanced.normalRechargeThresholds?.values() ?? [])].filter(
    (row) => cityInteger(row.type, 1, 4) === type,
  );

  if (rows.length > 128) {normalRechargeFailure();}

  rows.sort((a, b) => cityInteger(a.level, 1) - cityInteger(b.level, 1));
  let node = -1n;

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index]!;

    if (cityInteger(row.level, 1) !== index + 1 || !row.Gift || !/^\d+$/.test(row.Gift))
      {normalRechargeFailure();}

    const current = normalRechargeNode(row.Node, type);

    if (current <= node) {normalRechargeFailure();}

    node = current;
  }

  return rows;
}

export function normalRechargeNode(raw: string | undefined, type: number) {
  if (type !== 2) {return BigInt(cityInteger(raw, 1));}

  const value = Number(raw),
    cents = Math.trunc(Math.fround(Math.fround(value) * Math.fround(100)));

  if (
    !Number.isFinite(value) ||
    value <= 0 ||
    !Number.isSafeInteger(cents) ||
    cents <= 0 ||
    cents > 2147483647
  )
    {normalRechargeFailure();}

  return BigInt(cents);
}
