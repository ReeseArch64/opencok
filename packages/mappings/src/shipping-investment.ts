import { javaHashMapOrder } from "@opencok/rules/java-hash-map-order";
import type { ShippingInvestmentResponse } from "@opencok/contracts/responses/shipping-investment";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { shippingInvestmentSchema } from "@opencok/validations/shipping-investment";
import { validateFields } from "@opencok/messages/validations/fields";

export function shippingInvestmentView(row: ShippingInvestmentResponse): Fields
{
    return validateFields(shippingInvestmentSchema, {
        ...(row.gold_reward
            ? {
                gold_reward: sfs.object(
                    Object.fromEntries(
                        javaHashMapOrder(Object.keys(row.gold_reward)).map((key) => [
                            key,
                            sfs.string(row.gold_reward![key]!),
                        ]),
                    ),
                ),
            }
            : {}),
        count: sfs.int(row.count),
        sum_count: sfs.int(row.sum_count),
        gold: sfs.int(row.gold),
    });
}
