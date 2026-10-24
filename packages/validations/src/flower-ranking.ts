import { z } from "zod";
import type {
  FlowerRankingResponse,
  FlowerRankingMemberResponse,
} from "@opencok/contracts/responses/flower-ranking";
import { field, responseFieldsSchema } from "./response.ts";
export const flowerRankingMemberSchema = z.strictObject({
  uid: field.string,
  name: field.string,
  pic: field.string,
  picVer: field.int,
  picfraId: field.int,
  flowerVal: field.int,
}) satisfies z.ZodType<FlowerRankingMemberResponse>;
export const flowerRankingSchema = z.strictObject({
  selfRanking: field.int,
  flowerRanking: z.array(flowerRankingMemberSchema).max(32767),
  refreshTime: field.long,
  rankGlobal: z.array(responseFieldsSchema).max(32767).optional(),
  myGRank: field.int.optional(),
  myHide: field.int.optional(),
}) satisfies z.ZodType<FlowerRankingResponse>;
