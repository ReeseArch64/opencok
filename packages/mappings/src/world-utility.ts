import type {
    WorldNearestPointResponse,
    WorldAlliancePointsResponse,
} from "@opencok/contracts/responses/world-utility";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { num, text } from "@opencok/contracts/rows";
import type { WorldUtilitySnapshot } from "@opencok/contracts/world-utility";

export function worldNearestPoint(response: WorldNearestPointResponse): Fields
{
    return { point: sfs.int(response.point) };
}

export function allianceWorldPoints(state: WorldUtilitySnapshot, owner: string): Fields
{
    const alliance = text(state.profile!, "allianceId");
    const leader = state.members.find((row) => num(row, "rank") === 5);
    const members = state.members.filter(
        (row) => row.uid !== owner && num(row, "rank") !== 5 && num(row, "pointId") > 0,
    );
    const response: WorldAlliancePointsResponse = {
        pointId: leader ? num(leader, "pointId") : 0,
        ...(state.territories.length
            ? {
                territoryPointId: state.territories.map((row) => ({
                    pointId: num(row, "pointId"),
                })),
            }
            : {}),
        ...(members.length
            ? {
                memberPointId: members.map((row) => ({
                    pointId: num(row, "pointId"),
                    allianceId: alliance,
                    worldId: num(row, "worldId"),
                })),
            }
            : {}),
    };

    return {
        pointId: sfs.int(response.pointId),
        ...(response.territoryPointId
            ? {
                territoryPointId: sfs.array(
                    response.territoryPointId.map((row) =>
                        sfs.object({ pointId: sfs.int(row.pointId) })
                    ),
                ),
            }
            : {}),
        ...(response.memberPointId
            ? {
                memberPointId: sfs.array(
                    response.memberPointId.map((row) =>
                        sfs.object({
                            pointId: sfs.int(row.pointId),
                            allianceId: sfs.string(row.allianceId),
                            worldId: sfs.int(row.worldId),
                        })
                    ),
                ),
            }
            : {}),
    };
}
