import { z } from "zod";
import type { LotteryInfoResponse } from "@opencok/contracts/responses/lottery";
import { field } from "@opencok/messages/validations/response";

export const lotteryInfoSchema = z.strictObject({
    type: field.int,
    supermode: field.int,
    times1: field.int,
    times2: field.int,
    boxTimes: field.int,
    normal: field.string,
    super: field.string,
    updatetime: field.long,
    rewards: field.string.optional(),
    lotteryInfo: field.string.optional(),
}) satisfies z.ZodType<LotteryInfoResponse>;
