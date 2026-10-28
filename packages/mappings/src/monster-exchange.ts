import { sfs, type Fields } from "@opencok/messages/sfs";
import { monsterExchangeSchema } from "@opencok/validations/monster-exchange";
import { validateFields } from "@opencok/messages/validations/fields";

export function monsterExchangeView(
    level: number,
    refresh: bigint,
    flushTimes: number,
    rewards: readonly Fields[],
    receiveLevels: string,
): Fields
{
    return validateFields(monsterExchangeSchema, {
        level: sfs.int(level),
        refreshTime: sfs.long(refresh),
        flushTimes: sfs.int(flushTimes),
        rewards: sfs.array(rewards.map(sfs.object)),
        receiveLevels: sfs.string(receiveLevels),
    });
}
