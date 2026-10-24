import { z } from "zod";
import type { MilitaryRankingDto, MilitaryRankingEntryDto } from "@opencok/dtos/military-ranking";
import { field } from "./dto.ts";
export const militaryRankingEntrySchema = z.strictObject({
  serverId: field.string,
  uid: field.string,
  serverName: field.string,
  name: field.string,
  pic: field.string,
  abbr: field.string,
  militaryScore: field.int.optional(),
  rankingExp: field.int.optional(),
  militaryRank: field.int.optional(),
  ranking: field.int,
}) satisfies z.ZodType<MilitaryRankingEntryDto>;
export const militaryRankingSchema = z.strictObject({
  playerArr: z.array(militaryRankingEntrySchema).max(151),
  selfRanking: field.int,
}) satisfies z.ZodType<MilitaryRankingDto>;
