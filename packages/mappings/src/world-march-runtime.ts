import type { WorldMarchCheckResponse } from "@opencok/contracts/responses/world-march-runtime";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import { decodeWorldMarchArmy } from "@opencok/messages/world-resource-army";
import { sfs, Type, type Fields } from "@opencok/messages/sfs";

export function worldMarchDetail(
  row: Row,
  armies: readonly Row[],
  deadline: bigint,
  capacity: number,
): Fields {
  const army = row.armyInfo ? decodeWorldMarchArmy(row.armyInfo as Buffer) : null;
  const soldiers = (army?.soldiers ?? []).filter((unit) => unit.total > unit.dead);

  return {
    uuid: sfs.string(text(row, "uuid")),
    uid: sfs.string(text(row, "ownerUid")),
    name: sfs.string(text(row, "ownerName")),
    marchType: sfs.int(num(row, "type")),
    targetPointIndex: sfs.int(num(row, "targetId")),
    marchState: sfs.int(num(row, "state")),
    endStamp: sfs.long(deadline),
    startStamp: sfs.long(
      num(row, "state") === 0
        ? long(row, "marchStartTime")
        : num(row, "state") === 2
          ? long(row, "returnStartTime")
          : long(row, "arrivalTime"),
    ),
    soldiers: sfs.array(
      soldiers.map((unit) =>
        sfs.object({
          armyId: sfs.string(unit.armsId ?? ""),
          star: sfs.int(
            unit.level ?? num(armies.find((row) => row.armyId === unit.armsId) ?? {}, "level"),
          ),
          count: sfs.int(unit.total - unit.dead),
        }),
      ),
    ),
    generals: sfs.array([]),
    totalTroops: sfs.int(soldiers.reduce((sum, unit) => sum + unit.total - unit.dead, 0)),
    territoryStartTime: sfs.long(long(row, "territoryStartTime")),
    territoryUpdateTime: sfs.long(long(row, "territoryUpdateTime")),
    targetType: sfs.int(num(row, "targetType")),
    actionSpeed: { type: Type.Float, value: Math.fround(Number(row.collectSpd ?? 0)) },
    actionMax: sfs.int(capacity),
  };
}

export function worldMarchCheck(response: WorldMarchCheckResponse): Fields {
  return { needBreakShield: sfs.bool(response.needBreakShield) };
}
