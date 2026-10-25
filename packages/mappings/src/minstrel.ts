import { num, long, type Row } from "@opencok/contracts/rows";
import { sfs, type Fields } from "@opencok/messages/sfs";
import type { Rule } from "@opencok/rules/game";
import { cityInteger } from "@opencok/rules/city-progression";

export function minstrelInfo(row: Row, rule: Rule): Fields {
  return {
    listen: sfs.int(num(row, "listen")),
    listentime: sfs.long(long(row, "listentime")),
    share: sfs.int(num(row, "share")),
    sharetime: sfs.long(long(row, "sharetime")),
    reward: sfs.int(num(row, "reward")),
    rewardtime: sfs.long(long(row, "rewardtime")),
    listen_total_times: sfs.int(cityInteger(rule.k5)),
    share_total_times: sfs.int(cityInteger(rule.k7)),
    reward_total_times: sfs.int(cityInteger(rule.k1)),
    interval: sfs.int(cityInteger(rule.k3)),
    initdelay: sfs.int(cityInteger(rule.k2)),
  };
}
