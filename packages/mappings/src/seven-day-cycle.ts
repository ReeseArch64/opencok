import { sfs, type Fields } from "@opencok/messages/sfs";
import type { SevenDayCycleResponse } from "@opencok/contracts/responses/seven-day-cycle";
import { sevenDayCycleSchema } from "@opencok/validations/seven-day-cycle";
import { validateFields } from "@opencok/messages/validations/fields";

export function sevenDayCycleView(row: SevenDayCycleResponse): Fields
{
    return validateFields(sevenDayCycleSchema, {
        countdown: sfs.int(row.countdown),
        curstage: sfs.int(row.curstage),
        receive_reward: sfs.string(row.receive_reward),
        can_receive_reward: sfs.string(row.can_receive_reward),
        resettime: sfs.int(row.resettime),
    });
}
