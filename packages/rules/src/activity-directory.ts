import { long, num, type Row } from "@opencok/contracts/rows";
import type { ActivityDirectoryEntryResponse } from "@opencok/contracts/responses/activity-directory";

const supported = new Set([0, 1, 2, 3, 4, 5, 7, 8, 9]);

export function activityDirectoryEntries(
  rows: readonly Row[],
  now: number,
  orderIds: (ids: readonly number[]) => readonly number[],
): ActivityDirectoryEntryResponse[] {
  if (!Number.isSafeInteger(now) || now < 0 || rows.length > 4096)
    throw new Error("Invalid activity directory snapshot");

  const entries = new Map<number, ActivityDirectoryEntryResponse>();

  for (const row of rows) {
    const type = num(row, "type"),
      open = long(row, "openTime"),
      end = long(row, "endTime"),
      id = num(row, "id");

    if (!Number.isInteger(id) || id < 0 || id > 4294967295)
      throw new Error("Invalid activity directory identity");

    if (!supported.has(type) || open <= 0n || (end > 0n && end < BigInt(now))) continue;

    const entry: ActivityDirectoryEntryResponse = { t: type };

    for (const [column, field] of [
      ["openTime", "opt"],
      ["startTime", "st"],
      ["endTime", "et"],
    ] as const) {
      const value = long(row, column);

      if (value > 0n) entry[field] = Number(BigInt.asIntN(32, value / 1000n));
    }

    entries.set(id | 0, entry);
  }

  return orderIds([...entries.keys()]).map((id) => entries.get(id)!);
}
