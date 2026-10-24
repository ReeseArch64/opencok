import { validateFields } from "./validation.ts";
import {
  worldResourceOwnerSchema,
  worldResourceGroupSchema,
  worldNeutralResourceSchema,
} from "@opencok/validations/world-resource-detail";

import type {
  WorldResourceOwnerDetail,
  WorldResourceGroupDetail,
} from "@opencok/contracts/world-resource-detail";
import { sfs, Type, type Fields } from "@opencok/messages/sfs";

function serializeWorldResourceOwner(detail: WorldResourceOwnerDetail): Fields {
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

function serializeWorldResourceGroup(detail: WorldResourceGroupDetail | undefined): Fields {
  return detail === undefined
    ? {}
    : {
        spd: { type: Type.Float, value: detail.speed },
        tq: sfs.int(detail.remaining),
        sdt: sfs.double(detail.sampledAt),
      };
}

function serializeWorldNeutralResource(startTime: bigint | undefined): Fields {
  return startTime === undefined ? {} : { occupybegintime: sfs.long(startTime) };
}

export function worldResourceOwner(
  ...args: Parameters<typeof serializeWorldResourceOwner>
): Fields {
  return validateFields(worldResourceOwnerSchema, serializeWorldResourceOwner(...args));
}

export function worldResourceGroup(
  ...args: Parameters<typeof serializeWorldResourceGroup>
): Fields {
  return validateFields(worldResourceGroupSchema, serializeWorldResourceGroup(...args));
}

export function worldNeutralResource(
  ...args: Parameters<typeof serializeWorldNeutralResource>
): Fields {
  return validateFields(worldNeutralResourceSchema, serializeWorldNeutralResource(...args));
}
