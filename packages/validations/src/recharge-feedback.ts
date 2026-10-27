import { z } from "zod";
import type { RechargeFeedbackResponse } from "@opencok/contracts/responses/recharge-feedback";
import { field, responseFieldsSchema } from "./response";

export const rechargeFeedbackSchema = z.strictObject({
  daily_tab: z.array(responseFieldsSchema).max(1024),
  daily_bool: z.array(field.bool).max(1024),
}) satisfies z.ZodType<RechargeFeedbackResponse>;
