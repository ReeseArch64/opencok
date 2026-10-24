import { z } from "zod";
import type {
  MilitaryRankingResponse,
  MilitaryRankingEntryResponse,
} from "@opencok/contracts/responses/military-ranking";
import { field } from "./response.ts";
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
}) satisfies z.ZodType<MilitaryRankingEntryResponse>;
export const militaryRankingSchema = z.strictObject({
  playerArr: z.array(militaryRankingEntrySchema).max(151),
  selfRanking: field.int,
}) satisfies z.ZodType<MilitaryRankingResponse>;
