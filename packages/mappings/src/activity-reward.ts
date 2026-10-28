import type { ActivityRewardAmounts } from "@opencok/contracts/responses/activity-reward";
import { activityRewardSchema } from "@opencok/validations/activity-reward";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { validateFields } from "./validation";

export function activityRewardView(
    amounts: ActivityRewardAmounts,
    goods: readonly Fields[],
    equip: readonly Fields[],
    generals: readonly Fields[],
): Fields
{
    const fields: Fields = {};

    for (const [key, value] of Object.entries(amounts))
    {
        fields[key] = key === "military"
                || key === "milhonor"
                || key === "honor"
                || key === "power"
                || key === "exp"
                || key === "expDelta"
            ? sfs.int(Number(value))
            : sfs.long(BigInt(value));
    }

    if (generals.length)
    {
        fields.general = sfs.array(generals.map(sfs.object));
    }

    if (goods.length)
    {
        fields.goods = sfs.array(goods.map(sfs.object));
    }

    if (equip.length)
    {
        fields.equip = sfs.array(equip.map(sfs.object));
    }

    return validateFields(activityRewardSchema, fields);
}
