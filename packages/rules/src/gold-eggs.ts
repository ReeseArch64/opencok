import { createHash } from "node:crypto";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import type {
  GoldEggsCalendar,
  GoldEggsCell,
  GoldEggsPeriod,
  GoldEggsPrize,
  GoldEggsStanding,
} from "@opencok/contracts/gold-eggs";
import { cityInteger } from "./city-progression";
import { serverFeature } from "./power-context";
import { versionAtLeast } from "./availability";
import { eventTimestamp } from "./local-events";
import { javaHashMapOrder } from "./java-hash-map-order";
import type { Rule, Rules } from "./game";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

export function goldEggsFailure(): never {
  throw new GameError(errors.invalid, "city_progression");
}

export function goldEggsEnabled(
  rules: Rules,
  now: bigint,
  global = false,
  kingdomId = rules.kingdomId,
) {
  const key = global ? "golden_egg_all_rank_open" : "golden_egg_open",
    feature = rules.features.get(key);

  return (
    !!feature?.version &&
    versionAtLeast("12.06.0", feature.version) &&
    serverFeature(rules, key, { kingdomId, version: "12.06.0", now: Number(now) })
  );
}

export function goldEggsPeriod(rules: Rules): GoldEggsPeriod | undefined {
  const panel = rules.power.activityPanels?.get("57175"),
    start = eventTimestamp(panel?.start),
    end = eventTimestamp(panel?.end);

  if (start === undefined || end === undefined || end <= start) {return;}

  return { start, end };
}

export function goldEggsPeriodId(period: GoldEggsPeriod) {
  if (period.start <= 0n || period.end <= period.start || period.end > 9223372036854775807n)
    {goldEggsFailure();}

  return createHash("sha256").update(`${period.start}:${period.end}`).digest("hex");
}

export function goldEggsPrizes(raw: string | undefined): GoldEggsPrize[] {
  if (!raw || raw.length > 4096) {goldEggsFailure();}

  const rows = raw.split("|").map((part) => {
    const [range, reward, ...rest] = part.split(";"),
      limits = range?.split("-") ?? [];

    if (rest.length || !reward || !/^\d+$/.test(reward) || limits.length > 2) {goldEggsFailure();}

    const first = cityInteger(limits[0], 1, 150),
      last = cityInteger(limits[1] ?? limits[0], first, 150);

    return { first, last, reward };
  });

  if (
    rows.length > 150 ||
    rows.some((row, index) => index > 0 && row.first <= rows[index - 1]!.last)
  )
    {goldEggsFailure();}

  return rows;
}

export function goldEggsCalendar(rules: Rules, now: bigint): GoldEggsCalendar | undefined {
  const period = goldEggsPeriod(rules),
    prizes = rules.items.get("golden_rank");

  if (!period || !prizes || !goldEggsEnabled(rules, now)) {return;}

  return {
    ...period,
    kingdomId: rules.kingdomId,
    admitted: now >= period.start && now <= period.end,
    global: goldEggsEnabled(rules, now, true),
    localLimit: cityInteger(rules.items.get("ranking")?.k2 ?? 150, 1, 150),
    globalLimit: cityInteger(rules.items.get("ranking")?.k6 ?? 150, 1, 150),
    localPrizes: goldEggsPrizes(prizes.k2),
    globalPrizes: goldEggsPrizes(prizes.k4),
    localTemplate: String(cityInteger(prizes.k1, 1)),
    globalTemplate: String(cityInteger(prizes.k3, 1)),
  };
}

export function goldEggsCells(raw: unknown, rules: Rules): GoldEggsCell[] {
  const value = String(raw ?? "");

  if (value.length > 1024) {goldEggsFailure();}

  const cells = value
    ? value.split("|").map((part) => {
        const [id, type, state, ...rest] = part.split(";");
        const rule = rules.advanced.goldenEggs?.get(id ?? "");

        if (
          !rule ||
          rest.length ||
          !["0", "1"].includes(state ?? "") ||
          cityInteger(type) !== cityInteger(rule.type)
        )
          {goldEggsFailure();}

        return { id: id!, type: cityInteger(type), smashed: state === "1" };
      })
    : [];

  if (
    cells.length > 64 ||
    (cells.length && cells.length !== cityInteger(rules.items.get("golden_egg")?.k5, 1, 64))
  )
    {goldEggsFailure();}

  return cells;
}

export function goldEggsCellText(cells: readonly GoldEggsCell[]) {
  if (cells.length > 64) {goldEggsFailure();}

  const value = cells.map((cell) => `${cell.id};${cell.type};${cell.smashed ? 1 : 0}`).join("|");

  if (value.length > 1024) {goldEggsFailure();}

  return value;
}

export function goldEggsDraw(
  entries: readonly { value: string; weight: number }[],
  random: (maximum: number) => number,
) {
  if (
    !entries.length ||
    entries.length > 256 ||
    entries.some((row) => !Number.isSafeInteger(row.weight) || row.weight < 0)
  )
    {goldEggsFailure();}

  const total = entries.reduce((sum, row) => sum + row.weight, 0);

  if (total <= 0 || total > 2147483647) {goldEggsFailure();}

  let selected = random(total);

  if (!Number.isInteger(selected) || selected < 0 || selected >= total) {goldEggsFailure();}

  for (const row of entries) {
    if (selected < row.weight) {return row.value;}

    selected -= row.weight;
  }

  return goldEggsFailure();
}

export function goldEggsDisk(rules: Rules, random: (maximum: number) => number) {
  const config = rules.items.get("golden_egg"),
    pool = rules.advanced.goldenEggs;

  if (!config || !pool || pool.size > 256) {goldEggsFailure();}

  const entries = javaHashMapOrder([...pool.keys()]).map((id) => ({
      value: id,
      weight: cityInteger(pool.get(id)!.rate),
    })),
    count = cityInteger(config.k5, 1, 64),
    fallback = (config.k9 ?? "").split(";");

  if (!fallback.length || fallback.length > 64 || fallback.some((id) => !pool.has(id)))
    {goldEggsFailure();}

  const seen = new Map<string, number>();

  return Array.from({ length: count }, () => {
    let id = goldEggsDraw(entries, random),
      rule = pool.get(id)!;

    if (rule.max !== undefined && rule.max !== "") {
      const maximum = cityInteger(rule.max, 1, 64),
        used = seen.get(id) ?? 0;

      if (used >= maximum) {
        const pick = random(fallback.length);

        if (!Number.isInteger(pick) || pick < 0 || pick >= fallback.length) {goldEggsFailure();}

        id = fallback[pick]!;
        rule = pool.get(id)!;
      } else {seen.set(id, used + 1);}
    }

    return { id, type: cityInteger(rule.type, 0, 127), smashed: false };
  });
}

export function goldEggsMultiplier(
  rule: Rule,
  current: number,
  random: (maximum: number) => number,
) {
  const rows = (rule.status ?? "").split("|").map((part) => {
    const [value, weight, ...rest] = part.split(";");

    if (!value || rest.length) {goldEggsFailure();}

    return { value: String(cityInteger(value, 1, 10000)), weight: cityInteger(weight) };
  });

  return cityInteger(current + Number(goldEggsDraw(rows, random)), 1, 10000);
}

export function goldEggsClaims(raw: unknown, rules: Rules) {
  const value = String(raw ?? ""),
    length = goldEggsScoreRewards(rules).length;

  if (value.length > 512 || (value && !/^\d+(?:;\d+)*$/.test(value))) {goldEggsFailure();}

  const rows = value ? value.split(";").map((value) => cityInteger(value, 0, length - 1)) : [];

  if (new Set(rows).size !== rows.length) {goldEggsFailure();}

  return rows;
}

export function goldEggsScoreRewards(rules: Rules) {
  const rows = (rules.items.get("golden_egg")?.k7 ?? "").split("|").map((part) => {
    const [score, reward, ...rest] = part.split(";");

    if (rest.length || !reward || !/^\d+$/.test(reward)) {goldEggsFailure();}

    return { score: BigInt(cityInteger(score, 1)), reward };
  });

  if (
    !rows.length ||
    rows.length > 64 ||
    rows.some((row, index) => index > 0 && row.score <= rows[index - 1]!.score)
  )
    {goldEggsFailure();}

  return rows;
}

export function goldEggsFlushCost(row: Row, rules: Rules) {
  if (num(row, "flushfreetimes") > 0) {return 0;}

  const costs = (rules.items.get("golden_egg")?.k6 ?? "")
    .split(";")
    .map((raw) => cityInteger(raw, 1));

  if (!costs.length || costs.length > 128) {goldEggsFailure();}

  return costs[Math.min(cityInteger(row.flushcount ?? 0), costs.length - 1)]!;
}

export function goldEggsSort(rows: readonly GoldEggsStanding[], maximum = 150) {
  if (rows.length > 300 || maximum < 1 || maximum > 150) {goldEggsFailure();}

  return [...rows]
    .sort((a, b) =>
      a.score === b.score
        ? a.uid < b.uid
          ? -1
          : a.uid > b.uid
            ? 1
            : a.kingdomId - b.kingdomId
        : a.score > b.score
          ? -1
          : 1,
    )
    .slice(0, maximum);
}

export function goldEggsRecord(row: Row, owner: string, now: bigint) {
  if (
    text(row, "uid") !== owner ||
    long(row, "createtime") <= 0n ||
    long(row, "createtime") > now ||
    long(row, "everydaytime") > now
  )
    {goldEggsFailure();}

  for (const key of ["freetimes", "flushfreetimes", "flushcount"]) {cityInteger(row[key] ?? 0);}

  cityInteger(row.multiple ?? 1, 1, 10000);

  if (long(row, "score") < 0n) {goldEggsFailure();}
}
