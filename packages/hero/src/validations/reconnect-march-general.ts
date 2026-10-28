import { z } from "zod";
import { field } from "@opencok/validations/response";
import type { ReconnectMarchGeneralResponse } from "@opencok/hero/contracts/responses/reconnect-march-general";

export const reconnectMarchGeneralSchema = z.strictObject({
    userId: field.string,
    generalId: field.string,
    level: field.int,
    skillList: z.array(field.string).max(32767).optional(),
}) satisfies z.ZodType<ReconnectMarchGeneralResponse>;
