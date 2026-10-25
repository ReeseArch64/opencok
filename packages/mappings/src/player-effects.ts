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
export function talentTrees(trees: readonly Record<string, string | number | null>[]) {
  return sfs.array(
    trees.map((tree) =>
      sfs.object(
        Object.fromEntries(
          Object.entries(tree).map(([id, value]) => [
            id,
            typeof value === "number"
              ? sfs.int(value)
              : value === null
                ? sfs.null()
                : sfs.string(value),
          ]),
        ),
      ),
    ),
  );
}

export function activeSkill(row: Row): Fields {
  return {
    uuid: sfs.string(String(row.uuid ?? "")),
    ownerId: sfs.string(String(row.ownerId ?? "")),
    skillId: sfs.string(String(row.skillId ?? "")),
    startTime: sfs.long(
      long(row, "startTime") === 9223372036854775807n ? 0n : long(row, "startTime"),
    ),
    endTime: sfs.long(long(row, "endTime") === 9223372036854775807n ? 0n : long(row, "endTime")),
    stat: sfs.int(num(row, "stat")),
    actTime: sfs.long(long(row, "actTime")),
    param1: sfs.int(num(row, "param1")),
    param2: sfs.int(num(row, "param2")),
  };
}
