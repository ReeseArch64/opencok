import { DependencyError } from "@opencok/errors/dependency";

type Command = (name: string, ...args: string[]) => Promise<unknown>;

const script = `local length = redis.call('LLEN', KEYS[1])
local first = tonumber(ARGV[1])
local last = tonumber(ARGV[2])
if first < 0 then first = length + first end
if last < 0 then last = length + last end
if first < 0 then first = 0 end
if last >= length then last = length - 1 end
if first >= length or last < first then return {} end
if last - first + 1 > 4096 then return redis.error_reply('world bulletin page exceeds bound') end
local rows = redis.call('LRANGE', KEYS[1], first, last)
local bytes = 0
for _, row in ipairs(rows) do
  bytes = bytes + string.len(row)
  if string.len(row) > 32767 or bytes > 1048576 then return redis.error_reply('world bulletin byte bound exceeded') end
end
return rows`;

export async function loadWorldFightBulletins(
    command: Command,
    kingdomId: number,
    alliance: string,
    start: number,
    end: number,
): Promise<readonly string[]>
{
    if (
        !Number.isInteger(kingdomId)
        || kingdomId < 1
        || kingdomId > 2147483647
        || !alliance
        || alliance.length > 40
        || alliance.includes("\0")
        || !alliance.isWellFormed()
        || [start, end].some(
            (value) => !Number.isInteger(value) || value < -2147483648 || value > 2147483647,
        )
    )
    {
        throw new DependencyError("world bulletin identity");
    }

    const result = await command(
        "EVAL",
        script,
        "1",
        `WORLD_BATTLE_BULLETIN_${kingdomId}${alliance}`,
        String(start),
        String(end),
    );

    if (
        !Array.isArray(result)
        || result.length > 4096
        || result.some((value) => typeof value !== "string")
    )
    {
        throw new DependencyError("world bulletin archive");
    }

    return result;
}
