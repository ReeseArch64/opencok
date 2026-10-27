import { num, text, type Row } from "@opencok/contracts/rows";
import type {
  MilitaryRankAward,
  MilitaryRankAwardKind,
} from "@opencok/contracts/military-rank-awards";
import { cityInteger } from "./city-progression";
import type { Rules } from "./game";

const maximum = 999999999.99;

export function militaryRankValue(value: unknown): number {
  if (value === null || value === undefined) {return 0;}

  const result = Number(value);

  if (!Number.isFinite(result) || result < 0 || result > maximum)
    {throw new Error("Invalid military rank balance");}

  return result;
}

export function militaryRankCents(value: unknown): bigint {
  return BigInt(Math.round(militaryRankValue(value) * 100));
}

export function militaryRankAdd(value: unknown, delta: number): number {
  const before = militaryRankValue(value);

  if (!Number.isFinite(delta) || !Number.isFinite(Math.fround(delta)))
    {throw new Error("Invalid military rank delta");}

  const result = Math.max(0, Math.fround(Math.fround(before) + Math.fround(delta)));
  militaryRankValue(result);

  return Number(result.toFixed(2));
}

export function militaryRankDefault(owner: string): Row {
  return {
    uid: owner,
    militaryScore: 0,
    honor: 0,
    rankingExp: 0,
    militaryRank: 0,
    award: "",
    lastRanking: 0,
    lastMilitaryScore: 0,
    skill: "",
    status: 1,
    lastTimeSet0Tostatus: 0n,
    awardReceived: 1,
    lastTimeReset: 0n,
    maxHonorWeekly: 0,
    lastRewardTime: 0n,
  };
}

export function militaryRankHonorCap(rules: Rules, row: Row): number {
  const rank = num(row, "militaryRank"),
    rule = rules.profile.militaryRanks?.get(String(rank));

  if (!rule) {throw new Error("Unknown military rank");}

  const level = cityInteger(rule.level, 1),
    entries = (rules.items.get("wr_info")?.k13 ?? "").split("|");

  if (!entries.length || entries.length > 256) {throw new Error("Invalid military honor caps");}

  const caps = new Map<number, number>();

  for (const entry of entries) {
    const parts = entry.split(":");

    if (parts.length !== 2) {throw new Error("Invalid military honor cap");}

    const index = cityInteger(parts[0], 1),
      value = militaryRankValue(parts[1]);

    if (value <= 0 || caps.has(index)) {throw new Error("Invalid military honor cap level");}

    caps.set(index, Math.fround(value));
  }

  const cap = caps.get(level);

  if (cap === undefined) {throw new Error("Missing military honor cap level");}

  return cap;
}

export function militaryRankGrant(row: Row, award: MilitaryRankAward, honorCap: number) {
  const amount = cityInteger(award.amount, 1),
    result = { ...row };

  if (award.kind === "military") {result.militaryScore = militaryRankAdd(row.militaryScore, amount);}
  else if (award.kind === "milhonor") {
    if (!Number.isFinite(honorCap) || honorCap <= 0 || honorCap > maximum)
      {throw new Error("Invalid military honor ceiling");}

    const old = Math.fround(militaryRankValue(row.honor)),
      weekly = Math.fround(militaryRankValue(row.maxHonorWeekly)),
      requested = Math.fround(amount),
      newWeekly = Math.fround(weekly + requested),
      credited =
        newWeekly >= honorCap
          ? Math.max(0, Math.fround(requested - Math.fround(newWeekly - honorCap)))
          : requested;
    result.honor = militaryRankAdd(old, credited);
    result.maxHonorWeekly = Number(
      Math.max(0, newWeekly >= honorCap ? honorCap : newWeekly).toFixed(2),
    );
    militaryRankValue(result.maxHonorWeekly);
  } else {throw new Error("Unknown military award kind");}

  return result;
}

export function militaryRankAsset(kind: MilitaryRankAwardKind) {
  return kind === "military" ? "militaryScore" : "honor";
}

export function militaryRankEntitlement(value: string) {
  if (!/^[A-Za-z0-9:._-]{1,96}$/.test(value)) {throw new Error("Invalid military award entitlement");}

  return `activity-military:${value}`;
}

export function militaryRankSame(left: Row, right: Row) {
  const keys = [...new Set([...Object.keys(left), ...Object.keys(right)])];

  return keys.every((key) => text(left, key) === text(right, key));
}
