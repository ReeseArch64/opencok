import { z } from "zod";
import { field } from "./response";

export const activityOperatorsSchema = z.strictObject({
    activityList: z.array(z.strictObject({ id: field.int, endTime: field.long })).max(4096),
});
