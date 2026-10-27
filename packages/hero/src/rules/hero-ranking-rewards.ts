import { createHash } from "node:crypto";
import { heroEventRewards } from "./hero-event.ts";
import { cityInteger } from "@opencok/rules/city-progression";
import { num, type Row } from "@opencok/contracts/rows";
import type { Rules } from "@opencok/rules/game";

export function heroRankAwardIdentity(periodId: string, member: string, owner: string) {
  return createHash("sha256")
    .update(JSON.stringify([periodId, member, owner]))
    .digest("hex")
    .slice(0, 32);
}

export function heroRankAwardOperation(id: string) {
  return `hero-rank:${id}`;
}

export function heroRankPrize(event: Row, standing: Row, rules: Rules) {
  const type = cityInteger(event.type, 1, 4),
    level = cityInteger(standing.level, 0, 4095),
    rank = cityInteger(standing.rank, 1, 5000),
    band = heroEventRewards(event, level, rules),
    index = band.rankLevels.findIndex((limit) => rank <= limit);

  if (index >= 0)
    return {
      rewardId: band.ranking[index]!,
      template: ["", "11639", "11650", "11668", "11670"][type]!,
    };

  if ((type === 1 || type === 3) && num(standing, "rank") <= 1000)
    return { rewardId: null, template: type === 1 ? "11684" : "11685" };
}
