import { num, long, text, type Row } from "@opencok/contracts/rows";
import { sfs, type Fields } from "@opencok/messages/sfs";

export function civilizationCastleView(row: Row, profile: Row, output: number): Fields
{
    return {
        uid: sfs.string(text(row, "uid")),
        pointId: sfs.int(num(row, "pointId")),
        status: sfs.int(num(row, "status")),
        buildTime: sfs.long(long(row, "buildTime")),
        def: sfs.int(num(row, "def")),
        resourceNum: sfs.double(Number(row.resourceNum ?? 0)),
        robCount: sfs.int(num(row, "robCount")),
        beRobNum: sfs.int(num(row, "beRobNum")),
        output: sfs.double(output),
        level: sfs.int(num(row, "level") || 1),
        lastOutputTime: sfs.long(long(row, "lastOutputTime")),
        lastSettleTime: sfs.long(long(row, "lastSettleTime")),
        userName: sfs.string(text(profile, "name")),
        allianceId: sfs.string(text(profile, "allianceId")),
        ...(num(row, "status") === 2
            ? { army: sfs.array([]), defSoldierCount: sfs.int(0), aidSoldierCount: sfs.int(0) }
            : {}),
    };
}
