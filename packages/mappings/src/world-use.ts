import { sfs, type Fields } from "@opencok/messages/sfs";
import type { WorldUseResponse } from "@opencok/contracts/responses/world-use";

export function worldItemUsed(response: WorldUseResponse): Fields
{
    return { pointId: sfs.int(response.pointId), itemid: sfs.string(response.itemid) };
}
