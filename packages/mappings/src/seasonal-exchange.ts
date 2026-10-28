import { sfs, type Fields } from "@opencok/messages/sfs";
import { seasonalExchangeSchema } from "@opencok/validations/seasonal-exchange";
import { validateFields } from "@opencok/messages/validations/fields";

export function seasonalExchangeView(
    level: number,
    refreshTime: bigint,
    flushTimes: number,
    rewards: readonly Fields[],
    receiveLevels: string,
): Fields
{
    return validateFields(seasonalExchangeSchema, {
        level: sfs.int(level),
        refreshTime: sfs.long(refreshTime),
        flushTimes: sfs.int(flushTimes),
        rewards: sfs.array(rewards.map((row) => sfs.object(row))),
        receiveLevels: sfs.string(receiveLevels),
    });
}
