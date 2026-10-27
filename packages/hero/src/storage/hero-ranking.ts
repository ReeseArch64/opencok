import type {
  HeroRankingLookup,
  HeroHistoryPublication,
} from "@opencok/hero/contracts/hero-ranking";
import { DependencyError } from "@opencok/errors/dependency";

const lookup = `local rank = 0
for _, key in ipairs(KEYS) do
  local position = redis.call('ZRANK', key, ARGV[1])
  if position and position <= 5000 then rank = position + 1 end
end
return rank`;

export async function loadHeroRankingPosition(
  command: (name: string, ...args: string[]) => Promise<unknown>,
  query: HeroRankingLookup,
): Promise<number> {
  if (
    !query.member ||
    query.member.length > 255 ||
    query.keys.length < 1 ||
    query.keys.length > 4096 ||
    query.keys.some(
      (key) =>
        !/^(HERO_PERSON_RANK|HERO_ALLIANCE_RANK|KINGDOM_PERSON_RANK|KINGDOM_ALLIANCE_RANK)_\d+_.+_-?\d+$/.test(
          key,
        ) || key.length > 400,
    )
  )
    throw new DependencyError("hero ranking input");

  const result = await command(
    "EVAL",
    lookup,
    String(query.keys.length),
    ...query.keys,
    query.member,
  );

  if (
    (typeof result !== "number" && typeof result !== "string") ||
    !/^\d+$/.test(String(result)) ||
    Number(result) > 5001
  )
    throw new DependencyError("hero ranking result");

  return Number(result);
}

export async function loadHeroHistoryPublication(
  command: (name: string, ...args: string[]) => Promise<unknown>,
  keys: readonly string[],
  alliance: boolean,
): Promise<readonly HeroHistoryPublication[]> {
  if (
    keys.length > 10 ||
    keys.some(
      (key) =>
        !/^(HERO_PERSON_RANK|HERO_ALLIANCE_RANK|KINGDOM_PERSON_RANK|KINGDOM_ALLIANCE_RANK)_\d+_.+_-?\d+$/.test(
          key,
        ) || key.length > 400,
    )
  )
    throw new DependencyError("hero history input");

  if (!keys.length) return [];

  const result = await command(
    "EVAL",
    `local result = {}
for _, key in ipairs(KEYS) do
  local members = redis.call('ZRANGE', key, 0, 9)
  local alliances = {}
  if ARGV[1] == '1' then
    for _, member in ipairs(members) do
      table.insert(alliances, redis.call('HGET', 'ALLIANCE_INFO_FOR_HERO_ACT', member))
    end
  end
  table.insert(result, {members, alliances})
end
return result`,
    String(keys.length),
    ...keys,
    alliance ? "1" : "0",
  );

  if (!Array.isArray(result) || result.length !== keys.length)
    throw new DependencyError("hero history result");

  let bytes = 0;

  return result.map((value) => {
    if (!Array.isArray(value) || value.length !== 2) throw new DependencyError("hero history row");

    const [members, alliances] = value;

    if (
      !Array.isArray(members) ||
      members.length > 10 ||
      members.some((id) => typeof id !== "string" || !id || id.length > 255) ||
      new Set(members).size !== members.length ||
      !Array.isArray(alliances) ||
      alliances.length !== (alliance ? members.length : 0)
    )
      throw new DependencyError("hero history members");

    for (const raw of alliances) {
      if (raw !== null && typeof raw !== "string")
        throw new DependencyError("hero history metadata");

      bytes += typeof raw === "string" ? new TextEncoder().encode(raw).length : 0;

      if (bytes > 1048576) throw new DependencyError("hero history size");
    }

    return { members, alliances };
  });
}

export async function publishHeroRanking(
  command: (name: string, ...args: string[]) => Promise<unknown>,
  kingdomId: number,
  rows: readonly import("@opencok/hero/contracts/hero-rank-publication").HeroRankVersionedScore[],
): Promise<void> {
  if (!rows.length) return;

  if (
    rows.length > 64 ||
    new Set(rows.map((row) => `${row.rankKey}:${row.member}`)).size !== rows.length ||
    rows.some(
      (row) =>
        row.kingdomId !== kingdomId ||
        typeof row.ownerEpoch !== "bigint" ||
        typeof row.sequence !== "bigint" ||
        typeof row.endTime !== "bigint" ||
        row.ownerEpoch <= 0n ||
        row.ownerEpoch > 9223372036854775807n ||
        row.sequence <= 0n ||
        row.sequence > 9223372036854775807n ||
        row.endTime <= 0n ||
        row.endTime > 9223372036854775807n ||
        !row.member ||
        row.member.length > 40 ||
        !Number.isInteger(row.score) ||
        row.score < -2147483648 ||
        row.score > 2147483647 ||
        !/^(HERO_PERSON_RANK|HERO_ALLIANCE_RANK|KINGDOM_PERSON_RANK|KINGDOM_ALLIANCE_RANK)_\d+_[0-9|]+_-?\d+$/.test(
          row.rankKey,
        ) ||
        row.rankKey.length > 400 ||
        (row.metadata !== null && Buffer.byteLength(row.metadata) > 8192),
    )
  )
    throw new DependencyError("hero rank publication input");

  const result = await command(
    "EVAL",
    `local function less(a,b)
  if string.len(a) ~= string.len(b) then return string.len(a) < string.len(b) end
  return a < b
end
local function older(a,b)
  if not a then return false end
  local ae,as = string.match(a,'^(%d+):(%d+)$')
  local be,bs = string.match(b,'^(%d+):(%d+)$')
  if not ae or not be then return true end
  if ae ~= be then return less(ae,be) end
  return less(as,bs)
end
local data=cjson.decode(ARGV[1])
for _,row in ipairs(data) do
  local epoch=redis.call('HGET','opencok:hero:realm-version',row.realm)
  if not epoch or not less(row.epoch,epoch) then
    redis.call('HSET','opencok:hero:realm-version',row.realm,row.epoch)
    local version=row.epoch..':'..row.sequence
    local prior=redis.call('HGET',row.versions,row.member)
    if not prior or not older(version,prior) then
      redis.call('ZADD',row.key,-row.score,row.member)
      redis.call('ZREMRANGEBYRANK',row.key,5000,-1)
      redis.call('HSET',row.versions,row.member,version)
      redis.call('EXPIREAT',row.key,row.expires)
      redis.call('EXPIREAT',row.versions,row.expires)
      if row.metadata then
        local metadataVersion=redis.call('HGET','opencok:hero:alliance-version',row.member)
        if not metadataVersion or not older(version,metadataVersion) then
          redis.call('HSET','ALLIANCE_INFO_FOR_HERO_ACT',row.member,row.metadata)
          redis.call('HSET','opencok:hero:alliance-version',row.member,version)
        end
      end
    end
  end
end
return 1`,
    "0",
    JSON.stringify(
      rows.map((row) => ({
        realm: String(row.kingdomId),
        epoch: row.ownerEpoch.toString(),
        sequence: row.sequence.toString(),
        key: row.rankKey,
        versions: `opencok:hero:versions:${row.rankKey}`,
        member: row.member,
        score: row.score,
        metadata: row.metadata ?? false,
        expires: (row.endTime / 1000n + 864000n).toString(),
      })),
    ),
  );

  if (Number(result) !== 1) throw new DependencyError("hero rank publication result");
}
