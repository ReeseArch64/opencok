import { sfs, type Fields } from "@opencok/messages/sfs";
import { specialEventSchema } from "@opencok/validations/special-event";
import { cityInteger } from "@opencok/rules/city-progression";
import { validateFields } from "@opencok/messages/validations/fields";
import type { SpecialEventResponse } from "@opencok/contracts/responses/special-event";

export function specialEventInfo(counts: readonly number[]): Fields
{
    const values = counts.map((value) => String(cityInteger(value))),
        response: SpecialEventResponse = { SpecialEvent_id: values, SpecialEvent_num: values };

    return validateFields(specialEventSchema, {
        SpecialEvent_id: sfs.array(response.SpecialEvent_id.map(sfs.string)),
        SpecialEvent_num: sfs.array(response.SpecialEvent_num.map(sfs.string)),
    });
}
