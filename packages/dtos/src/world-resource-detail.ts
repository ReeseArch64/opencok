import { z } from "zod";
import { createZodDto, wire } from "./dto.ts";

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

export class WorldResourceOwnerDto extends createZodDto(
  z.strictObject({
    q: wire.int,
    tq: wire.int,
    collected: wire.int,
    spd: wire.float,
    sdt: wire.long,
    changeCollectSpdTime: wire.long,
    occupyEndTime: wire.long,
  }),
) {}

export class WorldResourceGroupDto extends createZodDto(
  z.union([
    z.strictObject({}),
    z.strictObject({ spd: wire.float, tq: wire.int, sdt: wire.double }),
  ]),
) {}

export class WorldNeutralResourceDto extends createZodDto(
  z.union([z.strictObject({}), z.strictObject({ occupybegintime: wire.long })]),
) {}

export function worldResourceOwner(
  ...args: Parameters<typeof serializeWorldResourceOwner>
): Fields {
  return new WorldResourceOwnerDto(serializeWorldResourceOwner(...args));
}

export function worldResourceGroup(
  ...args: Parameters<typeof serializeWorldResourceGroup>
): Fields {
  return new WorldResourceGroupDto(serializeWorldResourceGroup(...args));
}

export function worldNeutralResource(
  ...args: Parameters<typeof serializeWorldNeutralResource>
): Fields {
  return new WorldNeutralResourceDto(serializeWorldNeutralResource(...args));
}
