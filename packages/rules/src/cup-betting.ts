import { cityInteger, cityAmount } from "./city-progression";
import { eventTimestamp } from "./local-events";
import { javaFloat } from "./java-float";
import type { Rules } from "./game";
import type { Row } from "@opencok/contracts/rows";
export function cupCalendar(rules: Rules) {
  const rule = rules.power.activityEvents?.get("9005004"),
    start = eventTimestamp(rule?.k9),
    end = eventTimestamp(rule?.k10);
  if (!rule || start === undefined || end === undefined || start >= end) return;
  return { rule, start, end };
}
export function cupMatches(rules: Rules): Row[] {
  const calendar = cupCalendar(rules);
  if (!calendar) return [];
  const teams = (calendar.rule.k1 ?? "").split("|"),
    times = (calendar.rule.k2 ?? "").split("|"),
    odds = (calendar.rule.k3 ?? "").split("|"),
    winners = (calendar.rule.k11 ?? "").split("|");
  if (teams.length > 256 || teams.length !== times.length || teams.length !== odds.length)
    throw new Error("Invalid cup schedule");
  const rows = teams.map((value, index) => {
    const sides = value.split(";"),
      schedule = times[index]!.split(";"),
      prices = odds[index]!.split(";"),
      startBetTime = eventTimestamp(schedule[0]),
      startTime = eventTimestamp(schedule[1]);
    if (
      sides.length !== 2 ||
      sides.some((side) => !side || side.length > 45 || side.includes("|")) ||
      sides[0]!.toLowerCase() === sides[1]!.toLowerCase() ||
      schedule.length !== 2 ||
      startBetTime === undefined ||
      startTime === undefined ||
      startBetTime >= startTime ||
      prices.length !== 2
    )
      throw new Error("Invalid cup match");
    const oddsA = javaFloat(prices[0]!),
      oddsB = javaFloat(prices[1]!);
    if (!Number.isFinite(oddsA) || !Number.isFinite(oddsB) || oddsA <= 0 || oddsB <= 0)
      throw new Error("Invalid cup odds");
    const vs = sides.join("|"),
      id = `${vs}-${startTime / 1000n}`,
      candidate = winners[index],
      winner = candidate && sides.includes(candidate) ? candidate : "";
    return {
      id,
      vs,
      idx: index,
      winner,
      startBetTime,
      startTime,
      ended: 0,
      betNumA: 0n,
      betNumB: 0n,
      oddsA,
      oddsB,
    };
  });
  if (new Set(rows.map((row) => row.id)).size !== rows.length)
    throw new Error("Duplicate cup match");
  return rows;
}
export function cupLimits(rules: Rules, type: number) {
  const config = cupCalendar(rules)?.rule;
  if (!config) throw new Error("Missing cup limits");
  const types = (config.k6 ?? "").split(";").map((value) => cityInteger(value, 0, 3)),
    caps = (config.k7 ?? "").split(";").map((value) => cityAmount(value)),
    index = types.indexOf(type);
  if (types.length !== caps.length || new Set(types).size !== types.length || index < 0)
    throw new Error("Invalid cup resource");
  return {
    count: cityInteger(config.k5, 1, 128),
    cap: caps[index]!,
    threshold: cityAmount(config.k4),
    reward: config.k8!,
  };
}
export function cupPayout(amount: number, odds: number) {
  cityInteger(amount, 1);
  if (Number.isNaN(odds) || odds <= 0) throw new Error("Invalid cup receipt odds");
  return BigInt(
    Math.min(2147483647, Math.ceil(Math.fround(Math.fround(amount) * Math.fround(odds)))),
  );
}

export function reconcileCupMatches(
  current: readonly Row[],
  definitions: readonly Row[],
  now: bigint,
) {
  const rows = new Map(current.map((row) => [String(row.id), { ...row }]));
  for (const definition of definitions) {
    const id = String(definition.id),
      existing = rows.get(id),
      row: Row = existing ?? { ...definition, winner: "" };
    if (Number(row.ended) !== 1 && definition.winner && now >= BigInt(String(row.startTime))) {
      row.winner = definition.winner;
      row.ended = 1;
    }
    rows.set(id, row);
  }
  return [...rows.values()];
}
export function cupOddsString(input: number) {
  const value = Math.fround(input);
  if (value === Infinity) return "Infinity";
  if (!Number.isFinite(value) || value <= 0) throw new Error("Invalid cup float");
  let precision = 1;
  while (precision < 9 && Math.fround(Number(value.toPrecision(precision))) !== value) precision++;
  if (value >= 1e7 || value < 1e-3) {
    const [mantissa, exponent] = value.toExponential(precision - 1).split("e");
    return `${mantissa!.includes(".") ? mantissa : mantissa + ".0"}E${Number(exponent)}`;
  }
  const raw = String(Number(value.toPrecision(precision)));
  return raw.includes(".") ? raw : `${raw}.0`;
}
