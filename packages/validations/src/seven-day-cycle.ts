import { z } from "zod";
import type { SevenDayCycleResponse } from "@opencok/contracts/responses/seven-day-cycle";
import { field } from "@opencok/messages/validations/response";

export const sevenDayCycleSchema = z.strictObject({
    countdown: field.int,
    curstage: field.int,
    receive_reward: field.string,
    can_receive_reward: field.string,
    resettime: field.int,
}) satisfies z.ZodType<SevenDayCycleResponse>;
