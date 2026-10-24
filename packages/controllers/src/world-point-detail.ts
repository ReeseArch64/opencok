import { worldNeutralResource } from "@opencok/dtos/world-resource-detail";
import type { WorldPointDetailStore } from "@opencok/contracts/world-point-detail";
import type { Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { worldPointOwner } from "@opencok/dtos/world-point-detail";
import {
  worldMonsterHealth as healthFields,
  worldMonsterExploration,
} from "@opencok/dtos/world-monster-detail";
import {
  worldPointDetailQuery,
  worldPointOccupied,
  worldPointOwnerBase,
} from "@opencok/rules/world-point-detail";
import {
  worldMonsterHealth,
  worldExplorationDetail,
  selectWorldExplorationMarch,
} from "@opencok/rules/world-monster-detail";
import { resourceRemaining, neutralResourceStart } from "@opencok/rules/world-resource-detail";
import { favoriteInteger } from "@opencok/rules/world-favorites";
import { mailBlank } from "@opencok/rules/mail";
import type { Rules } from "@opencok/rules/game";
import { legacyObjectOrder } from "@opencok/messages/legacy-object-order";
import { sfs, Type, type Fields } from "@opencok/messages/sfs";

function unsupported(): never {
  throw new GameError(errors.unsupported, "world_point_detail");
}
export function restoredExplorationMarch(
  observer: string,
  point: Row,
  marches: readonly Row[],
): string | undefined {
  if (marches.length > 4096) return unsupported();
  const byId = new Map<string, Row>();
  for (const row of marches) {
    if (typeof row.uuid !== "string" || !row.uuid || byId.has(row.uuid)) return unsupported();
    byId.set(row.uuid, row);
  }
  const keys = [...byId.keys()].sort();
  const ordered = legacyObjectOrder(keys).map((key) => byId.get(key)!);
  return selectWorldExplorationMarch(observer, point, ordered, false)?.uuid as string | undefined;
}
export async function localWorldPointDetail(
  store: WorldPointDetailStore,
  observer: string,
  params: Fields,
  rules: Rules,
  kingdomId: number,
  now: number,
): Promise<Fields> {
  if (
    params.point?.type !== Type.Int ||
    !favoriteInteger(params.point.value) ||
    (params.serverId !== undefined &&
      (params.serverId.type !== Type.Int || !favoriteInteger(params.serverId.value)))
  )
    throw new GameError(errors.invalid);
  const query = worldPointDetailQuery(
    params.point.value,
    params.serverId?.value as number | undefined,
    kingdomId,
    now,
  );
  if (query.kingdomId !== kingdomId && query.point > 0) return unsupported();
  const state = await store.read(observer, query, (point, marches) =>
    restoredExplorationMarch(observer, point, marches),
  );
  const profile = state.profile;
  if (!profile) throw new GameError(errors.missing);
  if (
    profile.uid !== observer ||
    profile.serverId !== kingdomId ||
    (profile.banFlag ?? 0) !== 0 ||
    typeof (profile.banTime ?? 0n) !== "bigint" ||
    ((profile.banTime ?? 0n) as bigint) > BigInt(now) ||
    state.kingdomId !== query.kingdomId ||
    state.remote !== (query.kingdomId !== kingdomId)
  )
    throw new GameError(errors.invalid);
  if (query.point <= 0) return {};
  const point = state.point;
  if (!point) throw new GameError(errors.missing);
  if (
    !state.world ||
    state.world.uid !== observer ||
    !favoriteInteger(state.world.worldId) ||
    point.id !== query.point ||
    point.worldId !== state.world.worldId ||
    !favoriteInteger(point.pointType) ||
    !state.owner
  )
    return unsupported();
  const type = point.pointType;
  if (type < 0 || type > 69 || [14, 18, 20, 21, 23, 44, 46, 47].includes(type))
    return unsupported();
  const owner = worldPointOwner(worldPointOwnerBase(point, state.owner, false));
  const occupied = worldPointOccupied(point);
  if (!occupied && (type === 3 || type === 37)) {
    const result: Fields = {
      ...owner,
      point: sfs.int(query.point),
      tq: sfs.int(resourceRemaining(point.resInitValue as number, point.resCostValue as number)),
    };
    if (type === 37) {
      if (!favoriteInteger(point.monsterCurrHP ?? 0)) return unsupported();
      result.existMember = sfs.int((point.monsterCurrHP ?? 0) as number);
    }
    return result;
  }
  if ((!occupied && (type === 49 || type === 50)) || type === 37) return unsupported();
  if (
    type === 3 &&
    !mailBlank(point.ownerId as string | null) &&
    !mailBlank(point.ownerMarchUUid as string | null)
  )
    return unsupported();
  if (type === 1 && rules.items.get("lost_battle")?.k3 === "1" && state.owner.profile)
    return unsupported();
  const result: Fields = {
    ...owner,
    ...healthFields(worldMonsterHealth(point, false, rules)),
    point: sfs.int(query.point),
  };
  if (type === 6) {
    if (!state.exploration) return unsupported();
    const marches = state.exploration.march ? [state.exploration.march] : [];
    Object.assign(
      result,
      worldMonsterExploration(worldExplorationDetail(observer, point, marches, false)),
    );
  }
  if (type === 60 && !mailBlank(point.pointItem as string | null)) {
    if (!state.neutralResource) return unsupported();
    Object.assign(
      result,
      worldNeutralResource(neutralResourceStart(point, state.neutralResource.march, rules)),
    );
  }
  if (
    type === 3 &&
    point.active === 1 &&
    !mailBlank(point.territoryAlliance as string | null) &&
    point.territoryAlliance === profile.allianceId
  )
    result.territory_positive_effect = sfs.int(1);
  return result;
}
