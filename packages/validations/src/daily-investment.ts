import { z } from "zod";
import type { DailyInvestmentResponse } from "@opencok/contracts/responses/daily-investment";
import { field } from "./response";
export const dailyInvestmentSchema = z.strictObject({
  id_table: field.int,
  id_receive: field.string,
  interval_day: field.int.optional(),
  gold: field.int.optional(),
}) satisfies z.ZodType<DailyInvestmentResponse>;
