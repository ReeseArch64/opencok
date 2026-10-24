import type {
  WorldResourceOwnerDetail,
  WorldResourceGroupDetail,
} from "@opencok/contracts/world-resource-detail";
import { sfs, Type, type Fields } from "@opencok/messages/sfs";

export function worldResourceOwner(detail: WorldResourceOwnerDetail): Fields {
  return {
    q: sfs.int(detail.quantity),
    spd: { type: Type.Float, value: detail.speed },
    sdt: sfs.long(detail.startTime),
    tq: sfs.int(detail.remaining),
    collected: sfs.int(detail.collected),
    changeCollectSpdTime: sfs.long(detail.speedChangedAt),
    occupyEndTime: sfs.long(detail.occupyEndTime),
  };
}

export function worldResourceGroup(detail: WorldResourceGroupDetail | undefined): Fields {
  return detail === undefined
    ? {}
    : {
        spd: { type: Type.Float, value: detail.speed },
        tq: sfs.int(detail.remaining),
        sdt: sfs.double(detail.sampledAt),
      };
}

export function worldNeutralResource(startTime: bigint | undefined): Fields {
  return startTime === undefined ? {} : { occupybegintime: sfs.long(startTime) };
}
