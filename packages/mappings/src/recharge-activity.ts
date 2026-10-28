import { sfs, type Fields } from "@opencok/messages/sfs";
import type { RechargeActivityLoginResponse } from "@opencok/contracts/responses/recharge-activity";
import { rechargeActivityLoginSchema } from "@opencok/validations/recharge-activity";
import { validateFields } from "./validation";

export function rechargeActivityLogin(row: RechargeActivityLoginResponse): Fields
{
    return validateFields(rechargeActivityLoginSchema, {
        ...(row.new_sercum_little_time === undefined
            ? {}
            : { new_sercum_little_time: sfs.long(row.new_sercum_little_time) }),
        newSerCumRechargeTotal: sfs.long(row.newSerCumRechargeTotal),
        newSerCumVersion: sfs.string(row.newSerCumVersion),
        newSerCumServerList: sfs.string(row.newSerCumServerList),
    });
}
