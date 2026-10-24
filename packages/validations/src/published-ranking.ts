import { z } from "zod";
import type { PublishedRankingDto, AttributeRankingDto } from "@opencok/dtos/published-ranking";
import { dtoFieldsSchema, field } from "./dto.ts";

export const publishedRankingSchema = z.strictObject({
  rankList: z.array(dtoFieldsSchema).max(100),
  myRank: field.int,
  myHide: field.int,
}) satisfies z.ZodType<PublishedRankingDto>;

export const attributeRankingSchema = z.strictObject({
  rankMap: z.array(dtoFieldsSchema).max(151),
}) satisfies z.ZodType<AttributeRankingDto>;
