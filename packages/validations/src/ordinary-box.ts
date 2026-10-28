import { z } from "zod";
import type { OrdinaryBoxPreviewResponse } from "@opencok/contracts/responses/ordinary-box";
import { field } from "@opencok/messages/validations/response";

export const ordinaryBoxPreviewSchema = z.strictObject({
    reward_info: z.array(z.strictObject({ id: field.string, num: field.string })).max(128),
    baodi_num: field.int,
    special: field.int,
    para5: field.int.optional(),
}) satisfies z.ZodType<OrdinaryBoxPreviewResponse>;
