import { z } from "zod";
import { field } from "./response";
import type { SpecialEventResponse } from "@opencok/contracts/responses/special-event";

export const specialEventSchema = z.strictObject({
    SpecialEvent_id: z.array(field.string).max(256),
    SpecialEvent_num: z.array(field.string).max(256),
}) satisfies z.ZodType<SpecialEventResponse>;
