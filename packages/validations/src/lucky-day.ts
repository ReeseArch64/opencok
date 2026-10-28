import { z } from "zod";
import type { LuckyDayResponse } from "@opencok/contracts/responses/lucky-day";
import { field } from "@opencok/messages/validations/response";

export const luckyDaySchema = z.strictObject({
    luckyeffectId: field.string,
    getEffectTimes: field.int,
    totalTimes: field.int,
    effectEndTime: field.long,
    lucky_id: field.string,
}) satisfies z.ZodType<LuckyDayResponse>;
