import { z } from "zod";
import type { RewardPreviewResponse } from "@opencok/contracts/responses/rewards";
import { field } from "./response.ts";

export const rewardPreviewArraySchema = z
    .array(
        z.strictObject({
            type: field.int,
            value: z.union([
                field.int,
                z.strictObject({ id: field.string, num: field.int }),
                z.strictObject({ isCurrentCivilization: field.bool, value: field.int }),
            ]),
        }),
    )
    .max(32767) satisfies z.ZodType<RewardPreviewResponse[]>;
