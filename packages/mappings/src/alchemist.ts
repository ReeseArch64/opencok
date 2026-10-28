import { num, long, type Row } from "@opencok/contracts/rows";
import { sfs, type Fields } from "@opencok/messages/sfs";
import type { Rule } from "@opencok/rules/game";
import { cityInteger } from "@opencok/rules/city-progression";
import { alchemistInfoSchema } from "@opencok/validations/alchemist";
import { validateFields } from "./validation";

export function alchemistInfo(row: Row, rule: Rule): Fields
{
    return validateFields(alchemistInfoSchema, {
        listen: sfs.int(num(row, "listen")),
        listentime: sfs.long(long(row, "listentime")),
        share: sfs.int(num(row, "share")),
        sharetime: sfs.long(long(row, "sharetime")),
        reward: sfs.int(num(row, "reward")),
        rewardtime: sfs.long(long(row, "rewardtime")),
        reward_total_times: sfs.int(cityInteger(rule.k1)),
        interval: sfs.int(cityInteger(rule.k3)),
        initdelay: sfs.int(cityInteger(rule.k2)),
    });
}
