import { sfs, type Fields } from "@opencok/messages/sfs";
import type { LuckyDayResponse } from "@opencok/contracts/responses/lucky-day";
import { luckyDaySchema } from "@opencok/validations/lucky-day";
import { validateFields } from "./validation";
export function luckyDayView(row: LuckyDayResponse): Fields {
  return validateFields(luckyDaySchema, {
    luckyeffectId: sfs.string(row.luckyeffectId),
    getEffectTimes: sfs.int(row.getEffectTimes),
    totalTimes: sfs.int(row.totalTimes),
    effectEndTime: sfs.long(row.effectEndTime),
    lucky_id: sfs.string(row.lucky_id),
  });
}
