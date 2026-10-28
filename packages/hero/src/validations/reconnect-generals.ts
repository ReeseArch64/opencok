import { z } from "zod";
import type { ReconnectGeneralsResponse } from "@opencok/hero/contracts/responses/reconnect-generals";
import { field } from "@opencok/validations/response";
import { generalInfoSchema } from "@opencok/hero/validations/profile-generals";

export const reconnectGeneralsSchema = z.strictObject({
    userGenerals: z.array(generalInfoSchema.extend({ abilityIndex: field.int })).max(32767),
}) satisfies z.ZodType<ReconnectGeneralsResponse>;
