import { z } from "zod";
import type { CastleLevelStateResponse } from "@opencok/contracts/responses/castle-level-event";
import { field } from "./response";

export const castleLevelStateSchema = z.strictObject({
    uid: field.string,
    level: field.int,
    lvReward: field.int,
    share_reward: z.array(field.int).length(7),
}) satisfies z.ZodType<CastleLevelStateResponse>;
