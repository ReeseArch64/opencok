import type {
  WorldMonsterHealth,
  WorldExplorationDetail,
} from "@opencok/contracts/world-monster-detail";
import { sfs, decodeArray, type Fields } from "@opencok/messages/sfs";

export function worldMonsterHealth(detail: WorldMonsterHealth | undefined): Fields {
  return detail === undefined
    ? {}
    : { mchp: sfs.int(detail.current), mmhp: sfs.int(detail.maximum) };
}
export function worldMonsterExploration(detail: WorldExplorationDetail | undefined): Fields {
  return detail === undefined
    ? {}
    : {
        erp: sfs.array(detail.report === null ? [] : decodeArray(detail.report)),
        st: sfs.long(detail.startTime),
        et: sfs.long(detail.endTime),
      };
}
