import type { ThroneRankingPeriod } from "@opencok/contracts/throne-ranking";
import { DependencyError } from "@opencok/errors/dependency";

export async function loadThroneRankingPeriod(
  command: (name: string, ...args: string[]) => Promise<unknown>,
  realm: number,
): Promise<ThroneRankingPeriod | undefined> {
  if (!Number.isInteger(realm) || realm < 1 || realm > 2147483647)
    {throw new DependencyError("throne realm");}

  const values = await command("HGETALL", `fight_of_king_inf${realm}`);

  if (!Array.isArray(values) || values.length % 2 || values.length > 65534)
    {throw new DependencyError("throne publication");}

  let bytes = 0;
  let result: ThroneRankingPeriod | undefined;

  for (let i = 0; i < values.length; i += 2) {
    const key = values[i],
      info = values[i + 1];

    if (
      typeof key !== "string" ||
      !/^\d+$/.test(key) ||
      BigInt(key) > 2147483647n ||
      typeof info !== "string" ||
      !info.isWellFormed()
    )
      {throw new DependencyError("throne period");}

    bytes += Buffer.byteLength(info);

    if (bytes > 4 * 1024 * 1024 || Buffer.byteLength(info) > 8192)
      {throw new DependencyError("throne state size");}

    const index = Number(key);

    if (index > (result?.index ?? 0)) {result = { index, info };}
  }

  return result;
}
