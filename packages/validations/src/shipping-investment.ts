import { z } from "zod";
import type { ShippingInvestmentResponse } from "@opencok/contracts/responses/shipping-investment";
import { field, responseRecord } from "./response";

export const shippingInvestmentSchema = z.strictObject({
  count: field.int,
  sum_count: field.int,
  gold: field.int,
  gold_reward: responseRecord(field.string, field.string).optional(),
}) satisfies z.ZodType<ShippingInvestmentResponse>;
