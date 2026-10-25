import type { Row } from "@opencok/contracts/rows";
import type { Rules } from "./game.ts";
import { javaDecimal } from "./java-integer.ts";
import { javaHashMapOrder } from "./java-hash-map-order.ts";

const int = (value: unknown) => Number(javaDecimal(String(value ?? 0), 32));
const long = (value: unknown) => javaDecimal(String(value ?? 0), 64);
const float = Math.fround;
const cast = (value: number) =>
  Number.isNaN(value) ? 0 : Math.max(-2147483648, Math.min(2147483647, Math.trunc(value)));
const castLong = (value: number) =>
  Number.isNaN(value)
    ? 0n
    : value >= 9223372036854775808
      ? 9223372036854775807n
      : value <= -9223372036854775808
        ? -9223372036854775808n
        : BigInt(Math.trunc(value));

export function reconnectBuildingRefresh(
  buildings: readonly Row[],
  rules: Rules,
  now: bigint,
  effect: (id: 50 | 53) => number,
) {
  const index = new Map(buildings.map((row) => [String(row.uuid), row]));
  const ordered = javaHashMapOrder(index.keys()).map((id) => index.get(id)!);
  const writes: { uuid: string; refreshTime: bigint }[] = [];
  const views: { itemId: string; pos: number; refreshTime: bigint }[] = [];
  for (const item of [415000, 413000])
    for (const row of ordered) {
      const position = int(row.pos);
      if (int(row.itemId) !== item || position < 17 || position > 26) continue;
      if (int(row.level) < 1) throw new Error("Invalid tutorial resource building");
      const rule = rules.building(String(item), int(row.level), int(row.star), int(row.progress));
      const rate = float(float(float(int(rule.effects?.productionPerHour)) / 3600) / 1000);
      const modified = float(
        rate * Math.max(0, float(float(100 + effect(item === 415000 ? 53 : 50)) / 100)),
      );
      let refreshTime =
        long(row.refreshTime) <= 0n ? BigInt.asIntN(64, now - 5000n) : long(row.refreshTime);
      const elapsed = Number(BigInt.asIntN(32, now - refreshTime));
      const output = cast(float(float(elapsed) * modified));
      const threshold = cast(
        float(float(int(rule.effects?.productionCapacity ?? 4000)) * float(0.3)),
      );
      if (output < threshold) {
        refreshTime = castLong(Number(now) - threshold / modified);
        writes.push({ uuid: String(row.uuid), refreshTime });
      }
      views.push({ itemId: String(item), pos: position, refreshTime });
    }
  return { writes, views };
}
