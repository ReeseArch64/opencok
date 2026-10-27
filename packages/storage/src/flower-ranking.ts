import type { FlowerRankingPublication } from "@opencok/contracts/flower-ranking";
import { DependencyError } from "@opencok/errors/dependency";

const script = `local board = redis.call('LRANGE', KEYS[1], 0, tonumber(ARGV[2]) - 1)
local own = redis.call('HGET', KEYS[2], ARGV[1])
local global = {}
for i = 3, #KEYS do
  local value = redis.call('GET', KEYS[i])
  if not value then break end
  table.insert(global, value)
end
return {board, own or '', global}`;

export async function loadFlowerRanking(
  command: (name: string, ...args: string[]) => Promise<unknown>,
  realm: number,
  uid: string,
  limit: number,
  global: boolean,
): Promise<FlowerRankingPublication> {
  if (
    !Number.isInteger(realm) ||
    realm < 1 ||
    realm > 2147483647 ||
    !uid ||
    uid.length > 40 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 32767
  )
    {throw new DependencyError("flower ranking input");}

  const keys = [
    `flower_ranking_${realm}`,
    `flower_ranking_self_${realm}`,
    ...(global ? Array.from({ length: limit }, (_, i) => `flower_global_rank_${i + 1}`) : []),
  ];
  const result = await command("EVAL", script, String(keys.length), ...keys, uid, String(limit));

  if (!Array.isArray(result) || result.length !== 3 || typeof result[1] !== "string")
    {throw new DependencyError("flower ranking snapshot");}

  let bytes = 0;
  const entries = (values: unknown): string[] => {
    if (!Array.isArray(values) || values.length > limit)
      {throw new DependencyError("flower ranking board");}

    return values.map((value) => {
      if (typeof value !== "string" || !value.isWellFormed())
        {throw new DependencyError("flower ranking value");}

      bytes += Buffer.byteLength(value);

      if (bytes > 4 * 1024 * 1024) {throw new DependencyError("flower ranking size");}

      return value;
    });
  };
  const local = entries(result[0]);
  const globalEntries = entries(result[2]);
  const end = globalEntries.findIndex((value) => /^\s*$/.test(value));
  const own = result[1];

  if (
    !/^\s*$/.test(own) &&
    (!/^[+-]?\d+$/.test(own) || BigInt(own) < -2147483648n || BigInt(own) > 2147483647n)
  )
    {throw new DependencyError("flower ranking position");}

  return {
    local,
    selfRank: /^\s*$/.test(result[1]) ? 5001 : Number(own),
    global: end < 0 ? globalEntries : globalEntries.slice(0, end),
  };
}
