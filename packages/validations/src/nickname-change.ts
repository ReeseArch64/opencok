import { z } from "zod";
import type {
  NicknameItemDeleteDto,
  NicknameItemAddDto,
  NicknameMobileGoldDto,
  NicknameDmmGoldDto,
  NicknameChangeReplyDto,
} from "@opencok/dtos/nickname-change";
import { field } from "./dto.ts";

export const nicknameItemDeleteSchema = z.strictObject({
  uuid: field.string,
  itemId: field.string,
  count: field.int,
}) satisfies z.ZodType<NicknameItemDeleteDto>;
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
}) satisfies z.ZodType<NicknameItemAddDto>;
export const nicknameMobileGoldSchema = z.strictObject({
  freeGold: field.long,
  paidGold: field.long,
  paidSpecialGold: field.long,
}) satisfies z.ZodType<NicknameMobileGoldDto>;
export const nicknameDmmGoldSchema = z.strictObject({
  dmmGold: field.long,
  dmmPaidGold: field.long,
  dmmPaidSpecialGold: field.long,
}) satisfies z.ZodType<NicknameDmmGoldDto>;
export const nicknameChangeReplySchema = z.strictObject({
  gold: field.long.optional(),
  status: field.bool,
}) satisfies z.ZodType<NicknameChangeReplyDto>;
