import { DependencyError } from "@opencok/errors/dependency";

export const playerUpdateScript = `local function decimal(value)
  if type(value) ~= 'string' or #value == 0 or #value > 19 or not string.match(value, '^%d+$') then return nil end
  value = string.gsub(value, '^0+', '')
  if value == '' then value = '0' end
  if #value == 19 and value > '9223372036854775807' then return nil end
  return value
end
local nextValue = decimal(ARGV[1])
if not nextValue or nextValue ~= ARGV[1] then return -1 end
local stored = redis.call('GET', KEYS[1])
if stored and stored ~= '' then
  local previous = decimal(stored)
  if not previous then return -1 end
  if #previous > #nextValue or (#previous == #nextValue and previous >= nextValue) then return 0 end
end
redis.call('SET', KEYS[1], nextValue)
return 1`;

export async function publishPlayerUpdate(
  command: (name: string, ...args: string[]) => Promise<unknown>,
  kingdomId: number,
  uid: string,
  updatedAt: string,
): Promise<void> {
  if (
    !Number.isInteger(kingdomId) ||
    kingdomId < 1 ||
    kingdomId > 2147483647 ||
    typeof uid !== "string" ||
    !uid ||
    uid.length > 255 ||
    !uid.isWellFormed() ||
    uid.includes("\0") ||
    typeof updatedAt !== "string" ||
    !/^(0|[1-9][0-9]{0,18})$/.test(updatedAt) ||
    BigInt(updatedAt) > 9223372036854775807n
  )
    throw new DependencyError("redis");

  try {
    const result = await command(
      "EVAL",
      playerUpdateScript,
      "1",
      `opencok:kingdom:${kingdomId}:player-update:${uid}`,
      updatedAt,
    );

    if (result !== 0 && result !== 1) throw new Error();
  } catch {
    throw new DependencyError("redis");
  }
}
