import { z } from "zod";
import type { AlchemistInfoResponse } from "@opencok/contracts/responses/alchemist";
import { field } from "./response";

export const alchemistInfoSchema = z.strictObject({
    listen: field.int,
    listentime: field.long,
    share: field.int,
    sharetime: field.long,
    reward: field.int,
    rewardtime: field.long,
    reward_total_times: field.int,
    interval: field.int,
    initdelay: field.int,
}) satisfies z.ZodType<AlchemistInfoResponse>;
