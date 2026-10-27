import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { num, text, long } from "@opencok/contracts/rows";
import type { WorldUtilityStore } from "@opencok/contracts/world-utility";
import { int, type Fields } from "@opencok/messages/sfs";
import { nearestWorldFootprint } from "@opencok/rules/world-utility";
import { allianceWorldPoints, worldNearestPoint } from "@opencok/mappings/world-utility";

export async function worldUtility(
  store: WorldUtilityStore,
  owner: string,
  command: string,
  params: Fields,
  kingdom: number,
  size: number,
  now: number,
): Promise<Fields> {
  if (!Number.isSafeInteger(now) || now < 0) throw new GameError(errors.invalid);
  const point = command === "point.nearest.find" ? int(params, "point") : undefined;
  if (point !== undefined && point > size * size) throw new GameError(errors.invalid);
  if (int(params, "serverId", kingdom) !== kingdom) throw new GameError(errors.unsupported);
  const state = await store.read(owner, point, command === "world.al.leader.pt");
  if (
    state.profile?.uid !== owner ||
    state.world?.uid !== owner ||
    num(state.profile, "serverId") !== kingdom ||
    num(state.profile, "banFlag") !== 0 ||
    long(state.profile, "banTime") > BigInt(now)
  )
    throw new GameError(errors.invalid);
  if (num(state.world, "worldId") !== 0) throw new GameError(errors.unsupported);
  if (command === "point.nearest.find")
    return worldNearestPoint({ point: nearestWorldFootprint(state.points, point!, size) });
  if (command === "world.leave") {
    await store.leave(owner);
    return {};
  }
  if (command !== "world.al.leader.pt") throw new GameError(errors.invalid);
  const alliance = text(state.profile, "allianceId");
  if (
    state.members.some((row) => text(row, "allianceId") !== alliance) ||
    state.members.filter((row) => num(row, "rank") === 5).length > 1
  )
    throw new GameError(errors.invalid);
  return allianceWorldPoints(state, owner);
}
