import { DependencyError } from "@opencok/errors/dependency";

const script = `if redis.call('GET', KEYS[1]) ~= '0' then return {} end
local members = redis.call('ZREVRANGE', KEYS[2], 0, 150)
local rows = {}
for _, member in ipairs(members) do
  local value = redis.call('HGET', KEYS[3], member)
  if not value then return redis.error_reply('Missing ranking metadata') end
  table.insert(rows, value)
end
return rows`;

export async function loadMilitaryRanking(
  command: (name: string, ...args: string[]) => Promise<unknown>,
  type: number,
  group: number,
): Promise<string[]> {
  if (![0, 1].includes(type) || !Number.isInteger(group) || (group | 0) !== group)
    throw new DependencyError("military ranking selector");

  const prefix = type === 0 ? "score" : "exp";
  const result = await command(
    "EVAL",
    script,
    "3",
    `${prefix}RankingGroupKey_${group}`,
    `${prefix}RankingKey_${group}`,
    `${prefix}RankingUserKey_${group}`,
  );

  if (!Array.isArray(result) || result.length > 151)
    throw new DependencyError("military ranking list");

  let bytes = 0;

  return result.map((row) => {
    if (typeof row !== "string" || !row.isWellFormed())
      throw new DependencyError("military ranking row");

    bytes += Buffer.byteLength(row);

    if (bytes > 4 * 1024 * 1024) throw new DependencyError("military ranking size");

    return row;
  });
}
