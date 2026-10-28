import { z } from "zod";
import { field, responseValueSchema } from "./response";
import type { SeasonalExchangeResponse } from "@opencok/contracts/responses/seasonal-exchange";

export const seasonalExchangeSchema = z.strictObject({
    level: field.int,
    refreshTime: field.long,
    flushTimes: field.int,
    rewards: z
        .array(
            z.strictObject({
                rewardId: field.string,
                level: field.int,
                needNum: field.int,
                color: field.int,
                reward: z.array(responseValueSchema),
            }),
        )
        .length(5),
    receiveLevels: field.string,
}) satisfies z.ZodType<SeasonalExchangeResponse>;
