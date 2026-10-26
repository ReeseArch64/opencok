import { z } from "zod";
import { field } from "./response";
import { rewardPreviewArraySchema } from "./rewards";
import type { GroupBuyResponse } from "@opencok/contracts/responses/groupbuy";
export const groupBuySchema = z.strictObject({
  rewardArr: z
    .array(
      z.strictObject({
        level: field.int,
        reward: rewardPreviewArraySchema,
        rewardId: field.string,
      }),
    )
    .max(128),
  buyMax: field.int,
  exchangeArr: z
    .array(
      z.strictObject({
        exchangeId: field.string,
        product_id: field.string,
        dollar: field.string,
        exchangePoint: field.int,
      }),
    )
    .max(64),
  totalBuy: field.int,
  buyArr: z
    .array(
      z.strictObject({ name: field.string, uid: field.string, point: field.int, time: field.long }),
    )
    .max(11),
  userPoint: field.int,
  canBuy: field.bool,
  buyCode: field.string.optional(),
  sTime: field.long,
  eTime: field.long,
  cTime: field.long,
}) satisfies z.ZodType<GroupBuyResponse>;
