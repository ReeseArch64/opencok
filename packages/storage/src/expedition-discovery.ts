import type { ExpeditionDiscoveryPublication } from "@opencok/contracts/expedition-score-publication";
import { DependencyError } from "@opencok/errors/dependency";

const publish = `local function valid(value)
  return type(value) == 'string' and string.match(value, '^[1-9][0-9]*$') and #value <= 19
end
local function compare(a,b)
  if #a ~= #b then return #a > #b and 1 or -1 end
  if a == b then return 0 end
  return a > b and 1 or -1
end
local old = redis.call('GET',KEYS[1])
if old then
  local ok, record = pcall(cjson.decode,old)
  if not ok or type(record) ~= 'table' or record.serverId ~= tonumber(ARGV[5]) then return -1 end
  if record.ownerEpoch ~= nil or record.sequence ~= nil then
    if not valid(record.ownerEpoch) or not valid(record.sequence) then return -1 end
    local epoch = compare(ARGV[2],record.ownerEpoch)
    if epoch < 0 or (epoch == 0 and compare(ARGV[3],record.sequence) <= 0) then return 0 end
  end
end
redis.call('SET',KEYS[1],ARGV[1])
redis.call('PEXPIREAT',KEYS[1],ARGV[4])
return 1`;

export async function publishExpeditionDiscovery(
  command: (command: string, ...args: string[]) => Promise<unknown>,
  value: ExpeditionDiscoveryPublication,
) {
  const match = value.key.match(/^opencok:global:expedition-match:([1-9]\d{0,9})$/),
    decimal = (raw: string) => /^[1-9]\d{0,18}$/.test(raw) && BigInt(raw) <= 9223372036854775807n;

  if (
    !match ||
    Number(match[1]) > 2147483647 ||
    !decimal(value.ownerEpoch) ||
    !decimal(value.sequence) ||
    !decimal(value.expiresAt) ||
    Buffer.byteLength(value.value) > 8192
  )
    {throw new DependencyError("redis");}

  let parsed;

  try {
    parsed = JSON.parse(value.value);
  } catch {
    throw new DependencyError("redis");
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    parsed.serverId !== Number(match[1]) ||
    parsed.ownerEpoch !== value.ownerEpoch ||
    parsed.sequence !== value.sequence
  )
    {throw new DependencyError("redis");}

  const result = await command(
    "EVAL",
    publish,
    "1",
    value.key,
    value.value,
    value.ownerEpoch,
    value.sequence,
    value.expiresAt,
    match[1]!,
  );

  if (result !== 0 && result !== 1) {throw new DependencyError("redis");}

  return result === 1;
}
