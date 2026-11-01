import { sfs, type Fields } from "@opencok/messages/sfs";
import { num, long, type Row } from "@opencok/contracts/rows";
import type { Rules } from "@opencok/rules/game";
import { isCosmeticStatus } from "@opencok/skins/rules/attributes";

export function vipState(row: Row): Fields
{
    return {
        vipEndTime: sfs.long(long(row, "vipEndTime")),
        score: sfs.long(num(row, "score")),
        spoint: sfs.int(num(row, "sPoint")),
        slevel: sfs.int(num(row, "sLevel")),
        switch: sfs.int(num(row, "vip_switch")),
        shop_exp: sfs.int(num(row, "shop_exp")),
        shop_level: sfs.int(num(row, "shop_level")),
    };
}

export function temporaryState(row: Row, rules?: Rules): Fields
{
    const cosmetic = isCosmeticStatus(rules?.power.statuses?.get(String(row.stateId)));

    return {
        id: sfs.int(num(row, "stateId")),
        startTime: sfs.long(long(row, "startTime")),
        endTime: sfs.long(long(row, "endTime")),
        type: sfs.int(num(row, "type")),
        type2: sfs.int(num(row, "type2")),
        ranEffId: sfs.int(cosmetic ? -1 : num(row, "ranEffId")),
        ranEffValue: sfs.int(cosmetic ? 0 : num(row, "ranEffValue")),
    };
}
