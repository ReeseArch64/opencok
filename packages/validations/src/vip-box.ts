import { z } from "zod";
import { field, responseFieldsSchema } from "./response";
import type { VipBoxResponse } from "@opencok/contracts/responses/vip-box";

export const vipBoxNoticeSchema = z.strictObject({
  name: field.string,
  itemid: field.string,
  itemnum: field.string,
});

export const vipBoxSchema = z.strictObject({
  box_vip_list: z
    .array(
      z.strictObject({
        table_info: responseFieldsSchema,
        itemidlist: field.string,
        free: field.bool,
        stepNum: field.int,
      }),
    )
    .max(1),
  show_list: z.array(vipBoxNoticeSchema).max(50),
  vip_now_level: field.int,
}) satisfies z.ZodType<VipBoxResponse>;
