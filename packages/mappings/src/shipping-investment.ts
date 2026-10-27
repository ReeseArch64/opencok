import type { ShippingInvestmentResponse } from "@opencok/contracts/responses/shipping-investment";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { shippingInvestmentSchema } from "@opencok/validations/shipping-investment";
import { validateFields } from "./validation";
export function shippingInvestmentView(row: ShippingInvestmentResponse): Fields {
  return validateFields(shippingInvestmentSchema, {
    ...(row.gold_reward
      ? {
          gold_reward: sfs.object(
            Object.fromEntries(
              Object.entries(row.gold_reward).map(([key, value]) => [key, sfs.string(value)]),
            ),
          ),
        }
      : {}),
    count: sfs.int(row.count),
    sum_count: sfs.int(row.sum_count),
    gold: sfs.int(row.gold),
  });
}
