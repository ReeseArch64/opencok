import { DependencyError } from "@opencok/errors/dependency";

export async function loadScoreActivityRanking(
  command: (command: string, ...args: string[]) => Promise<unknown>,
  kingdomId: number,
): Promise<readonly string[]> {
  if (!Number.isInteger(kingdomId) || kingdomId < 1 || kingdomId > 2147483647)
    throw new DependencyError("score activity ranking realm");

  let values: unknown;

  try {
    values = await command("LRANGE", `SCORE_ACT_RANK_${kingdomId}`, "0", "-1");
  } catch {
    return [];
  }

  if (!Array.isArray(values) || values.length > 32767)
    throw new DependencyError("score activity ranking list");

  let bytes = 0;
  const result: string[] = [];

  for (const value of values) {
    if (typeof value !== "string" || !value.isWellFormed())
      throw new DependencyError("score activity ranking value");

    const size = Buffer.byteLength(value);
    bytes += size + 2;

    if (size > 32767 || bytes > 4 * 1024 * 1024)
      throw new DependencyError("score activity ranking size");

    result.push(value);
  }

  return result;
}
