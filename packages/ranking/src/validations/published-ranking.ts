import { z } from "zod";
import type {
    PublishedRankingResponse,
    AttributeRankingResponse,
} from "../contracts/responses/published-ranking";
import { responseFieldsSchema, field } from "@opencok/messages/validations/response";

export const publishedRankingSchema = z.strictObject({
    rankList: z.array(responseFieldsSchema).max(100),
    myRank: field.int,
    myHide: field.int,
}) satisfies z.ZodType<PublishedRankingResponse>;

export const attributeRankingSchema = z.strictObject({
    rankMap: z.array(responseFieldsSchema).max(151),
}) satisfies z.ZodType<AttributeRankingResponse>;
