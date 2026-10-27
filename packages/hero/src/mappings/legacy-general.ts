import { sfs, type Fields } from "@opencok/messages/sfs";
import { num, long, type Row } from "@opencok/contracts/rows";

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
