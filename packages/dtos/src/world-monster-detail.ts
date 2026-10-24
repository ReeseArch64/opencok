import { z } from "zod";
import { createZodDto, wire, wireValue } from "./dto.ts";

import type {
  WorldMonsterHealth,
  WorldExplorationDetail,
} from "@opencok/contracts/world-monster-detail";
import { sfs, decodeArray, type Fields } from "@opencok/messages/sfs";

function serializeWorldMonsterHealth(detail: WorldMonsterHealth | undefined): Fields {
  return detail === undefined
    ? {}
    : { mchp: sfs.int(detail.current), mmhp: sfs.int(detail.maximum) };
}
function serializeWorldMonsterExploration(detail: WorldExplorationDetail | undefined): Fields {
  return detail === undefined
    ? {}
    : {
        erp: sfs.array(detail.report === null ? [] : decodeArray(detail.report)),
        st: sfs.long(detail.startTime),
        et: sfs.long(detail.endTime),
      };
}

export class WorldMonsterHealthDto extends createZodDto(
  z.union([z.strictObject({}), z.strictObject({ mchp: wire.int, mmhp: wire.int })]),
) {}

export class WorldMonsterExplorationDto extends createZodDto(
  z.union([
    z.strictObject({}),
    z.strictObject({ erp: wire.array(wireValue), st: wire.long, et: wire.long }),
  ]),
) {}

export function worldMonsterHealth(
  ...args: Parameters<typeof serializeWorldMonsterHealth>
): Fields {
  return new WorldMonsterHealthDto(serializeWorldMonsterHealth(...args));
}

export function worldMonsterExploration(
  ...args: Parameters<typeof serializeWorldMonsterExploration>
): Fields {
  return new WorldMonsterExplorationDto(serializeWorldMonsterExploration(...args));
}
