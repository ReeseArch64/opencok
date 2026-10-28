import { sfs, type Fields } from "@opencok/messages/sfs";
import type { WorldRecreationResponse } from "@opencok/contracts/responses/world-recreation";

export function worldCityRecreated(response: WorldRecreationResponse): Fields
{
    return {
        srcPoint: sfs.int(response.srcPoint),
        dstPoint: sfs.int(response.dstPoint),
        point: sfs.int(response.point),
        cityDefValue: sfs.int(response.cityDefValue),
        lastCityDefTime: sfs.long(response.lastCityDefTime),
    };
}
