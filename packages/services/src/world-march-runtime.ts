import { CityCommandDomain } from "./city-command-domain.ts";
import { scoutWatchtowerValues } from "@opencok/rules/world-scout-watchtower";
import {
  scoutSoldierLimit,
  scoutArmySpeed,
  scoutExpeditionEffect,
  scoutDeparture,
  scoutDepartureProgress,
  scoutRoute,
  scoutArrival,
  scoutTarget,
} from "./world-scout-runtime";
import { worldBirthRules } from "@opencok/rules/world-birth";
import {
  startTreasureExcavation,
  finishTreasureExcavation,
  abandonTreasureExcavation,
} from "./treasure-excavation";
import { treasureMapRoster, writeTreasureMap } from "./treasure-map-state";
import { sharedResourceRewards, pinStoredSharedResourceRewards } from "./world-shared-rewards";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { reconnectMarchDragon, reconnectMarchGeneral } from "@opencok/mappings/reconnect-marches";
import { pinProgressionReward, grantPinnedProgressionReward } from "./progression-rewards";
import { treasureMapFree } from "@opencok/rules/treasure-map";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { resolveWorldCityGeometry } from "@opencok/rules/world-city-geometry";
import { troubleItem } from "@opencok/rules/trouble";
import { recordTargetTask } from "./target-task";
import {
  selectMarchCompanions,
  attachMarchCompanions,
  releaseMarchCompanions,
  marchCompanionFields,
  marchCompanionPushes,
} from "./world-march-companions";
import { recordExpeditionScore } from "./new-expedition";
import { worldMarchDetail, worldMarchCheck } from "@opencok/mappings/world-march-runtime";
import { armySnapshot } from "@opencok/mappings/bootstrap";
import { worldResourceOwner } from "@opencok/mappings/world-resource-detail";
import { randomUUID } from "node:crypto";
import { encode, decode, sfs, str, int, fields, Type, type Fields } from "@opencok/messages/sfs";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import {
  encodeWorldMarchArmy,
  decodeWorldMarchArmy,
  isMaintainedMarchArmy,
  decodeWorldMarchSpeedEffects,
  type SavedMarchArmy,
} from "@opencok/messages/world-resource-army";
import type { RuntimeMarch } from "@opencok/contracts/world-march-runtime";
import {
  reserveMarch,
  arriveForGathering,
  returnFromGathering,
  recallOutbound,
  accelerateMarch,
  completeMarchReturn,
} from "@opencok/rules/world-march-lifecycle";
import {
  worldMutationFailure,
  worldFootprint,
  ordinaryMarchRoute,
  accelerateMarchSegments,
  resourceGatherRate,
} from "@opencok/rules/world-march-runtime";
import { cityInteger, cityAmount, citySpeedGold } from "@opencok/rules/city-progression";
import {
  resourceRawArmyLoad,
  resourceArmyLoad,
  resourceOwnerDetail,
  resourceSavedCollection,
  resourceRemaining,
} from "@opencok/rules/world-resource-detail";
import { reconnectMarchBase } from "@opencok/mappings/reconnect-marches";
import { serverFeature } from "@opencok/rules/power-context";
import type { CityDomain } from "./city-domain.ts";
import type { CityProgressionContext } from "./city-progression-context.ts";

function troubleDetectSpeed(context: CityProgressionContext) {
  return scoutWatchtowerValues(
    context.rules,
    context.state.buildings.find((row) => num(row, "itemId") === 417000),
    {
      kingdomId: context.rules.kingdomId,
      version: text(context.state.profile, "appVersion"),
      now: Number(context.now),
    },
  ).speed;
}

function checkpoint(state: RuntimeMarch) {
  return encode({
    ...(state.purpose === "scout"
      ? {
          purpose: sfs.string("scout"),
          scoutHonour: sfs.bool(state.scoutHonour ?? false),
          scoutTargetOwner: sfs.string(state.scoutTargetOwner ?? ""),
          scoutReport: sfs.string(state.scoutReport ?? ""),
        }
      : state.purpose === "trouble"
        ? { purpose: sfs.string(state.purpose), troubleItem: sfs.string(state.troubleItem!) }
        : state.purpose === "treasure"
          ? {
              purpose: sfs.string(state.purpose),
              treasureUUID: sfs.string(state.treasureUUID!),
              ...(state.treasureReward ? { treasureReward: sfs.string(state.treasureReward) } : {}),
            }
          : {}),
    ...(state.sharedReward !== undefined
      ? {
          sharedReward: sfs.string(state.sharedReward),
          sharedRewardCounts: sfs.string(JSON.stringify(state.sharedRewardCounts ?? [])),
        }
      : {}),
    id: sfs.string(state.id),
    owner: sfs.string(state.owner),
    worldId: sfs.int(state.worldId),
    origin: sfs.int(state.origin),
    target: sfs.int(state.target),
    version: sfs.int(state.version),
    phase: sfs.string(state.phase),
    startedAt: sfs.long(state.startedAt),
    dueAt: sfs.long(state.dueAt),
    returnDuration: sfs.long(state.returnDuration),
    capacity: sfs.int(state.capacity),
    gatheredBefore: sfs.int(state.gatheredBefore ?? 0),
    segments: sfs.string(JSON.stringify(state.segments ?? [])),
    collectRate: sfs.double(state.collectRate),
    marchSpeed: sfs.double(state.marchSpeed),
    targetType: sfs.int(state.targetType),
    targetResource: sfs.int(state.targetResource),
    troops: sfs.array(
      state.troops.map((row) =>
        sfs.object({
          armyId: sfs.string(row.armyId),
          quantity: sfs.int(row.quantity),
          fullId: sfs.string(state.troopIds[row.armyId]!),
        }),
      ),
    ),
    cargo: state.cargo
      ? sfs.object({
          resource: sfs.string(state.cargo.resource),
          amount: sfs.long(state.cargo.amount),
        })
      : sfs.null(),
  });
}

function restore(raw: Row): RuntimeMarch {
  const data = decode(Buffer.from(raw.payload as Buffer)),
    units = data.troops;

  if (units?.type !== Type.Array) worldMutationFailure();

  const troops = (units.value as { value: Fields }[]).map((value) => ({
    armyId: str(value.value, "armyId"),
    quantity: cityInteger(int(value.value, "quantity"), 1),
  }));
  const troopIds = Object.fromEntries(
    (units.value as { value: Fields }[]).map((value) => [
      str(value.value, "armyId"),
      str(value.value, "fullId"),
    ]),
  );
  const cargo = data.cargo?.type === Type.Object ? fields(data.cargo) : null;
  const purpose = str(data, "purpose", "");

  if (purpose && purpose !== "trouble" && purpose !== "treasure" && purpose !== "scout")
    worldMutationFailure();

  const state: RuntimeMarch = {
    ...(purpose === "scout"
      ? {
          purpose,
          scoutHonour: data.scoutHonour?.value === true,
          scoutTargetOwner: str(data, "scoutTargetOwner", ""),
          scoutReport: str(data, "scoutReport", ""),
        }
      : purpose === "trouble"
        ? { purpose, troubleItem: str(data, "troubleItem") }
        : purpose === "treasure"
          ? {
              purpose,
              treasureUUID: str(data, "treasureUUID"),
              ...(str(data, "treasureReward", "")
                ? { treasureReward: str(data, "treasureReward") }
                : {}),
            }
          : {}),
    ...(data.sharedReward
      ? {
          sharedReward: str(data, "sharedReward"),
          sharedRewardCounts: JSON.parse(str(data, "sharedRewardCounts", "[]")),
        }
      : {}),
    id: str(data, "id"),
    owner: str(data, "owner"),
    worldId: int(data, "worldId"),
    origin: int(data, "origin"),
    target: int(data, "target"),
    version: int(data, "version"),
    phase: str(data, "phase") as RuntimeMarch["phase"],
    startedAt: BigInt(data.startedAt!.value as bigint),
    dueAt: BigInt(data.dueAt!.value as bigint),
    returnDuration: BigInt(data.returnDuration!.value as bigint),
    capacity: int(data, "capacity"),
    gatheredBefore: int(data, "gatheredBefore", 0),
    segments: JSON.parse(str(data, "segments", "[]")),
    collectRate: Number(data.collectRate!.value),
    marchSpeed: Number(data.marchSpeed!.value),
    targetType: int(data, "targetType"),
    targetResource: int(data, "targetResource"),
    troops,
    troopIds,
    cargo: cargo
      ? {
          resource: str(cargo, "resource") as "wood",
          amount: BigInt(cargo.amount!.value as bigint),
        }
      : null,
  };

  if (
    state.id !== raw.id ||
    state.owner !== raw.ownerUid ||
    state.version !== num(raw, "version") ||
    state.dueAt !== long(raw, "dueAt")
  )
    worldMutationFailure();

  return state;
}

function point(context: CityProgressionContext, id: number): Row {
  const saved =
    context.write.worldMutation?.points?.find((row) => num(row, "id") === id) ??
    context.state.worldMutation?.points.find((row) => num(row, "id") === id);

  if (!saved) worldMutationFailure();

  return { ...saved };
}

function savePoint(context: CityProgressionContext, row: Row) {
  const write = (context.write.worldMutation ??= {});
  write.points = [...(write.points ?? []).filter((prior) => prior.id !== row.id), row];
}

function balances(context: CityProgressionContext) {
  return context.state.armies.map((row) => {
    const changed = context.write.armies?.find((prior) => prior.armyId === row.armyId);

    return {
      armyId: text(row, "armyId"),
      free: num(changed ?? row, "free"),
      march: num(changed ?? row, "march"),
    };
  });
}

function writeBalances(
  context: CityProgressionContext,
  rows: readonly { armyId: string; free: number; march: number }[],
) {
  context.write.armies = context.state.armies.map((row) => ({
    ...row,
    ...rows.find((prior) => prior.armyId === row.armyId),
  }));
}

function marchRows(context: CityProgressionContext) {
  const rows = new Map(
    (context.state.worldMutation?.marches ?? []).map((row) => [text(row, "uuid"), row]),
  );

  for (const row of context.write.worldMutation?.marches ?? []) rows.set(text(row, "uuid"), row);

  for (const id of context.write.worldMutation?.deletedMarches ?? []) rows.delete(id);

  return [...rows.values()];
}

function saveMarch(context: CityProgressionContext, state: RuntimeMarch, original: Row) {
  const write = (context.write.worldMutation ??= {}),
    previous = write.checkpoints?.find((row) => row.id === state.id),
    stored = context.state.worldMutation?.checkpoints.find((row) => row.id === state.id);
  const expectedVersion = previous
    ? num(previous, "expectedVersion")
    : stored
      ? num(stored, "version")
      : 0;
  const record: Row = {
    id: state.id,
    ownerUid: context.owner,
    version: state.version,
    status: state.phase === "completed" ? 1 : 0,
    dueAt: state.dueAt,
    payload: Buffer.from(checkpoint(state)),
    expectedVersion,
  };
  write.checkpoints = [...(write.checkpoints ?? []).filter((row) => row.id !== state.id), record];

  if (state.phase === "completed") {
    releaseMarchCompanions(context, original);
    write.deletedMarches = [...(write.deletedMarches ?? []), state.id];
    write.marches = (write.marches ?? []).filter((row) => row.uuid !== state.id);

    return;
  }

  const row = {
    ...original,
    state: state.phase === "outbound" ? 0 : state.phase === "gathering" ? 1 : 2,
    targetType: state.targetType,
    arrivalTime: state.phase === "gathering" ? long(original, "arrivalTime") : state.dueAt,
    collectSpd: state.collectRate,
    blackLandMarchTime: state.segments?.length ? JSON.stringify(state.segments) : "",
    plunderRes:
      state.cargo || state.sharedRewardCounts?.length
        ? JSON.stringify([
            ...(state.cargo ? [{ t: state.targetResource, v: Number(state.cargo.amount) }] : []),
            ...(state.sharedRewardCounts ?? []).map((row) => ({ r: row.id, v: row.count })),
          ])
        : "",
    ...(state.targetType === 37 && state.phase === "gathering"
      ? { occupyResourceEndTime: state.dueAt, maxCollectTime: state.dueAt - state.startedAt }
      : {}),
    ...(state.phase === "outbound" ? { marchArrivalTime: state.dueAt } : {}),
    ...(state.phase === "returning" ? { returnStartTime: state.startedAt } : {}),
    marchTime:
      state.phase === "gathering"
        ? num(original, "marchTime")
        : cityInteger(state.dueAt - state.startedAt),
  };
  write.marches = [...(write.marches ?? []).filter((prior) => prior.uuid !== state.id), row];
}

function sharedResourceView(state: RuntimeMarch, target: Row): Fields {
  return {
    q: sfs.int(
      Math.trunc(
        Math.fround(
          Math.fround(Number((state.dueAt - state.startedAt) / 1000n)) *
            Math.fround(state.collectRate),
        ),
      ),
    ),
    spd: { type: Type.Float, value: Math.fround(state.collectRate) },
    sdt: sfs.long(state.startedAt),
    tq: sfs.int(num(target, "resInitValue") - num(target, "resCostValue")),
    collected: sfs.int(state.gatheredBefore ?? 0),
    changeCollectSpdTime: sfs.long(state.startedAt),
    occupyEndTime: sfs.long(state.dueAt),
  };
}

function sharedMembers(context: CityProgressionContext, target: number): Row[] {
  const rows = new Map(
    (context.state.worldMutation?.sharedMarches ?? [])
      .filter((row) => row.ownerUid !== context.owner)
      .map((row) => [text(row, "uuid"), row]),
  );

  for (const row of marchRows(context)) rows.set(text(row, "uuid"), row);

  const present = [...rows.values()].filter(
    (row) => num(row, "targetId") === target && num(row, "state") === 1,
  );

  if (
    present.some(
      (row) => num(row, "targetType") !== 37 || num(row, "type") !== 0 || !text(row, "ownerUid"),
    )
  )
    worldMutationFailure();

  return present
    .filter(
      (row) =>
        num(row, "targetId") === target &&
        num(row, "targetType") === 37 &&
        num(row, "type") === 0 &&
        num(row, "state") === 1,
    )
    .sort((a, b) =>
      long(a, "marchArrivalTime") < long(b, "marchArrivalTime")
        ? -1
        : long(a, "marchArrivalTime") > long(b, "marchArrivalTime")
          ? 1
          : text(a, "uuid").localeCompare(text(b, "uuid")),
    );
}

function sharedMemberView(context: CityProgressionContext, row: Row): Fields {
  const owner = text(row, "ownerUid"),
    profile =
      owner === context.owner
        ? context.state.profile
        : context.state.worldMutation?.sharedProfiles?.find((value) => value.uid === owner),
    army = row.armyInfo ? decodeWorldMarchArmy(row.armyInfo as Buffer) : null;

  if (!army || army.owner !== owner || !army.soldiers) worldMutationFailure();

  const soldiers = army.soldiers.filter((unit) => unit.total > unit.dead),
    dragon = army.dragons?.[0],
    dragonRow = dragon
      ? (context.state.worldMutation?.sharedDragons?.find(
          (value) => value.uid === owner && value.uuid === dragon.uuid,
        ) ??
        (owner === context.owner
          ? context.state.dragons?.dragons.find((value) => value.uuid === dragon.uuid)
          : undefined))
      : undefined,
    general = army.general
      ? reconnectMarchGeneral(
          army.general,
          context.state.worldMutation?.sharedGeneralSkills ??
            context.state.generalRoster?.skills ??
            [],
          context.now,
        )
      : undefined;

  if (dragon && !dragonRow) worldMutationFailure();

  return {
    uuid: sfs.string(text(row, "uuid")),
    uid: sfs.string(owner),
    name: sfs.string(text(row, "ownerName")),
    ...(text(row, "allianceId") ? { allianceId: sfs.string(text(row, "allianceId")) } : {}),
    pic: sfs.string(profile ? text(profile, "pic") : ""),
    picVer: sfs.int(profile ? num(profile, "picVer") : 0),
    ...(profile ? { picfraId: sfs.int(num(profile, "picfraId")) } : {}),
    raceType: sfs.int(profile ? num(profile, "civilizationType") : 0),
    soldiers: sfs.array(
      soldiers.map((unit) =>
        sfs.object({
          armyId: sfs.string(unit.armsId ?? ""),
          star: sfs.int(
            unit.level ??
              num(
                (owner === context.owner
                  ? context.state.armies
                  : (context.state.worldMutation?.sharedArmies ?? [])
                ).find((value) => value.uid === owner && value.armyId === unit.armsId) ?? {},
                "level",
              ),
          ),
          count: sfs.int(unit.total - unit.dead),
        }),
      ),
    ),
    generals: sfs.array([]),
    ...(dragonRow ? { petDragon: sfs.object(reconnectMarchDragon(dragonRow, context.rules)) } : {}),
    ...(general ? { newGeneral: sfs.object(general) } : {}),
    totalTroops: sfs.int(soldiers.reduce((sum, unit) => sum + unit.total - unit.dead, 0)),
    startTime: sfs.long(long(row, "marchStartTime")),
    arrivalTime: sfs.long(long(row, "marchArrivalTime")),
  };
}

function sharedCheckpoint(context: CityProgressionContext, row: Row): Row {
  const id = text(row, "uuid"),
    pending = context.write.worldMutation?.sharedTimings?.find((value) => value.id === id);
  const record = pending
    ? {
        id,
        ownerUid: pending.owner,
        version: pending.version,
        dueAt: pending.dueAt,
        payload: Buffer.from(pending.payload),
      }
    : (context.write.worldMutation?.checkpoints?.find((value) => value.id === id) ??
      context.state.worldMutation?.checkpoints.find((value) => value.id === id) ??
      context.state.worldMutation?.sharedCheckpoints?.find((value) => value.id === id));

  if (!record) worldMutationFailure();

  const state = restore(record);

  if (
    state.id !== id ||
    state.owner !== row.ownerUid ||
    state.targetType !== 37 ||
    state.target !== num(row, "targetId") ||
    state.phase !== "gathering"
  )
    worldMutationFailure();

  return record;
}

function sharedCollected(state: RuntimeMarch, now: bigint) {
  const until = now < state.dueAt ? now : state.dueAt,
    elapsed = until > state.startedAt ? until - state.startedAt : 0n;

  return Math.max(
    0,
    Math.min(
      state.capacity,
      (state.gatheredBefore ?? 0) +
        Math.trunc(
          Math.fround(
            Math.fround(state.collectRate) * Math.fround(Math.fround(Number(elapsed)) / 1000),
          ),
        ),
    ),
  );
}

function sharedAvailable(context: CityProgressionContext, target: Row, now: bigint) {
  return Math.max(
    0,
    num(target, "resInitValue") -
      num(target, "resCostValue") -
      sharedMembers(context, num(target, "id")).reduce(
        (sum, row) => sum + sharedCollected(restore(sharedCheckpoint(context, row)), now),
        0,
      ),
  );
}

function rescheduleShared(context: CityProgressionContext, targetId: number, now: bigint) {
  const target = point(context, targetId),
    members = sharedMembers(context, targetId);

  if (num(target, "pointType") !== 37) worldMutationFailure();

  const records = members.map((row) => ({ row, record: sharedCheckpoint(context, row) })),
    states = records.map((value) => restore(value.record)),
    rate = states.reduce((sum, state) => Math.fround(sum + Math.fround(state.collectRate)), 0),
    available = Math.max(
      0,
      num(target, "resInitValue") -
        num(target, "resCostValue") -
        states.reduce((sum, state) => sum + sharedCollected(state, now), 0),
    ),
    depletion =
      rate > 0 ? now + BigInt(Math.max(0, Math.trunc(Math.fround(available / rate)))) * 1000n : now;

  for (const [index, state] of states.entries()) {
    const solo =
        state.startedAt +
        BigInt(
          Math.max(
            1,
            Math.ceil(
              Math.fround(
                Math.min(
                  num(target, "resInitValue") - num(target, "resCostValue"),
                  state.capacity,
                ) / Math.fround(state.collectRate),
              ) * 1000,
            ),
          ),
        ),
      calculated = solo < depletion ? solo : depletion,
      dueAt = state.dueAt <= now && state.dueAt < calculated ? state.dueAt : calculated;

    if (dueAt < state.startedAt) worldMutationFailure();

    if (state.dueAt === dueAt) continue;

    const updated = { ...state, dueAt, version: state.version + 1 },
      { row, record } = records[index]!;

    if (state.owner === context.owner) saveMarch(context, updated, row);
    else {
      const write = (context.write.worldMutation ??= {}),
        previous = write.sharedTimings?.find((value) => value.id === state.id);
      write.sharedTimings = [
        ...(write.sharedTimings ?? []).filter((value) => value.id !== state.id),
        {
          id: state.id,
          owner: state.owner,
          target: targetId,
          expectedVersion: previous?.expectedVersion ?? num(record, "version"),
          version: previous ? previous.version : state.version + 1,
          dueAt,
          payload: Buffer.from(
            checkpoint({ ...updated, version: previous ? previous.version : updated.version }),
          ),
        },
      ];
    }
  }

  target.monsterCurrHP = members.length;
  savePoint(context, target);
}

function sharedFullMail(context: CityProgressionContext) {
  const template = context.rules.mail.get("11666"),
    contents = javaMailBytes(template?.message);

  if (!template || !contents) worldMutationFailure();

  const write = (context.write.quests ??= {});
  write.mail = [
    ...(write.mail ?? []),
    {
      uid: randomUUID().replaceAll("-", "") + "00",
      owner: context.owner,
      fromName: template.sender ?? "",
      title: template.title ?? "",
      type: 2,
      contents,
      extra: null,
      rewardId: null,
      rewardStatus: 1,
      reply: 0,
      createTime: context.now,
    },
  ];
}

export function runtimeMarchView(context: CityProgressionContext, row: Row) {
  const map =
    num(row, "type") === 0 && num(row, "state") === 1 && num(row, "targetType") === 2
      ? treasureMapRoster(context).find(
          (map) => map.marchId === row.uuid && num(map, "state") === 1,
        )
      : undefined;

  if (map)
    row = {
      ...row,
      treasureMapTime: num(map, "time"),
      treasureMapFinishTime: long(map, "finishTime"),
    };

  const army = row.armyInfo ? decodeWorldMarchArmy(row.armyInfo as Buffer) : null;
  let collection: Fields = {};

  if (num(row, "targetType") === 3 && num(row, "state") === 1) {
    const id = text(row, "uuid"),
      record =
        context.write.worldMutation?.checkpoints?.find((entry) => entry.id === id) ??
        context.state.worldMutation?.checkpoints.find((entry) => entry.id === id);

    if (!record) worldMutationFailure();

    const state = restore(record),
      target = point(context, num(row, "targetId"));

    if (
      state.owner !== context.owner ||
      state.id !== id ||
      state.phase !== "gathering" ||
      state.targetType !== 3 ||
      state.target !== num(target, "id") ||
      target.ownerId !== context.owner ||
      target.ownerMarchUUid !== id
    )
      worldMutationFailure();

    collection = worldResourceOwner(
      resourceOwnerDetail(
        3,
        resourceRemaining(num(target, "resInitValue"), num(target, "resCostValue")),
        { ...resourceSavedCollection(row), armyLoad: state.capacity, maxCollectTime: 0n },
      ),
    );
  }

  return {
    ...reconnectMarchBase(row, army, context.rules, {
      serverId: context.rules.kingdomId,
      miracle: false,
      miracleState: undefined,
      resourceBattle: false,
      siege: false,
    }),
    ...marchCompanionFields(context, army),
    ...collection,
    ...(num(row, "targetType") === 37 && num(row, "state") === 1
      ? sharedResourceView(
          restore(sharedCheckpoint(context, row)),
          point(context, num(row, "targetId")),
        )
      : {}),
  };
}

function returnState(context: CityProgressionContext, state: RuntimeMarch, now: bigint) {
  if (state.phase === "outbound") {
    const elapsed = now - state.startedAt,
      remaining = state.dueAt - state.startedAt;
    const duration = elapsed > 0n ? (state.returnDuration * elapsed) / remaining : 1n;

    return {
      ...state,
      ...recallOutbound(state, context.owner, state.version, now, duration > 0n ? duration : 1n)
        .march,
    };
  }

  if (state.phase !== "gathering") worldMutationFailure();

  if (state.purpose === "treasure") {
    const target = point(context, state.target);

    if (target.ownerMarchUUid === state.id && target.ownerId === context.owner) {
      Object.assign(target, {
        pointType: 0,
        ownerId: "",
        ownerName: "",
        allianceId: "",
        ownerMarchUUid: "",
        startOccupyTime: 0n,
      });
      savePoint(context, target);
    }

    abandonTreasureExcavation(context, state);

    return {
      ...state,
      phase: "returning" as const,
      startedAt: now,
      dueAt: now + state.returnDuration,
      version: state.version + 1,
      cargo: null,
    };
  }

  const target = point(context, state.target),
    elapsed = now - state.startedAt;
  const maximum = Math.min(
    state.capacity,
    num(target, "resInitValue") - num(target, "resCostValue"),
  );
  const amount = Math.max(
    0,
    Math.min(
      maximum,
      (state.gatheredBefore ?? 0) +
        Math.trunc(Math.fround(state.collectRate * Math.fround(Number(elapsed) / 1000))),
    ),
  );
  const heroResource = [3, 0, 5, 2, 1].indexOf(state.targetResource);

  if (heroResource >= 0) context.recordHero(1, String(heroResource), amount, now);

  recordExpeditionScore(context, 1, state.targetResource, amount, now);
  recordTargetTask(context, 1, amount, String(state.targetResource), now);
  const shared = state.targetType === 37;

  if (shared) {
    if (num(target, "pointType") !== 37) worldMutationFailure();

    const extra = sharedResourceRewards(context, now - state.startedAt);
    state = { ...state, sharedReward: extra.reward, sharedRewardCounts: extra.counts };
    target.monsterCurrHP = sharedMembers(context, state.target).filter(
      (row) => row.uuid !== state.id,
    ).length;
  } else if (target.ownerMarchUUid !== state.id) worldMutationFailure();

  target.resCostValue = cityInteger(num(target, "resCostValue") + amount);
  target.ownerMarchUUid = "";
  target.ownerId = "";
  target.ownerName = "";
  target.allianceId = "";
  savePoint(context, target);
  const resources = ["wood", "stone", "iron", "food", "silver", "gold"] as const;
  const due = { ...state, dueAt: now };
  const returned = returnFromGathering(due, context.owner, state.version, now, {
    resource: resources[state.targetResource] ?? "wood",
    amount: BigInt(amount),
  }).march;

  return { ...state, ...returned };
}

export function recoverWorldMarches(
  context: CityProgressionContext,
  size = context.state.worldMutation?.mapSize ?? 1200,
  settleOutboundScouts = true,
) {
  const indexed = new Map(
    (context.state.worldMutation?.checkpoints ?? []).map((row) => [text(row, "id"), row]),
  );

  for (const row of context.write.worldMutation?.checkpoints ?? [])
    indexed.set(text(row, "id"), row);

  const records = [...indexed.values()].filter((row) => num(row, "status") === 0);
  const nativeScouts = marchRows(context).filter((row) => num(row, "type") === 1);

  if (nativeScouts.some((row) => !records.some((record) => record.id === row.uuid))) {
    const reserved = new Map<string, number>();

    for (const row of nativeScouts) {
      const army = row.armyInfo ? decodeWorldMarchArmy(row.armyInfo as Buffer) : null;

      if (!army || army.owner !== context.owner) worldMutationFailure();

      for (const unit of army.soldiers ?? []) {
        if (!unit.armsId || unit.owner !== context.owner || unit.dead !== 0) worldMutationFailure();

        reserved.set(
          unit.armsId,
          cityInteger((reserved.get(unit.armsId) ?? 0) + cityInteger(unit.total, 1), 1),
        );
      }
    }

    for (const [armyId, quantity] of reserved)
      if (
        !balances(context).some((balance) => balance.armyId === armyId && balance.march >= quantity)
      )
        worldMutationFailure();
  }

  for (const row of marchRows(context)) {
    if (records.some((record) => record.id === row.uuid)) continue;

    if (num(row, "type") === 1) {
      const army = row.armyInfo ? decodeWorldMarchArmy(row.armyInfo as Buffer) : null;

      if (
        !army ||
        army.owner !== context.owner ||
        (army.soldiers?.length ?? 0) > 128 ||
        ![0, 2].includes(num(row, "state"))
      )
        worldMutationFailure();

      const quantities = new Map<string, number>();

      for (const unit of army.soldiers ?? []) {
        if (unit.owner !== context.owner || unit.dead !== 0 || !unit.armsId) worldMutationFailure();

        quantities.set(
          unit.armsId,
          cityInteger((quantities.get(unit.armsId) ?? 0) + cityInteger(unit.total, 1), 1),
        );
      }

      const troops = [...quantities].map(([armyId, quantity]) => ({ armyId, quantity }));

      for (const unit of troops)
        if (
          !balances(context).some(
            (balance) => balance.armyId === unit.armyId && balance.march >= unit.quantity,
          )
        )
          worldMutationFailure();

      const savedSpeeds = decodeWorldMarchSpeedEffects(row.armyInfo as Buffer);
      const legacySpeed = (id: string) => {
        const effect = savedSpeeds?.get(id);

        if (effect === undefined) return scoutArmySpeed(context, id);

        const speed = Math.fround(
          Math.fround(
            Math.fround(Number(context.rules.arms.get(id)?.speed)) *
              Math.fround(Math.max(100 + effect, 20)),
          ) / 100,
        );

        if (!Number.isFinite(speed) || speed <= 0) worldMutationFailure();

        return speed;
      };
      const phase = num(row, "state") === 0 ? "outbound" : "returning";
      const startedAt =
        phase === "outbound" ? long(row, "marchStartTime") : long(row, "returnStartTime");
      const dueAt = long(row, "arrivalTime") || long(row, "marchArrivalTime");

      if (
        startedAt < 0n ||
        dueAt < startedAt ||
        startedAt > context.now ||
        dueAt - startedAt > 2147483647n ||
        text(row, "plunderRes")
      )
        worldMutationFailure();

      const state: RuntimeMarch = {
        purpose: "scout",
        id: text(row, "uuid"),
        owner: context.owner,
        worldId: 0,
        origin: num(row, "ownerId"),
        target: num(row, "targetId"),
        targetType: num(row, "targetType"),
        targetResource: 0,
        scoutHonour: num(row, "honourWatchtower") > 0,
        scoutTargetOwner: text(row, "targetUid"),
        version: 1,
        phase,
        startedAt,
        dueAt,
        returnDuration: BigInt(Math.max(1, num(row, "marchTime"))),
        troops,
        cargo: null,
        capacity: 0,
        collectRate: 0,
        marchSpeed: troops.length ? Math.min(...troops.map((unit) => legacySpeed(unit.armyId))) : 1,
        troopIds: Object.fromEntries(troops.map((unit) => [unit.armyId, unit.armyId])),
        segments: text(row, "blackLandMarchTime")
          ? JSON.parse(text(row, "blackLandMarchTime"))
          : [],
      };
      saveMarch(context, state, row);
      records.push(
        context.write.worldMutation!.checkpoints!.find((record) => record.id === state.id)!,
      );
      continue;
    }

    const treasure =
      num(row, "type") === 0 && num(row, "targetType") === 2 && num(row, "state") === 1
        ? treasureMapRoster(context).find(
            (map) =>
              map.marchId === row.uuid &&
              num(map, "state") === 1 &&
              num(map, "targetId") === num(row, "targetId"),
          )
        : undefined;

    if (num(row, "type") !== 0 || (![3, 37].includes(num(row, "targetType")) && !treasure))
      continue;

    const army = row.armyInfo ? decodeWorldMarchArmy(row.armyInfo as Buffer) : null;

    if (
      !army ||
      army.owner !== context.owner ||
      !army.soldiers?.length ||
      army.soldiers.some((unit) => unit.owner !== context.owner)
    )
      worldMutationFailure();

    const groupedTroops = new Map<string, number>();

    for (const unit of army.soldiers.filter((unit) => unit.total > unit.dead)) {
      const id = unit.armsId ?? "";
      groupedTroops.set(
        id,
        cityInteger((groupedTroops.get(id) ?? 0) + cityInteger(unit.total - unit.dead, 1), 1),
      );
    }

    const troops = [...groupedTroops].map(([armyId, quantity]) => ({ armyId, quantity }));

    for (const unit of troops)
      if (
        !balances(context).some(
          (balance) => balance.armyId === unit.armyId && balance.march >= unit.quantity,
        )
      )
        worldMutationFailure();

    if (treasure) {
      const target = point(context, num(row, "targetId"));

      if (
        target.ownerId !== context.owner ||
        target.ownerMarchUUid !== row.uuid ||
        num(target, "pointType") !== 2
      )
        worldMutationFailure();

      const rule = context.rules.world.heritage?.get(text(treasure, "treasureId"));

      if (!rule) worldMutationFailure();

      const state: RuntimeMarch = {
        purpose: "treasure",
        treasureUUID: text(treasure, "uuid"),
        treasureReward: pinProgressionReward(context, rule.reward!),
        id: text(row, "uuid"),
        owner: context.owner,
        worldId: 0,
        origin: num(row, "ownerId"),
        target: num(row, "targetId"),
        version: 1,
        phase: "gathering",
        startedAt: long(treasure, "startTime"),
        dueAt: long(treasure, "finishTime"),
        returnDuration: BigInt(Math.max(1, num(row, "marchTime"))),
        troops,
        cargo: null,
        capacity: 0,
        collectRate: 0,
        marchSpeed: 1,
        targetType: 2,
        targetResource: 0,
        troopIds: Object.fromEntries(troops.map((unit) => [unit.armyId, unit.armyId])),
      };
      saveMarch(context, state, row);
      records.push(
        context.write.worldMutation!.checkpoints!.find((record) => record.id === state.id)!,
      );
      continue;
    }

    const target = point(context, num(row, "targetId")),
      shared = num(row, "targetType") === 37,
      saved = text(row, "plunderRes")
        ? (JSON.parse(text(row, "plunderRes")) as { t?: number; r?: string; v: number }[])
        : [];

    if (
      !Array.isArray(saved) ||
      saved.length > 4096 ||
      saved.some((value) => value === null || typeof value !== "object" || Array.isArray(value))
    )
      worldMutationFailure();

    const resourceRows = saved.filter((value) => value.t !== undefined),
      rewardRows = saved.filter((value) => value.r !== undefined);

    if (
      resourceRows.length + rewardRows.length !== saved.length ||
      resourceRows.length > 1 ||
      (!shared && (saved.length > 1 || rewardRows.length)) ||
      (rewardRows.length && num(row, "state") !== 2)
    )
      worldMutationFailure();

    const resource = cityInteger(
        shared && num(row, "state") === 2 && resourceRows.length
          ? resourceRows[0]!.t
          : (target.pointItem ?? (shared && num(row, "state") === 2 ? 0 : undefined)),
        0,
        5,
      ),
      derivedLoad = !isMaintainedMarchArmy(row.armyInfo as Buffer) || army.cachedLoad <= 0,
      rawLoad = derivedLoad
        ? resourceRawArmyLoad(
            {
              cachedLoad: 0,
              residentOwner: true,
              soldiers: army.soldiers!.map((unit) => ({ ...unit, armsId: unit.armsId! })),
              effects: {
                worldLoad: context.effect(78),
                worldLoadAdd: context.effect(2196),
                general: 0,
                newGeneral: Math.fround(context.generalEffect(78)),
                expedition: 0,
              },
            },
            context.rules,
          )
        : cityInteger(army.cachedLoad, 1),
      capacity =
        shared || derivedLoad
          ? resourceArmyLoad(
              {
                rawArmyLoad: rawLoad,
                pointType: num(row, "targetType"),
                pointItem: String(resource),
                plunder: [],
              },
              context.rules,
            )
          : rawLoad,
      phase =
        num(row, "state") === 0
          ? "outbound"
          : num(row, "state") === 1
            ? "gathering"
            : num(row, "state") === 2
              ? "returning"
              : undefined;
    let rate = Number(row.collectSpd ?? 0);

    if (phase === "outbound" && rate === 0) {
      const castle = context.state.buildings.find((row) => num(row, "itemId") === 400000);

      if (!castle) worldMutationFailure();

      const effect =
        resource === 5
          ? context.effect(79)
          : context.effect(65) +
            context.effect(1165) +
            context.effect(300) +
            context.effect(308) +
            context.effect(2195) +
            context.effect([153, 156, 155, 154][resource] ?? 65);
      rate = resourceGatherRate(context.rules, resource, num(castle, "level"), effect, shared);
    }

    if (!phase || !Number.isFinite(rate) || rate < 0 || (rate === 0 && phase !== "returning"))
      worldMutationFailure();

    const start =
        phase === "outbound"
          ? long(row, "marchStartTime")
          : phase === "gathering"
            ? long(row, "changeCollectSpdTime") || long(row, "marchArrivalTime")
            : long(row, "returnStartTime"),
      returnDuration = BigInt(Math.max(1, num(row, "marchTime"))),
      gatheredBefore = phase === "gathering" ? cityInteger(long(row, "collectedBeforeSpd")) : 0,
      limit = Math.max(
        0,
        Math.min(capacity, num(target, "resInitValue") - num(target, "resCostValue")) -
          gatheredBefore,
      ),
      dueAt =
        phase === "gathering"
          ? start + BigInt(Math.max(1, Math.ceil((limit / rate) * 1000)))
          : long(row, "arrivalTime") || long(row, "marchArrivalTime");
    let cargo: RuntimeMarch["cargo"] = null;

    if (resourceRows.length) {
      if (resourceRows[0]!.t !== resource) worldMutationFailure();

      cargo = {
        resource: (["wood", "stone", "iron", "food", "silver", "gold"] as const)[resource]!,
        amount: cityAmount(resourceRows[0]!.v),
      };
    }

    const sharedRewardCounts = rewardRows.map((value) => ({
        id: value.r!,
        count: cityInteger(value.v, 1),
      })),
      sharedReward = sharedRewardCounts.length
        ? pinStoredSharedResourceRewards(context, sharedRewardCounts)
        : undefined;
    const state: RuntimeMarch = {
      ...(sharedReward !== undefined ? { sharedReward, sharedRewardCounts } : {}),
      id: text(row, "uuid"),
      owner: context.owner,
      worldId: 0,
      origin: num(row, "ownerId"),
      target: num(row, "targetId"),
      version: 1,
      phase,
      startedAt: start,
      dueAt,
      returnDuration,
      troops,
      cargo,
      capacity,
      collectRate: rate,
      marchSpeed: 1,
      targetType: num(row, "targetType"),
      targetResource: resource,
      troopIds: Object.fromEntries(troops.map((unit) => [unit.armyId, unit.armyId])),
      gatheredBefore,
      segments: text(row, "blackLandMarchTime") ? JSON.parse(text(row, "blackLandMarchTime")) : [],
    };
    saveMarch(context, state, row);
    records.push({
      id: state.id,
      ownerUid: context.owner,
      version: 1,
      dueAt,
      payload: Buffer.from(checkpoint(state)),
    });
  }

  for (const record of records) {
    let state = restore(record);

    if (state.owner !== context.owner) worldMutationFailure();

    let original = marchRows(context).find((row) => row.uuid === state.id);

    if (!original) worldMutationFailure();

    if (!settleOutboundScouts && state.purpose === "scout" && state.phase === "outbound") continue;

    let changed = false;

    for (
      let guard = 0;
      guard < 4 && state.dueAt <= context.now && state.phase !== "completed";
      guard++
    ) {
      if (state.phase === "outbound") {
        const target = point(context, state.target);

        if (state.purpose === "scout") {
          state = scoutArrival(context, state, scoutTarget(context, state.target), size);
        } else if (state.purpose === "treasure") {
          const excavation = startTreasureExcavation(context, state, target, original);

          if (!excavation) {
            state = {
              ...state,
              phase: "returning",
              startedAt: state.dueAt,
              dueAt: state.dueAt + state.returnDuration,
              version: state.version + 1,
            };
          } else {
            state = {
              ...state,
              ...arriveForGathering(
                state,
                context.owner,
                state.version,
                context.now,
                excavation.duration,
              ).march,
              targetType: 2,
              treasureReward: excavation.reward,
            };
            Object.assign(target, {
              pointType: 2,
              ownerId: context.owner,
              ownerName: text(context.state.profile, "name"),
              allianceId: text(context.state.profile, "allianceId"),
              ownerMarchUUid: state.id,
              startOccupyTime: state.startedAt,
            });
            savePoint(context, target);
            original = { ...original, targetType: 2, marchArrivalTime: state.startedAt };
          }
        } else if (state.purpose === "trouble") {
          troubleItem(context.rules, state.troubleItem!);

          if (num(original, "type") !== 13 || state.targetType !== 1) worldMutationFailure();

          if (
            num(target, "pointType") === 1 &&
            text(target, "ownerId") &&
            text(target, "ownerId") === text(original, "targetUid")
          ) {
            const write = (context.write.worldMutation ??= {});
            write.troubleDeliveries = [
              ...(write.troubleDeliveries ?? []),
              {
                march: state.id,
                sender: context.owner,
                username: text(context.state.profile, "name"),
                target: text(target, "ownerId"),
                point: state.target,
                item: state.troubleItem!,
                at: context.now,
              },
            ];
          }

          state = {
            ...state,
            phase: "returning",
            startedAt: state.dueAt,
            dueAt: state.dueAt + state.returnDuration,
            version: state.version + 1,
          };
        } else if (state.targetType === 37) {
          const members = sharedMembers(context, state.target),
            full = num(target, "pointType") === 37 && members.length >= num(target, "resLevel");

          if (
            num(target, "pointType") !== 37 ||
            full ||
            members.some((row) => row.ownerUid === context.owner) ||
            sharedAvailable(context, target, context.now) <= 0
          ) {
            if (full) sharedFullMail(context);

            state = {
              ...state,
              phase: "returning",
              startedAt: state.dueAt,
              dueAt: state.dueAt + state.returnDuration,
              version: state.version + 1,
            };
          } else {
            const limit = Math.min(
                state.capacity,
                num(target, "resInitValue") - num(target, "resCostValue"),
              ),
              duration = BigInt(Math.max(1, Math.ceil((limit / state.collectRate) * 1000)));
            state = {
              ...state,
              ...arriveForGathering(state, context.owner, state.version, context.now, duration)
                .march,
            };
            original = {
              ...original,
              marchArrivalTime: state.startedAt,
              changeCollectSpdTime: state.startedAt,
              collectedBeforeSpd: 0n,
            };
            saveMarch(context, state, original);
            rescheduleShared(context, state.target, context.now);
            state = restore(
              context.write.worldMutation!.checkpoints!.find((row) => row.id === state.id)!,
            );
            const write = (context.write.worldMutation ??= {});
            write.companionPushes = [
              ...(write.companionPushes ?? []),
              {
                command: "push.world.march.win",
                body: encode({
                  uuid: sfs.string(state.id),
                  o: sfs.string(text(context.state.profile, "name")),
                  ...sharedResourceView(state, target),
                }),
              },
            ];
          }
        } else if (
          num(target, "pointType") !== 3 ||
          text(target, "ownerMarchUUid") ||
          num(target, "resInitValue") <= num(target, "resCostValue")
        ) {
          state = {
            ...state,
            phase: "returning",
            startedAt: state.dueAt,
            dueAt: state.dueAt + state.returnDuration,
            version: state.version + 1,
          };
        } else {
          const limit = Math.min(
              state.capacity,
              num(target, "resInitValue") - num(target, "resCostValue"),
            ),
            duration = BigInt(Math.max(1, Math.ceil((limit / state.collectRate) * 1000)));
          state = {
            ...state,
            ...arriveForGathering(state, context.owner, state.version, context.now, duration).march,
          };
          Object.assign(target, {
            ownerId: context.owner,
            ownerName: text(context.state.profile, "name"),
            allianceId: text(context.state.profile, "allianceId"),
            ownerMarchUUid: state.id,
            startOccupyTime: state.startedAt,
          });
          savePoint(context, target);
          original = {
            ...original,
            marchArrivalTime: state.startedAt,
            changeCollectSpdTime: state.startedAt,
            collectedBeforeSpd: 0n,
          };
        }
      } else if (state.phase === "gathering") {
        if (state.purpose === "treasure") finishTreasureExcavation(context, state);

        state = returnState(context, state, state.dueAt);

        if (state.targetType === 37) {
          saveMarch(context, state, original);
          rescheduleShared(context, state.target, context.now);
        }
      } else {
        const result = completeMarchReturn(
          state,
          context.owner,
          state.version,
          context.now,
          balances(context),
        );
        writeBalances(context, result.troops);

        if (state.sharedReward) grantPinnedProgressionReward(context, state.sharedReward);

        if (result.credit?.amount) {
          if (result.credit.resource === "gold") context.economy.gold(result.credit.amount);
          else context.economy.resource(result.credit.resource, result.credit.amount);
        }

        state = { ...state, ...result.march };
      }

      changed = true;
    }

    if (changed) saveMarch(context, state, original);
  }
}

export const worldMutationCommands = [
  "world.tick",
  "resource.new.detail",
  "world.march",
  "world.march.check",
  "world.march.retreat",
  "world.march.spd",
  "world.user.march",
  "common.res.syn",
  "world.get.march",
  "world.mv",
  "world.mv.gold",
];

export class WorldMarchDomain extends CityCommandDomain {
  public readonly commands: CityDomain["commands"];
  public readonly types: CityDomain["types"];
  public readonly prepare: CityDomain["prepare"];
  public readonly apply: CityDomain["apply"];

  public constructor(size: number) {
    super();

    this.commands = worldMutationCommands;

    this.types = [];

    this.prepare = async (context, command, params) => {
      if (!context.state.worldMutation) worldMutationFailure();

      if (
        command !== "world.tick" &&
        command !== "resource.new.detail" &&
        !serverFeature(context.rules, "world_march", {
          kingdomId: context.rules.kingdomId,
          version: "12.06.0",
          now: Number(context.now),
        })
      )
        worldMutationFailure();

      if (command === "world.march.check") {
        const state = context.state.worldMutation,
          targetId = cityInteger(int(params, "point"), 1, size * size),
          target = state.points.find((row) => num(row, "id") === targetId),
          trouble = int(params, "type", 0) === 13;

        if (!target) worldMutationFailure();

        if (trouble) {
          const item = context.economy.ownedItem?.(str(params, "itemUuid"));

          if (
            !item ||
            item.count < 1 ||
            num(target, "pointType") !== 1 ||
            !text(target, "ownerId") ||
            text(target, "ownerId") === context.owner
          )
            worldMutationFailure();

          troubleItem(context.rules, item.itemId);
        } else if (![0, 2, 3, 37, 60, 63].includes(num(target, "pointType")))
          worldMutationFailure();

        const want = int(params, "wantToFight", -1),
          count = state.targetMarchCount ?? 0;

        if ((want === 0 && count > 0) || ((want === 1 || want === 2) && count <= 0))
          throw new GameError(
            int(params, "cityType", 0) === 3
              ? errors.worldResourceChanged
              : errors.worldTargetChanged,
            "world_state",
          );

        const origin = state.points.find((row) => num(row, "id") === num(state.world, "pointId"));
        const occupied = Boolean(text(target, "ownerId") || text(target, "ownerName"));

        return {
          response: encode(
            worldMarchCheck({
              needBreakShield: Boolean(
                !trouble &&
                Boolean(origin) &&
                long(origin!, "shieldTime") > context.now &&
                occupied &&
                target.ownerId != null &&
                target.ownerId !== context.owner,
              ),
            }),
          ),
          event: null,
        };
      }

      recoverWorldMarches(context, size, command !== "world.march.retreat");
      const push = () => worldMarchMutationEvent(context, params);
      const reply = (body: Fields, event = true) => ({
        response: encode(body),
        event: event || Boolean(context.write.worldMutation) ? encode(push()) : null,
      });

      if (command === "world.tick") return reply({}, Boolean(context.write.worldMutation));

      if (command === "common.res.syn") {
        const id = str(params, "uuid"),
          row = marchRows(context).find((entry) => entry.uuid === id);

        if (
          !row ||
          row.ownerUid !== context.owner ||
          num(row, "type") !== 0 ||
          ![3, 37].includes(num(row, "targetType"))
        )
          worldMutationFailure();

        return reply(
          {
            ...runtimeMarchView(context, row),
            soldiers: sfs.array(
              (context.write.armies ?? context.state.armies).map((unit) =>
                sfs.object({
                  id: sfs.string(text(unit, "armyId")),
                  free: sfs.int(num(unit, "free")),
                  march: sfs.int(num(unit, "march")),
                }),
              ),
            ),
          },
          false,
        );
      }

      if (command === "resource.new.detail") {
        const target = point(context, cityInteger(int(params, "point"), 1, size * size));

        if (num(target, "pointType") !== 37) worldMutationFailure();

        const members = sharedMembers(context, num(target, "id"));

        if (num(target, "monsterCurrHP") !== members.length) {
          target.monsterCurrHP = members.length;
          savePoint(context, target);
        }

        return reply(
          {
            existMember: sfs.int(members.length),
            maxMember: sfs.int(num(target, "resLevel")),
            army: sfs.array(members.map((row) => sfs.object(sharedMemberView(context, row)))),
          },
          false,
        );
      }

      if (command === "world.user.march")
        return reply(
          {
            m: sfs.array(
              marchRows(context).map((row) => sfs.object(runtimeMarchView(context, row))),
            ),
            army: sfs.array(
              (context.write.armies ?? context.state.armies).map((row) =>
                sfs.object(armySnapshot(row, context.rules)),
              ),
            ),
          },
          false,
        );

      if (command === "world.get.march") {
        if (str(params, "uid", context.owner) !== context.owner) worldMutationFailure();

        const id = str(params, "uuid"),
          row = marchRows(context).find((row) => row.uuid === id),
          record =
            context.write.worldMutation?.checkpoints?.find((row) => row.id === id) ??
            context.state.worldMutation.checkpoints.find((row) => row.id === id);

        if (!row || !record) worldMutationFailure();

        const state = restore(record);

        return reply(
          worldMarchDetail(row, context.state.armies, state.dueAt, state.capacity),
          false,
        );
      }

      if (command === "world.march") {
        const targetId = cityInteger(int(params, "point"), 1, size * size),
          target = point(context, targetId),
          world = context.state.worldMutation.world,
          shared = num(target, "pointType") === 37,
          scout = int(params, "type") === 1,
          scouting = scout ? scoutDeparture(context, targetId) : undefined,
          trouble = int(params, "type") === 13,
          selectedItem = trouble ? context.economy.ownedItem?.(str(params, "itemUuid")) : undefined,
          treasure =
            !trouble && int(params, "type") === 0 && treasureMapFree(target)
              ? treasureMapRoster(context).find(
                  (row) => num(row, "targetId") === targetId && num(row, "state") === 0,
                )
              : undefined;

        if (trouble) {
          if (!selectedItem || selectedItem.count < 1) worldMutationFailure();

          troubleItem(context.rules, selectedItem.itemId);
        }

        if (
          num(target, "worldId") !== 0 ||
          (trouble
            ? num(target, "pointType") !== 1 ||
              !text(target, "ownerId") ||
              text(target, "ownerId") === context.owner
            : scout
              ? false
              : int(params, "type") !== 0 ||
                (!treasure && ![3, 37].includes(num(target, "pointType"))) ||
                (!shared && Boolean(text(target, "ownerMarchUUid") || text(target, "ownerId"))) ||
                (!treasure && num(target, "resInitValue") <= num(target, "resCostValue")))
        )
          worldMutationFailure();

        const companions = selectMarchCompanions(context, params, marchRows(context));

        if (
          marchRows(context).length >=
          Math.max(
            1,
            1 + Math.trunc(context.effect(55)) + (scout ? scoutExpeditionEffect(context, 908) : 0),
          )
        )
          worldMutationFailure();

        const soldiers = params.soldiers ? fields(params.soldiers) : {},
          troops: { armyId: string; quantity: number }[] = [],
          troopIds: Record<string, string> = {},
          army: SavedMarchArmy = {
            owner: context.owner,
            cachedLoad: 0,
            soldiers: [],
            dragons: [],
            general: null,
          };
        let marchSpeed = Number.POSITIVE_INFINITY,
          total = 0;

        for (const [id, value] of Object.entries(soldiers)) {
          const quantity = cityInteger(int({ value }, "value"), 1),
            owned = context.state.armies.find((row) => row.armyId === id),
            rule = context.rules.arms.get(id);

          if (!owned || !rule || num(owned, "free") < quantity || troops.length >= 128)
            worldMutationFailure();

          troops.push({ armyId: id, quantity });
          troopIds[id] = id;
          total += quantity;
          marchSpeed = Math.min(
            marchSpeed,
            scout ? scoutArmySpeed(context, id) : Math.fround(Number(rule.speed)),
          );
          army.soldiers!.push({
            owner: context.owner,
            armsId: id,
            total: quantity,
            dead: 0,
            loadEffect: 0,
            basicArm: null,
            level: num(owned, "level"),
          });
        }

        const castle = context.state.buildings.find((row) => num(row, "itemId") === 400000);

        if (!castle) worldMutationFailure();

        const max = scout
          ? scoutSoldierLimit(context)
          : Number(
              context.rules
                .building("400000", num(castle, "level"))
                .clientParameters?.[0]?.value.split(";")[0] ?? 0,
            ) + context.effect(56);

        if ((!troops.length && !trouble && !scout) || total > max) worldMutationFailure();

        if (!troops.length) marchSpeed = 1;

        const resource = scout || trouble || treasure ? 0 : cityInteger(target.pointItem, 0, 5);
        const raw = resourceRawArmyLoad(
          {
            cachedLoad: 0,
            residentOwner: true,
            soldiers: army.soldiers!.map((row) => ({ ...row, armsId: row.armsId! })),
            effects: {
              worldLoad: context.effect(78),
              worldLoadAdd: context.effect(2196),
              general: 0,
              newGeneral: 0,
              expedition: 0,
            },
          },
          context.rules,
        );
        const capacity =
          scout || trouble || treasure
            ? 0
            : resourceArmyLoad(
                { rawArmyLoad: raw, pointType: 3, pointItem: String(resource), plunder: [] },
                context.rules,
              );
        army.cachedLoad = shared ? raw : capacity;
        const sourceFootprint = context.state.worldMutation.cityFootprint;

        if (!sourceFootprint) worldMutationFailure();

        const targetFootprint = trouble
          ? resolveWorldCityGeometry(
              targetId,
              size,
              text(target, "ownerId"),
              context.state.worldMutation.points,
            )?.points
          : undefined;

        if (trouble && !targetFootprint) worldMutationFailure();

        const route = scout
          ? scoutRoute(context, scouting!.target, size, marchSpeed)
          : ordinaryMarchRoute(
              context.rules,
              size,
              num(world, "pointId"),
              targetId,
              marchSpeed,
              trouble
                ? context.effect(401) + troubleDetectSpeed(context) + context.effect(402)
                : context.effect(60) + context.effect(97) + context.effect(2193),
              true,
              trouble,
              trouble ? 0 : context.effect(402),
              trouble,
              sourceFootprint,
              targetFootprint,
            );
        const duration = route.duration;
        const gatherEffect =
          resource === 5
            ? context.effect(79)
            : context.effect(65) +
              context.effect(1165) +
              context.effect(300) +
              context.effect(308) +
              context.effect(2195) +
              context.effect([153, 156, 155, 154][resource] ?? 65);
        const collectRate =
          scout || trouble || treasure
            ? 0
            : resourceGatherRate(
                context.rules,
                resource,
                num(castle, "level"),
                gatherEffect,
                shared,
              );
        const reserved = reserveMarch(
          {
            ...(scout
              ? { purpose: "scout" as const }
              : trouble
                ? { purpose: "trouble" as const }
                : treasure
                  ? { purpose: "treasure" as const }
                  : {}),
            id: randomUUID(),
            owner: context.owner,
            worldId: 0,
            origin: num(world, "pointId"),
            target: targetId,
            startedAt: context.now,
            dueAt: context.now + duration,
            returnDuration: duration,
            troops,
          },
          balances(context),
        );

        if (trouble) {
          if (!context.economy.consumeItem) worldMutationFailure();

          context.economy.consumeItem(str(params, "itemUuid"), 1);
          const write = (context.write.worldMutation ??= {});
          write.companionPushes = [
            ...(write.companionPushes ?? []),
            {
              command: "push.item.del",
              body: encode({
                uuid: sfs.string(str(params, "itemUuid")),
                itemId: sfs.string(selectedItem!.itemId),
                count: sfs.int(selectedItem!.count - 1),
              }),
            },
          ];
        }

        if (scout) scoutDepartureProgress(context);

        attachMarchCompanions(context, army, companions);
        const state: RuntimeMarch = {
          ...reserved.march,
          ...(scout
            ? { scoutHonour: scouting!.honour, scoutTargetOwner: text(target, "ownerId") }
            : trouble
              ? { troubleItem: selectedItem!.itemId }
              : treasure
                ? { treasureUUID: text(treasure, "uuid") }
                : {}),
          capacity,
          collectRate,
          marchSpeed,
          targetType: scout
            ? num(target, "pointType")
            : trouble
              ? 1
              : treasure
                ? 0
                : shared
                  ? 37
                  : 3,
          targetResource: resource,
          troopIds,
          segments: route.segments,
        };
        const row: Row = {
          uuid: state.id,
          ownerUid: context.owner,
          ownerId: state.origin,
          ownerName: text(context.state.profile, "name"),
          ownerColor: num(world, "color"),
          allianceId: text(context.state.profile, "allianceId"),
          targetId,
          targetType: scout
            ? num(target, "pointType")
            : trouble
              ? 1
              : treasure
                ? 0
                : shared
                  ? 37
                  : 3,
          targetUid: scout || trouble ? text(target, "ownerId") : "",
          type: scout ? 1 : trouble ? 13 : 0,
          honourWatchtower: scouting?.honour ? 1 : 0,
          slowDown:
            scout &&
            num(target, "pointType") === 1 &&
            context.foreignEffect?.(scouting!.target.participant!.effects, 37) !== 0
              ? 1
              : 0,
          state: 0,
          worldId: 0,
          marchStartTime: context.now,
          marchArrivalTime: state.dueAt,
          arrivalTime: state.dueAt,
          returnStartTime: 0n,
          marchTime: Number(duration),
          armyInfo: encodeWorldMarchArmy(army),
          resLevel: num(target, "resLevel"),
        };
        writeBalances(context, reserved.troops);
        saveMarch(context, state, row);

        return reply(
          runtimeMarchView(
            context,
            marchRows(context).find((row) => row.uuid === state.id)!,
          ),
        );
      }

      if (command === "world.mv" || command === "world.mv.gold") {
        const random = int(params, "point") === 0;

        if (random && marchRows(context).length) worldMutationFailure();

        let randomPoint: number | undefined;

        if (random) {
          if (!context.birthPoint) worldMutationFailure();

          const placement = await context.birthPoint(worldBirthRules(context.rules), "random");
          randomPoint = placement.point;

          for (const row of placement.points) savePoint(context, row);
        }

        const target = cityInteger(random ? randomPoint : int(params, "point"), 1, size * size),
          world = context.state.worldMutation.world,
          source = num(world, "pointId"),
          destination = worldFootprint(target, size),
          original = context.state.worldMutation.cityFootprint;

        if (!original) worldMutationFailure();

        if (destination.some((id) => original.includes(id))) worldMutationFailure();

        for (const id of destination) {
          const row = point(context, id);

          if (
            num(row, "pointType") !== 0 ||
            num(row, "gridType") !== 2 ||
            num(row, "grid2Type") !== 0 ||
            text(row, "ownerId") ||
            text(row, "ownerMarchUUid")
          )
            worldMutationFailure();
        }

        if (command === "world.mv.gold")
          context.economy.gold(
            -cityAmount(context.rules.goods.get(random ? "200001" : "200002")?.price),
          );
        else {
          const item = context.economy.ownedItem?.(str(params, "itemUUid"));

          if (
            !item ||
            !(random ? ["200001"] : ["200002", "200005", "200009"]).includes(item.itemId)
          )
            worldMutationFailure();

          context.spendItem(item.itemId, 1);
        }

        const city = point(context, source);

        for (const id of original) {
          const row = point(context, id);

          if (
            row.ownerId !== context.owner &&
            !(id !== source && num(row, "pointType") === 8 && !text(row, "ownerId"))
          )
            worldMutationFailure();

          Object.assign(row, {
            pointType: 0,
            pointItem: null,
            sendHeartDurationTime: 0n,
            heartType: "",
            ownerId: "",
            ownerName: "",
            allianceId: "",
            ownerMarchUUid: "",
          });
          savePoint(context, row);
        }

        for (const id of destination) {
          const row = point(context, id);
          Object.assign(row, {
            pointType: id === target ? 1 : 8,
            pointItem: id === target ? null : String(target),
            sendHeartDurationTime: 0n,
            heartType: "",
            ownerId: context.owner,
            ownerName: text(context.state.profile, "name"),
            allianceId: text(context.state.profile, "allianceId"),
            ownerMarchUUid: "",
            resLevel: num(city, "resLevel"),
            shieldTime: long(city, "shieldTime"),
            cityDefValue: num(city, "cityDefValue"),
          });
          savePoint(context, row);
        }

        relocateWorldMarches(context, target);
        (context.write.worldMutation ??= {}).world = {
          ...world,
          pointId: target,
          lastMoveCityTime: context.now,
        };

        return reply({
          pointId: sfs.int(target),
          point: sfs.int(target),
          dstPoint: sfs.int(target),
          remainGold: sfs.long(context.balance("gold")),
          moveCityTime: sfs.long(context.now),
          gold: sfs.long(context.balance("gold")),
        });
      }

      const id = str(params, "uuid"),
        record =
          context.write.worldMutation?.checkpoints?.find((row) => row.id === id) ??
          context.state.worldMutation.checkpoints.find((row) => row.id === id),
        row = marchRows(context).find((row) => row.uuid === id);

      if (!record || !row) worldMutationFailure();

      let state = restore(record);

      if (params.version && cityInteger(int(params, "version"), 1) !== state.version)
        worldMutationFailure();

      if (command === "world.march.spd") {
        const item = context.economy.ownedItem?.(str(params, "itemUUid"));

        if (!item) worldMutationFailure();

        const rule = context.rules.goods.get(item.itemId);

        if (rule?.type !== "2" || rule.para1 !== "2" || rule.para2 !== "2") worldMutationFailure();

        state = {
          ...state,
          ...accelerateMarch(
            state,
            context.owner,
            state.version,
            context.now,
            cityInteger(rule.para3, 1, 100),
          ).march,
        };

        if (state.segments?.length) {
          const start =
            state.phase === "returning" && state.startedAt < long(row, "marchArrivalTime")
              ? 2n * state.startedAt - long(row, "marchArrivalTime")
              : state.startedAt;
          const route = accelerateMarchSegments(
            state.segments,
            start,
            context.now,
            cityInteger(rule.para3, 1, 100),
          );

          if (state.phase === "outbound" && route.remaining < 1500n) worldMutationFailure();

          state = { ...state, segments: route.segments, dueAt: context.now + route.remaining };
        }

        context.spendItem(item.itemId, 1);
      } else if (command === "world.march.retreat") {
        if (state.phase === "outbound") context.spendItem("200004", 1);

        state = returnState(context, state, context.now);
      } else worldMutationFailure();

      saveMarch(context, state, row);

      if (command === "world.march.retreat" && state.targetType === 37)
        rescheduleShared(context, state.target, context.now);

      return reply(
        runtimeMarchView(
          context,
          marchRows(context).find((row) => row.uuid === id)!,
        ),
      );
    };

    this.apply = async () => {
      worldMutationFailure();
    };
  }
}

export function createWorldMarchDomain(size: number): CityDomain {
  return new WorldMarchDomain(size);
}

export function worldMarchMutationEvent(context: CityProgressionContext, params: Fields): Fields {
  return {
    troubles: sfs.array(
      (context.write.worldMutation?.troubleDeliveries ?? []).map((row) =>
        sfs.object({
          march: sfs.string(row.march),
          sender: sfs.string(row.sender),
          username: sfs.string(row.username),
          target: sfs.string(row.target),
          point: sfs.int(row.point),
          item: sfs.string(row.item),
          at: sfs.long(row.at),
        }),
      ),
    ),
    ownerPushes: sfs.array(
      marchCompanionPushes(context).map((push) =>
        sfs.object({
          command: sfs.string(push.command),
          body: sfs.object(decode(Buffer.from(push.body))),
        }),
      ),
    ),
    owner: sfs.string(context.owner),
    origin: sfs.int(num(context.state.worldMutation!.world, "pointId")),
    marches: sfs.array(marchRows(context).map((row) => sfs.object(runtimeMarchView(context, row)))),
    points: sfs.array(
      (context.write.worldMutation?.points ?? []).map((row) =>
        sfs.object({
          id: sfs.int(num(row, "id")),
          owner: sfs.string(text(row, "ownerId")),
          name: sfs.string(text(row, "ownerName")),
          level: sfs.int(num(row, "resLevel")),
          shield: sfs.long(long(row, "shieldTime")),
          pointType: sfs.int(num(row, "pointType")),
        }),
      ),
    ),
    deleted: sfs.array(
      (context.write.worldMutation?.deletedMarches ?? []).map((id) => sfs.string(id)),
    ),
    target: sfs.int(int(params, "point", 0)),
  };
}

export function speedTreasureMarch(context: CityProgressionContext, id: string) {
  recoverWorldMarches(context);
  const record =
      context.write.worldMutation?.checkpoints?.find((row) => row.id === id) ??
      context.state.worldMutation?.checkpoints.find((row) => row.id === id),
    original = marchRows(context).find((row) => row.uuid === id);

  if (!record || !original) worldMutationFailure();

  const state = restore(record),
    map = treasureMapRoster(context).find(
      (row) => row.uuid === state.treasureUUID && row.marchId === id && num(row, "state") === 1,
    );

  if (
    state.purpose !== "treasure" ||
    state.phase !== "gathering" ||
    !map ||
    state.dueAt <= context.now
  )
    worldMutationFailure();

  context.economy.gold(-citySpeedGold(context.rules, state.dueAt - context.now));
  writeTreasureMap(context, { ...map, finishTime: context.now });
  saveMarch(context, { ...state, dueAt: context.now, version: state.version + 1 }, original);
  recoverWorldMarches(context);

  return context.balance("gold");
}

export function relocateWorldMarches(context: CityProgressionContext, target: number) {
  for (const row of marchRows(context)) {
    const id = text(row, "uuid"),
      record =
        context.write.worldMutation?.checkpoints?.find((row) => row.id === id) ??
        context.state.worldMutation?.checkpoints.find((row) => row.id === id);

    if (!record) worldMutationFailure();

    let state = restore(record);

    if (state.phase !== "returning") state = returnState(context, state, context.now);
    else state = { ...state, version: state.version + 1 };

    state = {
      ...state,
      origin: target,
      phase: "returning",
      startedAt: context.now,
      dueAt: context.now + 1n,
      returnDuration: 1n,
      segments: [],
    };
    saveMarch(context, state, { ...row, ownerId: target });

    if (state.targetType === 37) rescheduleShared(context, state.target, context.now);
  }
}
