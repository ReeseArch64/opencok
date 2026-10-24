import { z } from "zod";
import type {
  NicknameItemDeleteResponse,
  NicknameItemAddResponse,
  NicknameMobileGoldResponse,
  NicknameDmmGoldResponse,
  NicknameChangeReplyResponse,
} from "@opencok/contracts/responses/nickname-change";
import { field } from "./response.ts";

export const nicknameItemDeleteSchema = z.strictObject({
  uuid: field.string,
  itemId: field.string,
  count: field.int,
}) satisfies z.ZodType<NicknameItemDeleteResponse>;
export const nicknameItemAddSchema = z.strictObject({
  uuid: field.string,
  itemId: field.string,
  count: field.int,
  vanishTime: field.long,
  para1: field.string.optional(),
  para2: field.string.optional(),
  para3: field.string.optional(),
  para4: field.string.optional(),
  para5: field.string.optional(),
  para6: field.string.optional(),
  para7: field.string.optional(),
  para8: field.string.optional(),
  para9: field.string.optional(),
}) satisfies z.ZodType<NicknameItemAddResponse>;
export const nicknameMobileGoldSchema = z.strictObject({
  freeGold: field.long,
  paidGold: field.long,
  paidSpecialGold: field.long,
}) satisfies z.ZodType<NicknameMobileGoldResponse>;
export const nicknameDmmGoldSchema = z.strictObject({
  dmmGold: field.long,
  dmmPaidGold: field.long,
  dmmPaidSpecialGold: field.long,
}) satisfies z.ZodType<NicknameDmmGoldResponse>;
export const nicknameChangeReplySchema = z.strictObject({
  gold: field.long.optional(),
  status: field.bool,
}) satisfies z.ZodType<NicknameChangeReplyResponse>;
