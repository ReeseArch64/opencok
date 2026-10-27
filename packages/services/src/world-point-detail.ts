import { specialWorldFields } from "./world-special-detail.ts";
import { occupiedResourceFields } from "./world-resource-query.ts";
import { roundTripLegacyObject } from "@opencok/messages/legacy-json";
import { decodeJavaIntMap } from "@opencok/messages/java-int-map";
import { barbarianArmyPlan, barbarianPower } from "@opencok/rules/world-barbarian-detail";
import type { GameServices } from "@opencok/contracts/game";
import { MOBILE_CLIENT_VERSION } from "@opencok/constants/game";
import { playerGameEffect } from "@opencok/rules/power-resolver";
import { worldPowerEffects } from "@opencok/rules/power-world";
import { generalSkillPoints } from "@opencok/hero/services/general-power";
import { decodeWorldPowerEffects } from "./power.ts";
import { worldNeutralResource } from "@opencok/mappings/world-resource-detail";
import type { WorldPointDetailStore } from "@opencok/contracts/world-point-detail";
import type { Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { worldPointOwner, worldCityFields } from "@opencok/mappings/world-point-detail";
import {
  worldMonsterHealth as healthFields,
  worldMonsterExploration,
} from "@opencok/mappings/world-monster-detail";
import {
  worldPointDetailQuery,
  worldCityDetail,
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
  if (marches.length > 4096) {return unsupported();}

  const byId = new Map<string, Row>();

  for (const row of marches) {
    if (typeof row.uuid !== "string" || !row.uuid || byId.has(row.uuid)) {return unsupported();}

    byId.set(row.uuid, row);
  }

  const keys = [...byId.keys()].sort();
  const ordered = legacyObjectOrder(keys).map((key) => byId.get(key)!);

  return selectWorldExplorationMarch(observer, point, ordered, false)?.uuid as string | undefined;
}

export async function worldPointDetail(
  store: WorldPointDetailStore,
  observer: string,
  params: Fields,
  rules: Rules,
  kingdomId: number,
  now: number,
  services: Pick<
    GameServices,
    "worldPowerEffects" | "emperorVersion" | "expeditionStage" | "worldTurretKills"
  > = {},
  clock: () => number = () => now,
): Promise<Fields> {
  if (
    params.point?.type !== Type.Int ||
    !favoriteInteger(params.point.value) ||
    (params.serverId !== undefined &&
      (params.serverId.type !== Type.Int || !favoriteInteger(params.serverId.value)))
  )
    {throw new GameError(errors.invalid);}

  const query = worldPointDetailQuery(
    params.point.value,
    params.serverId?.value as number | undefined,
    kingdomId,
    now,
  );
  const cityFeature = rules.items.get("lost_battle");
  const state = await store.read(
    observer,
    { ...query, cityExtras: cityFeature?.k3 === "1", resourceEffects: true },
    (point, marches) => restoredExplorationMarch(observer, point, marches),
    services.worldTurretKills,
  );
  const profile = state.profile;

  if (!profile) {throw new GameError(errors.missing);}

  if (
    profile.uid !== observer ||
    profile.serverId !== kingdomId ||
    (profile.banFlag ?? 0) !== 0 ||
    typeof (profile.banTime ?? 0n) !== "bigint" ||
    ((profile.banTime ?? 0n) as bigint) > BigInt(now) ||
    state.kingdomId !== query.kingdomId ||
    state.remote !== (query.kingdomId !== kingdomId)
  )
    {throw new GameError(errors.invalid);}

  if (query.point <= 0) {return {};}

  const point = state.point;

  if (!point) {throw new GameError(errors.missing);}

  if (
    !state.world ||
    state.world.uid !== observer ||
    !favoriteInteger(state.world.worldId) ||
    point.id !== query.point ||
    point.worldId !== (state.remote ? 0 : state.world.worldId) ||
    !favoriteInteger(point.pointType) ||
    !state.owner
  )
    {return unsupported();}

  const type = point.pointType;

  if (type < 0 || type > 69) {return unsupported();}

  const occupied = worldPointOccupied(point);

  if (state.remote) {
    if (type === 3 && !occupied)
      {return roundTripLegacyObject({
        point: sfs.int(query.point),
        tq: sfs.int(resourceRemaining(point.resInitValue as number, point.resCostValue as number)),
      });}

    return roundTripLegacyObject({
      ...worldPointOwner(worldPointOwnerBase(point, state.owner, true)),
      ...(await specialWorldFields(state, observer, rules, now, services)),
      ...(await occupiedResourceFields(state, rules, now, services, clock)),
      point: sfs.int(query.point),
    });
  }

  const owner = worldPointOwner(worldPointOwnerBase(point, state.owner, false));

  if (!occupied && (type === 3 || type === 37)) {
    const result: Fields = {
      ...owner,
      point: sfs.int(query.point),
      tq: sfs.int(resourceRemaining(point.resInitValue as number, point.resCostValue as number)),
    };

    if (type === 37) {
      if (!favoriteInteger(point.monsterCurrHP ?? 0)) {return unsupported();}

      result.existMember = sfs.int((point.monsterCurrHP ?? 0) as number);
    }

    return result;
  }

  if (!occupied && (type === 49 || type === 50))
    {return {
      ...owner,
      ...(await specialWorldFields(state, observer, rules, now, services)),
      point: sfs.int(query.point),
    };}

  const result: Fields = {
    ...owner,
    ...(await specialWorldFields(state, observer, rules, now, services)),
    ...(await occupiedResourceFields(state, rules, now, services, clock)),
    ...healthFields(worldMonsterHealth(point, false, rules)),
    point: sfs.int(query.point),
  };

  if (type === 1 && cityFeature?.k3 === "1" && state.owner.profile) {
    const city = state.city;

    if (
      !city ||
      !city.observerStatistics ||
      city.observerStatistics.uid !== observer ||
      !city.mixed ||
      city.mixed.uid !== point.ownerId ||
      city.effects.profile.uid !== point.ownerId ||
      city.effects.profile.serverId !== kingdomId ||
      !services.worldPowerEffects
    )
      {return unsupported();}

    const context = { now, kingdomId, version: MOBILE_CLIENT_VERSION };
    const world = worldPowerEffects(
      decodeWorldPowerEffects(await services.worldPowerEffects()),
      rules,
      context,
    );
    const emperor = city.effects.throneRewards.length
      ? await services.emperorVersion?.()
      : undefined;
    const effect = playerGameEffect(
      city.effects,
      rules,
      context,
      generalSkillPoints(city.effects.generals),
      world,
      emperor,
      37,
    );
    Object.assign(
      result,
      worldCityFields(
        worldCityDetail(
          city.observerStatistics.power,
          state.owner.statistics?.power,
          city.mixed.lastBeDuelTime,
          effect,
          cityFeature.k4,
        ),
      ),
    );
  }

  if (type === 44) {
    if (!state.barbarian) {return unsupported();}

    const row = state.barbarian.row;

    if (row && row.pointId !== query.point) {return unsupported();}

    const plan = barbarianArmyPlan(row, rules, clock());
    let remaining: ReadonlyMap<string | null, number | null> | null = null;

    if (plan?.army.size && row?.lastArmyMapByteArray != null) {
      try {
        remaining = decodeJavaIntMap(row.lastArmyMapByteArray as Buffer);
      } catch {
        return unsupported();
      }
    }

    result.barbarionPower = sfs.long(barbarianPower(plan, remaining, rules));
  }

  if (type === 6) {
    if (!state.exploration) {return unsupported();}

    const marches = state.exploration.march ? [state.exploration.march] : [];
    Object.assign(
      result,
      worldMonsterExploration(worldExplorationDetail(observer, point, marches, false)),
    );
  }

  if (type === 60 && !mailBlank(point.pointItem as string | null)) {
    if (!state.neutralResource) {return unsupported();}

    Object.assign(
      result,
      worldNeutralResource(neutralResourceStart(point, state.neutralResource.march, rules)),
    );
  }

  if (
    (type === 3 || type === 18) &&
    point.active === 1 &&
    !mailBlank(point.territoryAlliance as string | null) &&
    point.territoryAlliance === profile.allianceId
  )
    {result.territory_positive_effect = sfs.int(1);}

  return result;
}
