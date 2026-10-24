import { z } from "zod";
import { createZodDto, wire } from "./dto.ts";

import type { WorldPointOwnerDetail, WorldCityDetail } from "@opencok/contracts/world-point-detail";
import { sfs, type Fields } from "@opencok/messages/sfs";

function serializeWorldPointOwner(detail: WorldPointOwnerDetail): Fields {
  const result: Fields = {};
  for (const key of ["uid", "pic", "afn"] as const)
    if (detail[key] !== undefined) result[key] = sfs.string(detail[key]);
  for (const key of ["registerTime", "power", "killArmy"] as const)
    if (detail[key] !== undefined) result[key] = sfs.long(detail[key]);
  for (const key of ["rank", "vl"] as const)
    if (detail[key] !== undefined) result[key] = sfs.int(detail[key]);
  return result;
}

function serializeWorldCityFields(detail: WorldCityDetail): Fields {
  return {
    slowDown: sfs.bool(detail.slowDown),
    targetTooStrong: sfs.bool(detail.targetTooStrong),
    targetPower: sfs.long(detail.targetPower),
    lastBeDuelTime: sfs.long(detail.lastBeDuelTime),
  };
}

export class WorldPointOwnerDto extends createZodDto(
  z.strictObject({
    uid: wire.string.optional(),
    pic: wire.string.optional(),
    afn: wire.string.optional(),
    registerTime: wire.long.optional(),
    power: wire.long.optional(),
    killArmy: wire.long.optional(),
    rank: wire.int.optional(),
    vl: wire.int.optional(),
  }),
) {}

export class WorldCityFieldsDto extends createZodDto(
  z.strictObject({
    slowDown: wire.bool,
    targetTooStrong: wire.bool,
    targetPower: wire.long,
    lastBeDuelTime: wire.long,
  }),
) {}

export function worldPointOwner(...args: Parameters<typeof serializeWorldPointOwner>): Fields {
  return new WorldPointOwnerDto(serializeWorldPointOwner(...args));
}

export function worldCityFields(...args: Parameters<typeof serializeWorldCityFields>): Fields {
  return new WorldCityFieldsDto(serializeWorldCityFields(...args));
}
