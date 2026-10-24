import type { HeroRankingLookup, HeroHistoryPublication } from "@opencok/contracts/hero-ranking";
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
