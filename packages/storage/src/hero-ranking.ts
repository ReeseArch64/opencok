import type { HeroRankingLookup } from "@opencok/contracts/hero-ranking";
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
