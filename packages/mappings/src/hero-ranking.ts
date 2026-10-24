import type { HeroSelfRanking } from "@opencok/contracts/hero-ranking";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { heroSelfRankingSchema } from "@opencok/validations/hero-ranking";
import { validateFields } from "./validation.ts";

export function heroSelfRanking(result: HeroSelfRanking): Fields {
  return validateFields(heroSelfRankingSchema, {
    eventList: sfs.array([]),
    ranking: sfs.int(result.ranking),
    rankingAlliance: sfs.int(result.rankingAlliance),
    type: sfs.int(result.type),
  });
}
