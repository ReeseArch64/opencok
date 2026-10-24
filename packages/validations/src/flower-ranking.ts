import { z } from "zod";
import type { FlowerRankingDto, FlowerRankingMemberDto } from "@opencok/dtos/flower-ranking";
import { field, dtoFieldsSchema } from "./dto.ts";
export const flowerRankingMemberSchema = z.strictObject({
  uid: field.string,
  name: field.string,
  pic: field.string,
  picVer: field.int,
  picfraId: field.int,
  flowerVal: field.int,
}) satisfies z.ZodType<FlowerRankingMemberDto>;
export const flowerRankingSchema = z.strictObject({
  selfRanking: field.int,
  flowerRanking: z.array(flowerRankingMemberSchema).max(32767),
  refreshTime: field.long,
  rankGlobal: z.array(dtoFieldsSchema).max(32767).optional(),
  myGRank: field.int.optional(),
  myHide: field.int.optional(),
}) satisfies z.ZodType<FlowerRankingDto>;
