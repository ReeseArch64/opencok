import type { WorldPointOwnerDetail, WorldCityDetail } from "@opencok/contracts/world-point-detail";
import { sfs, type Fields } from "@opencok/messages/sfs";

export function worldPointOwner(detail: WorldPointOwnerDetail): Fields {
  const result: Fields = {};
  for (const key of ["uid", "pic", "afn"] as const)
    if (detail[key] !== undefined) result[key] = sfs.string(detail[key]);
  for (const key of ["registerTime", "power", "killArmy"] as const)
    if (detail[key] !== undefined) result[key] = sfs.long(detail[key]);
  for (const key of ["rank", "vl"] as const)
    if (detail[key] !== undefined) result[key] = sfs.int(detail[key]);
  return result;
}

export function worldCityFields(detail: WorldCityDetail): Fields {
  return {
    slowDown: sfs.bool(detail.slowDown),
    targetTooStrong: sfs.bool(detail.targetTooStrong),
    targetPower: sfs.long(detail.targetPower),
    lastBeDuelTime: sfs.long(detail.lastBeDuelTime),
  };
}
