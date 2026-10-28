import { sfs, type Value } from "@opencok/messages/sfs";
import { groupBuySchema } from "@opencok/validations/groupbuy";
import { validateFields } from "./validation";
import type { GroupBuyResponse } from "@opencok/contracts/responses/groupbuy";

export function groupBuyInfo(
    input: Omit<GroupBuyResponse, "rewardArr"> & {
        rewardArr: readonly { level: number; reward: Value; rewardId: string; }[];
    },
)
{
    return validateFields(groupBuySchema, {
        rewardArr: sfs.array(
            input.rewardArr.map((tier) =>
                sfs.object({
                    level: sfs.int(tier.level),
                    reward: tier.reward,
                    rewardId: sfs.string(tier.rewardId),
                })
            ),
        ),
        buyMax: sfs.int(input.buyMax),
        exchangeArr: sfs.array(
            input.exchangeArr.map((product) =>
                sfs.object({
                    exchangeId: sfs.string(product.exchangeId),
                    product_id: sfs.string(product.product_id),
                    dollar: sfs.string(product.dollar),
                    exchangePoint: sfs.int(product.exchangePoint),
                })
            ),
        ),
        totalBuy: sfs.int(input.totalBuy),
        buyArr: sfs.array(
            input.buyArr.map((row) =>
                sfs.object({
                    name: sfs.string(row.name),
                    uid: sfs.string(row.uid),
                    point: sfs.int(row.point),
                    time: sfs.long(row.time),
                })
            ),
        ),
        userPoint: sfs.int(input.userPoint),
        canBuy: sfs.bool(input.canBuy),
        ...(input.buyCode ? { buyCode: sfs.string(input.buyCode) } : {}),
        sTime: sfs.long(input.sTime),
        eTime: sfs.long(input.eTime),
        cTime: sfs.long(input.cTime),
    });
}
