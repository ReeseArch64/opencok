import { z } from "zod";
import { field } from "@opencok/messages/validations/response";
import type { ActivityDirectoryResponse } from "@opencok/contracts/responses/activity-directory";

export const activityDirectorySchema = z.strictObject({
    act: z
        .array(
            z.strictObject({
                t: field.int,
                opt: field.int.optional(),
                st: field.int.optional(),
                et: field.int.optional(),
            }),
        )
        .max(4096),
}) satisfies z.ZodType<ActivityDirectoryResponse>;
