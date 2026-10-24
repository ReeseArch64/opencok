import { z } from "zod";
import type {
  ThroneRankingEntryDto,
  ThroneRankingBoardDto,
  ThroneRankingDto,
} from "@opencok/dtos/throne-ranking";
import { field } from "./dto.ts";

export const throneRankingEntrySchema = z.strictObject({
  uid: field.string,
  rank: field.int,
  killCount: field.long,
  deadCount: field.long,
  name: field.string,
  allianceName: field.string,
  serverId: field.int,
  abbr: field.string,
  kingdomName: field.string,
}) satisfies z.ZodType<ThroneRankingEntryDto>;
export const throneRankingBoardSchema = z.strictObject({
  list: z.array(throneRankingEntrySchema).max(19),
  selfRank: field.int,
  serverId: field.int,
}) satisfies z.ZodType<ThroneRankingBoardDto>;
export const throneRankingSchema = z.strictObject({
  rank: z.array(throneRankingBoardSchema).max(2),
}) satisfies z.ZodType<ThroneRankingDto>;
