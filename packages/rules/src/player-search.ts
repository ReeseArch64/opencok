import type {
  PlayerSearchQuery,
  PlayerSearchRemote,
  PlayerSearchResult,
  PlayerSearchEntry,
} from "@opencok/contracts/player-search";
import type { Row } from "@opencok/contracts/rows";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { Rules } from "./game.ts";
import { javaDecimal } from "./java-integer.ts";
import { hashOrder } from "./power-hash-order.ts";
import { worldSearchName } from "./world-search.ts";
import { mailBlank } from "./mail.ts";

function invalid(): never {
  throw new GameError(errors.unsupported, "player_search");
}
function integer(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= -2147483648 &&
    value <= 2147483647
  );
}
function validate(query: PlayerSearchQuery): void {
  if (
    !worldSearchName(query.key) ||
    !integer(query.page) ||
    typeof query.cross !== "boolean" ||
    !integer(query.kingdomId) ||
    query.kingdomId < 1 ||
    !integer(query.minimumLevel) ||
    !integer(query.maximum) ||
    query.maximum < 0 ||
    query.maximum > 32766 ||
    query.limit !== query.maximum + 1
  )
    invalid();
}
export function playerSearchQuery(
  key: string,
  page: number,
  cross: boolean,
  kingdomId: number,
  rules: Rules,
): PlayerSearchQuery {
  let minimumLevel: number, maximum: number;
  try {
    minimumLevel = Number(javaDecimal(rules.items.get("lookfor")?.k1, 32));
    maximum = Number(javaDecimal(rules.items.get("lookfor")?.k2, 32));
  } catch {
    return invalid();
  }
  const query = { key, page, cross, kingdomId, minimumLevel, maximum, limit: maximum + 1 };
  validate(query);
  return Object.freeze(query);
}

export function playerSearchPage<T>(rows: readonly T[], page: number, maximumPages: number): T[] {
  if (!integer(page) || !integer(maximumPages) || maximumPages < 0 || rows.length > 32767)
    return invalid();
  if (rows.length <= 10) return [...rows];
  if (page > maximumPages) return [];
  const start = Math.imul((page - 1) | 0, 10),
    end = Math.imul(page, 10);
  if (start >= end) return [];
  if (start < 0) return invalid();
  const result: T[] = [];
  for (let index = start; index < end && index < rows.length; index++) {
    const row = rows[index];
    if (row == null) break;
    result.push(row);
  }
  return result;
}
function local(query: PlayerSearchQuery, rows: readonly Row[]): PlayerSearchEntry[] {
  validate(query);
  if (rows.length > query.limit) return invalid();
  return rows.map((data) => {
    if (
      typeof data.uid !== "string" ||
      !data.uid ||
      !integer(data.level) ||
      data.level < query.minimumLevel
    )
      return invalid();
    return { kingdomId: query.kingdomId, remote: false, data };
  });
}
export function playerSearchRemoteBudget(query: PlayerSearchQuery, rows: readonly Row[]) {
  const candidates = local(query, rows);
  if (!query.cross) return { limit: 0, minimumLevel: (query.minimumLevel - 2) | 0 };
  const seed = playerSearchPage(candidates, 1, Math.trunc(query.maximum / 10));
  const limit = (Math.imul(query.limit, 2) - seed.length) | 0;
  if (limit < 0 || limit > 32767) return invalid();
  return { limit, minimumLevel: (query.minimumLevel - 2) | 0 };
}
export function selectPlayerSearch(
  query: PlayerSearchQuery,
  rows: readonly Row[],
  remote: readonly PlayerSearchRemote[] = [],
): PlayerSearchResult {
  const candidates = local(query, rows);
  const maximumPages = Math.trunc(query.maximum / 10);
  if (!query.cross) {
    if (remote.length) return invalid();
    return {
      key: query.key,
      page: 1,
      total: BigInt(candidates.length),
      maximum: BigInt(query.maximum),
      entries: playerSearchPage(candidates, query.page, maximumPages),
    };
  }
  const budget = playerSearchRemoteBudget(query, rows);
  if (remote.length > budget.limit) return invalid();
  const combined = playerSearchPage(candidates, 1, maximumPages);
  const byKey = new Map<string, PlayerSearchRemote>();
  for (const entry of remote) {
    if (
      typeof entry.key !== "string" ||
      !entry.key ||
      entry.key.length > 255 ||
      !entry.key.isWellFormed() ||
      entry.key.includes("\0")
    )
      return invalid();
    byKey.set(entry.key, entry);
  }
  let keys: string[];
  try {
    keys = hashOrder(byKey.keys());
  } catch {
    return invalid();
  }
  for (const key of keys) {
    const entry = byKey.get(key)!;
    if (entry.data.uid == null) continue;
    if (entry.data.uid !== key || !integer(entry.kingdomId) || entry.kingdomId <= 0)
      return invalid();
    const level = entry.data.mainBuildingLevel;
    if (level == null) continue;
    if (!integer(level)) return invalid();
    if (level <= 0 || level < query.minimumLevel) continue;
    combined.push({ kingdomId: entry.kingdomId, remote: true, data: entry.data });
  }
  return {
    key: query.key,
    page: query.page,
    total: BigInt(combined.length),
    maximum: BigInt(query.maximum),
    entries: playerSearchPage(combined, query.page, maximumPages),
  };
}

export function sharedSearchProfile(row: Row, rules: Rules, now: number): Row {
  if (!Number.isSafeInteger(now) || now < 0) return invalid();
  const number = (key: string, fallback = 0) => {
    const value = row[key] ?? fallback;
    if (!integer(value)) return invalid();
    return value;
  };
  const deadline = (key: string) => {
    const value = row[key] ?? 0n;
    if (typeof value !== "bigint" || BigInt.asIntN(64, value) !== value) return invalid();
    return value;
  };
  for (const key of ["allianceId", "abbr"])
    if (row[key] != null && typeof row[key] !== "string") return invalid();
  const allianceId = row.allianceId as string | null | undefined;
  const abbr = row.abbr as string | null | undefined;
  const expiry = deadline("vipEndTime");
  let vipLevel = 0;
  if (expiry > BigInt(now)) {
    if (!rules.power.vip?.size) return invalid();
    const score = number("vipScore");
    try {
      let selected: string | undefined;
      for (const rule of rules.power.vip.values())
        if (javaDecimal(rule.point, 32) <= BigInt(score)) selected = rule.id;
      if (selected !== undefined) vipLevel = (Number(javaDecimal(selected, 32)) % 100) + 1;
    } catch {
      return invalid();
    }
  }
  return {
    ...row,
    mainBuildingLevel: number("mainBuildingLevel"),
    picVer: number("picVer"),
    picfraId: number("picfraId"),
    gmFlag: number("gmFlag"),
    crossFightSrcServerId: number("crossFightSrcServerId", -1),
    power: deadline("power"),
    vipEndTime: expiry,
    offLineTime: deadline("offLineTime"),
    vipLevel,
    svipLevel: number("svipLevel"),
    rank: mailBlank(allianceId) ? 0 : number("rank"),
    abbr: mailBlank(allianceId) || mailBlank(abbr) ? "" : abbr!,
  };
}
