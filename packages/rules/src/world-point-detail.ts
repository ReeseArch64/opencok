import { javaDecimal } from "./java-integer.ts";
import type {
  WorldPointDetailQuery,
  WorldCityDetail,
  WorldPointOwnerDetail,
  WorldPointOwnerSnapshot,
} from "@opencok/contracts/world-point-detail";
import type { Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { mailBlank } from "./mail.ts";

function invalid(): never {
  throw new GameError(errors.unsupported, "world_point_detail");
}
function integer(value: unknown): number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < -2147483648 ||
    value > 2147483647
  )
    return invalid();
  return value;
}
function long(value: unknown): bigint {
  if (typeof value !== "bigint" || BigInt.asIntN(64, value) !== value) return invalid();
  return value;
}
function text(value: unknown, limit: number): string {
  if (
    typeof value !== "string" ||
    value.length > limit ||
    !value.isWellFormed() ||
    value.includes("\0")
  )
    return invalid();
  return value;
}
function nullableText(value: unknown, limit: number): string | null {
  return value == null ? null : text(value, limit);
}
function owned(row: Row | undefined, uid: string): Row | undefined {
  if (row !== undefined && row.uid !== uid) return invalid();
  return row;
}
export function worldPointDetailQuery(
  point: number,
  server: number | undefined,
  local: number,
  now: number,
): WorldPointDetailQuery {
  if (integer(local) < 1 || !Number.isSafeInteger(now) || now < 0) return invalid();
  const kingdomId = server === undefined || server === -1 ? local : integer(server);
  if (kingdomId < 1) return invalid();
  return { point: integer(point), kingdomId, now };
}
export function worldPointOccupied(point: Row): boolean {
  return (
    !mailBlank(nullableText(point.ownerId, 255)) || !mailBlank(nullableText(point.ownerName, 255))
  );
}
export function worldPointOwnerBase(
  point: Row,
  owner: WorldPointOwnerSnapshot,
  remote: boolean,
): WorldPointOwnerDetail {
  if (typeof remote !== "boolean") return invalid();
  const type = integer(point.pointType);
  if (!remote && type === 15) return {};
  const uid = nullableText(point.ownerId, 255);
  if (mailBlank(uid)) return {};
  const result: WorldPointOwnerDetail = { uid: uid! };
  if (!remote && type === 6) return result;
  const profile = owned(owner.profile, uid!);
  let registered = profile ? long(profile.regTime) : 0n;
  if (profile) {
    const registration = owned(owner.registration, uid!);
    if (registration) {
      const migrated = long(registration.time);
      if (migrated > registered) registered = migrated;
    }
  }
  result.registerTime = registered;
  const city = type === 1 || type === 2;
  if (city || type === 3 || type === 37 || type === 4 || type === 5) {
    result.pic = profile ? text(profile.pic, 40) : "";
  }
  if (city && profile) {
    const statistics = owned(owner.statistics, uid!);
    if (!statistics) return invalid();
    result.power = long(statistics.power ?? 0n);
    result.killArmy = long(statistics.armyKill ?? 0n);
  }
  if (city || type === 3) {
    const allianceId = nullableText(point.allianceId, 40);
    if (!mailBlank(allianceId)) {
      const alliance = owned(owner.alliance, allianceId!);
      if (alliance?.abbr != null) result.afn = text(alliance.abbr, 10);
      const member = owned(owner.member, uid!);
      result.rank = integer(member?.rank ?? 0);
    } else if (type === 3) result.rank = 0;
    result.vl = 0;
  }
  return result;
}

export function worldCityDetail(
  observerPower: unknown,
  targetPower: unknown,
  lastBeDuelTime: unknown,
  slowDownEffect: number,
  multiplier: string | undefined,
): WorldCityDetail {
  const observer = long(observerPower ?? 0n);
  const target = long(targetPower ?? 0n);
  const duel = long(lastBeDuelTime ?? 0n);
  if (!Number.isFinite(slowDownEffect) || Math.fround(slowDownEffect) !== slowDownEffect)
    return invalid();
  let factor: bigint;
  try {
    factor = javaDecimal(multiplier, 64);
  } catch {
    return invalid();
  }
  return {
    slowDown: slowDownEffect > 0,
    targetTooStrong: BigInt.asIntN(64, observer * factor) < target,
    targetPower: target,
    lastBeDuelTime: duel,
  };
}
