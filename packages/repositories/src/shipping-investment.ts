import { eq } from "drizzle-orm";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { cityInteger } from "@opencok/rules/city-progression";
import type { ShippingInvestmentWrite } from "@opencok/contracts/shipping-investment";
import type { MutationTransaction } from "./mutation";
export async function writeShippingInvestment(
  tx: MutationTransaction,
  owner: string,
  write: ShippingInvestmentWrite,
) {
  const updated = await tx
    .update(user_mixed_info)
    .set({
      shippingTradeInvest: cityInteger(write.count),
      shippingTradeInvestGold: cityInteger(write.gold),
    })
    .where(eq(user_mixed_info.uid, owner))
    .returning({ uid: user_mixed_info.uid });
  if (updated.length !== 1) throw new Error("Missing shipping investment owner");
}
