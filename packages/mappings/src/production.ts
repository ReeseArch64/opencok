import { sfs, type Fields } from "@opencok/messages/sfs";
import type { ProductionRate } from "@opencok/contracts/timed-activity";
import { validateProductionRate } from "@opencok/rules/timed-activity";

export function encodeProductionRates(rates: readonly ProductionRate[]): string {
  if (!rates.length || rates.length > 256) throw new Error("Invalid production schedule");
  for (const rate of rates) validateProductionRate(rate);
  return JSON.stringify(
    rates.map((rate) => [String(rate.at), String(rate.perHour), String(rate.capacity)]),
  );
}
export function decodeProductionRates(value: string): readonly ProductionRate[] {
  const rows: unknown = JSON.parse(value);
  if (!Array.isArray(rows) || !rows.length || rows.length > 256)
    throw new Error("Invalid production schedule");
  return rows.map((row) => {
    if (
      !Array.isArray(row) ||
      row.length !== 3 ||
      row.some((value) => typeof value !== "string" || !/^\d{1,19}$/.test(value))
    )
      throw new Error("Invalid production rate");
    const rate = { at: BigInt(row[0]), perHour: BigInt(row[1]), capacity: BigInt(row[2]) };
    validateProductionRate(rate);
    return rate;
  });
}

export function productionBoost(
  effectTime: bigint,
  refreshTime: bigint,
  gold: bigint,
  goods?: Fields,
): Fields {
  return {
    ...(goods ? { goods: sfs.object(goods) } : { gold: sfs.long(gold) }),
    effectTime: sfs.long(effectTime),
    refreshTime: sfs.long(refreshTime),
  };
}
