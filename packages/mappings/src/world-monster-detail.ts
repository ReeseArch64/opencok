import { validateFields } from "./validation.ts";
import {
  worldMonsterHealthSchema,
  worldMonsterExplorationSchema,
} from "@opencok/validations/world-monster-detail";

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

export function worldMonsterHealth(
  ...args: Parameters<typeof serializeWorldMonsterHealth>
): Fields {
  return validateFields(worldMonsterHealthSchema, serializeWorldMonsterHealth(...args));
}

export function worldMonsterExploration(
  ...args: Parameters<typeof serializeWorldMonsterExploration>
): Fields {
  return validateFields(worldMonsterExplorationSchema, serializeWorldMonsterExploration(...args));
}
