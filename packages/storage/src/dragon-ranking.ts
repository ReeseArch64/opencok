import type { DragonRankingEntry, DragonRankingRange } from "@opencok/contracts/dragon-ranking";
import { DependencyError } from "@opencok/errors/dependency";

export async function loadDragonRanking(
  command: (command: string, ...args: string[]) => Promise<unknown>,
  ranges: readonly DragonRankingRange[],
  allianceId: string,
): Promise<readonly DragonRankingEntry[]> {
  if (!Array.isArray(ranges) || ranges.length >= 35 || typeof allianceId !== "string")
    {throw new DependencyError("dragon ranking input");}

  const result: DragonRankingEntry[] = [];
  let bytes = 0;
  const append = (json: unknown, rank: number) => {
    if (typeof json !== "string" || !json.isWellFormed())
      {throw new DependencyError("dragon ranking value");}

    const size = Buffer.byteLength(json);
    bytes += size;

    if (size > 65535 || bytes > 4 * 1024 * 1024 || result.length >= 32767)
      {throw new DependencyError("dragon ranking size");}

    result.push({ json, rank });
  };
  const read = async (name: string, ...args: string[]) => {
    try {
      return await command(name, ...args);
    } catch {
      return null;
    }
  };

  for (const range of ranges) {
    if (
      !range ||
      !Number.isInteger(range.start) ||
      (range.start | 0) !== range.start ||
      !Number.isInteger(range.end) ||
      (range.end | 0) !== range.end
    )
      {throw new DependencyError("dragon ranking range");}

    const values = await read(
      "LRANGE",
      "dragon_battle_rank_data_key",
      String(range.start),
      String(range.end),
    );

    if (values === null) {continue;}

    if (!Array.isArray(values) || values.length > 32767)
      {throw new DependencyError("dragon ranking list");}

    let rank = range.start;

    for (const value of values) {
      append(value, rank);
      rank = (rank + 1) | 0;
    }
  }

  if (allianceId !== "") {
    const raw = await read("ZREVRANK", "dragon_battle_rank_key", allianceId);

    if (raw !== null) {
      if (
        (typeof raw !== "string" && typeof raw !== "number" && typeof raw !== "bigint") ||
        (typeof raw === "number" && !Number.isSafeInteger(raw)) ||
        !/^\d+$/.test(String(raw))
      )
        {throw new DependencyError("dragon ranking position");}

      const rank = BigInt(raw);

      if (rank > 9223372036854775807n) {throw new DependencyError("dragon ranking position");}

      const value = await read("LINDEX", "dragon_battle_rank_data_key", String(rank));

      if (value !== null) {append(value, Number(BigInt.asIntN(32, rank)));}
    }
  }

  return result;
}
