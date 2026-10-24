import type { MailStatusCount, MailStatusQuery, MailStatusResult } from "@opencok/contracts/mail";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

const categories: readonly (readonly number[])[] = [
  [2, 14, 11, 28, 29, 34],
  [13, 15, 16],
  [32],
  [21, 22, 20, 37, 38, 45, 46],
  [17, 25, 26, 27, 33, 10, 34, 35, 36],
  [6, 7, 8, 18, 30, 48, 9, 12, 5, 42],
  [23, 24, 39, 40],
  [43, 44],
];
const combinedCategories = new Map(
  categories.flatMap((types, index) => types.map((type) => [type, index] as const)),
);
function invalid(): never {
  throw new GameError(errors.unsupported, "mail");
}
function int(value: number): boolean {
  return Number.isInteger(value) && value >= -2147483648 && value <= 2147483647;
}

export function mailStatusQuery(category: number | undefined, now: number): MailStatusQuery {
  if ((category !== undefined && !int(category)) || !Number.isSafeInteger(now)) return invalid();
  return { category, now };
}

export function calculateMailStatus(
  query: MailStatusQuery,
  counts: readonly MailStatusCount[],
): MailStatusResult {
  if (query.category !== undefined && (query.category < 1 || query.category > 8))
    return { mode: "unknown" };
  if (counts.length > 32767) return invalid();
  const totals = Array.from({ length: 8 }, () => ({ total: 0n, unread: 0n }));
  const selected = query.category === undefined ? undefined : categories[query.category - 1]!;
  const seen = new Set<string>();
  for (const group of counts) {
    if (
      !int(group.type) ||
      !int(group.status) ||
      typeof group.allianceNotice !== "boolean" ||
      typeof group.count !== "bigint" ||
      group.count < 1n ||
      group.count > 9223372036854775807n
    )
      return invalid();
    const key = `${group.type}:${group.status}:${group.allianceNotice}`;
    if (seen.has(key)) return invalid();
    seen.add(key);
    const index = selected
      ? selected.includes(group.type)
        ? query.category! - 1
        : undefined
      : group.allianceNotice
        ? 4
        : combinedCategories.get(group.type);
    if (index === undefined) continue;
    if (group.status !== 0 && group.status !== 1) {
      if (!selected) return invalid();
      continue;
    }
    totals[index]!.total += group.count;
    if (group.status === 0) totals[index]!.unread += group.count;
  }
  if (query.category === undefined)
    return {
      mode: "all",
      categories: totals.map(({ total, unread }) => ({
        total: Number(BigInt.asIntN(32, total)),
        unread: Number(BigInt.asIntN(32, unread)),
      })),
    };
  const { total, unread } = totals[query.category - 1]!;
  return { mode: "category", total: BigInt.asIntN(64, total), unread: BigInt.asIntN(64, unread) };
}
