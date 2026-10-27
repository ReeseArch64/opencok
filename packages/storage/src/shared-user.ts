import type { SharedUserLayout, SharedUserUpdate } from "@opencok/contracts/shared-user";
import { DependencyError } from "@opencok/errors/dependency";

export const sharedUserScript = `local function decimal(value, zero)
  if type(value) ~= 'string' or #value == 0 or #value > 19 or not string.match(value, '^%d+$') then return nil end
  if (#value > 1 and string.sub(value, 1, 1) == '0') or (not zero and value == '0') then return nil end
  if #value == 19 and value > '9223372036854775807' then return nil end
  return value
end
local function later(a, b)
  return #a > #b or (#a == #b and a > b)
end
if #KEYS ~= 4 or #ARGV ~= 5 or (ARGV[5] ~= 'hash' and ARGV[5] ~= 'keys') then return -1 end
local version = decimal(ARGV[2], false)
local timestamp = decimal(ARGV[3], true)
if not version or not timestamp or #ARGV[1] == 0 or #ARGV[4] > 65535 then return -1 end
local decoded, profile = pcall(cjson.decode, ARGV[4])
if not decoded or type(profile) ~= 'table' or profile.uid ~= ARGV[1] then return -1 end
local expected = ARGV[5] == 'hash' and 'hash' or 'string'
for index, key in ipairs(KEYS) do
  local kind = redis.call('TYPE', key).ok
  local wanted = index == 1 and expected or (index == 2 and 'hash' or 'string')
  if kind ~= 'none' and kind ~= wanted then return -1 end
end
local previous = redis.call('HGET', KEYS[2], ARGV[1])
if previous and not decimal(previous, false) then return -1 end
local previousTime = redis.call('GET', KEYS[4])
if previousTime and previousTime ~= '' and not decimal(previousTime, true) then return -1 end
if previous then
  if later(previous, version) then return 2 end
  if previous == version then
    local body = ARGV[5] == 'hash' and redis.call('HGET', KEYS[1], ARGV[1]) or redis.call('GET', KEYS[1])
    if body ~= ARGV[4] then return -1 end
    return 0
  end
end
if ARGV[5] == 'hash' then redis.call('HSET', KEYS[1], ARGV[1], ARGV[4])
else redis.call('SETEX', KEYS[1], 2592000, ARGV[4]) end
redis.call('SET', KEYS[3], timestamp)
if not previousTime or previousTime == '' or later(timestamp, previousTime) then redis.call('SET', KEYS[4], timestamp) end
redis.call('HSET', KEYS[2], ARGV[1], version)
return 1`;

type Command = (command: string, ...args: string[]) => Promise<unknown>;

function validOwner(owner: string, layout: SharedUserLayout) {
  if (
    typeof owner !== "string" ||
    !owner ||
    owner.length > 40 ||
    owner.includes("\0") ||
    !owner.isWellFormed() ||
    (layout !== "hash" && layout !== "keys")
  )
    {throw new DependencyError("shared user cache");}
}

function cacheKey(owner: string, layout: SharedUserLayout) {
  return layout === "hash" ? "cross_user_info_global" : `USER_INFO_${owner}`;
}

export async function publishSharedUser(
  command: Command,
  update: SharedUserUpdate,
  layout: SharedUserLayout = "hash",
): Promise<void> {
  validOwner(update.owner, layout);

  if (
    !Number.isInteger(update.kingdomId) ||
    update.kingdomId < 1 ||
    update.kingdomId > 2147483647 ||
    typeof update.version !== "bigint" ||
    update.version < 1n ||
    update.version > 9223372036854775807n ||
    typeof update.updatedAt !== "string" ||
    !/^(0|[1-9]\d{0,18})$/.test(update.updatedAt) ||
    BigInt(update.updatedAt) > 9223372036854775807n ||
    typeof update.body !== "string" ||
    !update.body.isWellFormed() ||
    Buffer.byteLength(update.body) > 65535
  )
    {throw new DependencyError("shared user cache");}

  try {
    const result = await command(
      "EVAL",
      sharedUserScript,
      "4",
      cacheKey(update.owner, layout),
      "opencok:shared-user:publication-version",
      `USER_LAST_UPDATE_TIME_${update.owner}`,
      `opencok:kingdom:${update.kingdomId}:player-update:${update.owner}`,
      update.owner,
      String(update.version),
      update.updatedAt,
      update.body,
      layout,
    );

    if (result !== 0 && result !== 1) {throw new Error();}
  } catch {
    throw new DependencyError("shared user cache");
  }
}

export async function loadSharedUser(
  command: Command,
  owner: string,
  layout: SharedUserLayout = "hash",
): Promise<string | null> {
  validOwner(owner, layout);

  try {
    const result =
      layout === "hash"
        ? await command("HGET", cacheKey(owner, layout), owner)
        : await command("GET", cacheKey(owner, layout));

    if (result === null) {return null;}

    if (typeof result !== "string" || !result.isWellFormed() || Buffer.byteLength(result) > 65535)
      {throw new Error();}

    return result;
  } catch {
    throw new DependencyError("shared user cache");
  }
}
