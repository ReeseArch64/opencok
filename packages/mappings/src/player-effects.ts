import { sfs, type Fields } from "@opencok/messages/sfs";
import { num, long, type Row } from "@opencok/contracts/rows";

export function vipState(row: Row): Fields {
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

export function temporaryState(row: Row): Fields {
  return {
    id: sfs.int(num(row, "stateId")),
    startTime: sfs.long(long(row, "startTime")),
    endTime: sfs.long(long(row, "endTime")),
    type: sfs.int(num(row, "type")),
    type2: sfs.int(num(row, "type2")),
    ranEffId: sfs.int(num(row, "ranEffId")),
    ranEffValue: sfs.int(num(row, "ranEffValue")),
  };
}
