import {
  selectMarchCompanions,
  attachMarchCompanions,
  releaseMarchCompanions,
  marchCompanionFields,
  marchCompanionPushes,
} from "./world-march-companions";
import { recordExpeditionScore } from "./new-expedition";
import { worldMarchDetail } from "@opencok/mappings/world-march-runtime";
import { armySnapshot } from "@opencok/mappings/bootstrap";
import { randomUUID } from "node:crypto";
import { encode, decode, sfs, str, int, fields, Type, type Fields } from "@opencok/messages/sfs";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import {
  encodeWorldMarchArmy,
  decodeWorldMarchArmy,
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
import { cityInteger, cityAmount } from "@opencok/rules/city-progression";
import { resourceRawArmyLoad, resourceArmyLoad } from "@opencok/rules/world-resource-detail";
import { reconnectMarchBase } from "@opencok/mappings/reconnect-marches";
import { serverFeature } from "@opencok/rules/power-context";
import type { CityDomain, CityProgressionContext } from "./city-progression";

function checkpoint(state: RuntimeMarch) {
  return encode({
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
  const state: RuntimeMarch = {
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
    arrivalTime: state.phase === "gathering" ? long(original, "arrivalTime") : state.dueAt,
    collectSpd: state.collectRate,
    blackLandMarchTime: state.segments?.length ? JSON.stringify(state.segments) : "",
    plunderRes: state.cargo
      ? JSON.stringify([{ t: state.targetResource, v: Number(state.cargo.amount) }])
      : "",
    ...(state.phase === "outbound" ? { marchArrivalTime: state.dueAt } : {}),
    ...(state.phase === "returning" ? { returnStartTime: state.startedAt } : {}),
    marchTime:
      state.phase === "gathering"
        ? num(original, "marchTime")
        : cityInteger(state.dueAt - state.startedAt),
  };
  write.marches = [...(write.marches ?? []).filter((prior) => prior.uuid !== state.id), row];
}
export function runtimeMarchView(context: CityProgressionContext, row: Row) {
  const army = row.armyInfo ? decodeWorldMarchArmy(row.armyInfo as Buffer) : null;
  return {
    ...reconnectMarchBase(row, army, context.rules, {
      serverId: context.rules.kingdomId,
      miracle: false,
      miracleState: undefined,
      resourceBattle: false,
      siege: false,
    }),
    ...marchCompanionFields(context, army),
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
  recordExpeditionScore(context, 1, state.targetResource, amount, now);
  if (target.ownerMarchUUid !== state.id) worldMutationFailure();
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
function recover(context: CityProgressionContext) {
  const records = [...(context.state.worldMutation?.checkpoints ?? [])];
  for (const row of context.state.worldMutation?.marches ?? []) {
    if (records.some((record) => record.id === row.uuid)) continue;
    if (num(row, "type") !== 0 || num(row, "targetType") !== 3) continue;
    const army = row.armyInfo ? decodeWorldMarchArmy(row.armyInfo as Buffer) : null;
    if (!army || army.owner !== context.owner || !army.soldiers?.length) worldMutationFailure();
    const troops = army.soldiers
      .filter((unit) => unit.total > unit.dead)
      .map((unit) => ({
        armyId: unit.armsId ?? "",
        quantity: cityInteger(unit.total - unit.dead, 1),
      }));
    for (const unit of troops)
      if (
        !balances(context).some(
          (balance) => balance.armyId === unit.armyId && balance.march >= unit.quantity,
        )
      )
        worldMutationFailure();
    const target = point(context, num(row, "targetId")),
      resource = cityInteger(target.pointItem, 0, 5),
      capacity = cityInteger(army.cachedLoad, 1),
      rate = Number(row.collectSpd ?? 0),
      phase =
        num(row, "state") === 0
          ? "outbound"
          : num(row, "state") === 1
            ? "gathering"
            : num(row, "state") === 2
              ? "returning"
              : undefined;
    if (!phase || !Number.isFinite(rate) || rate <= 0) worldMutationFailure();
    const start =
      phase === "outbound"
        ? long(row, "marchStartTime")
        : phase === "gathering"
          ? long(row, "changeCollectSpdTime") || long(row, "marchArrivalTime")
          : long(row, "returnStartTime");
    const returnDuration = BigInt(Math.max(1, num(row, "marchTime")));
    const gatheredBefore = phase === "gathering" ? cityInteger(long(row, "collectedBeforeSpd")) : 0;
    const limit = Math.max(
      0,
      Math.min(capacity, num(target, "resInitValue") - num(target, "resCostValue")) -
        gatheredBefore,
    );
    const dueAt =
      phase === "gathering"
        ? start + BigInt(Math.max(1, Math.ceil((limit / rate) * 1000)))
        : long(row, "arrivalTime") || long(row, "marchArrivalTime");
    let cargo: RuntimeMarch["cargo"] = null;
    if (text(row, "plunderRes")) {
      const saved = JSON.parse(text(row, "plunderRes")) as { t: number; v: number }[];
      if (!Array.isArray(saved) || saved.length !== 1 || saved[0]!.t !== resource)
        worldMutationFailure();
      cargo = {
        resource: (["wood", "stone", "iron", "food", "silver", "gold"] as const)[resource]!,
        amount: cityAmount(saved[0]!.v),
      };
    }
    const state: RuntimeMarch = {
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
      targetType: 3,
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
    let changed = false;
    for (
      let guard = 0;
      guard < 4 && state.dueAt <= context.now && state.phase !== "completed";
      guard++
    ) {
      if (state.phase === "outbound") {
        const target = point(context, state.target);
        if (
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
      } else if (state.phase === "gathering") state = returnState(context, state, state.dueAt);
      else {
        const result = completeMarchReturn(
          state,
          context.owner,
          state.version,
          context.now,
          balances(context),
        );
        writeBalances(context, result.troops);
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
  "world.march",
  "world.march.check",
  "world.march.retreat",
  "world.march.spd",
  "world.user.march",
  "world.get.march",
  "world.mv",
  "world.mv.gold",
];
export function createWorldMarchDomain(size: number): CityDomain {
  return {
    commands: worldMutationCommands,
    types: [],
    async prepare(context, command, params) {
      if (!context.state.worldMutation) worldMutationFailure();
      if (
        command !== "world.tick" &&
        !serverFeature(context.rules, "world_march", {
          kingdomId: context.rules.kingdomId,
          version: "12.06.0",
          now: Number(context.now),
        })
      )
        worldMutationFailure();
      recover(context);
      const push = (): Fields => ({
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
        marches: sfs.array(
          marchRows(context).map((row) => sfs.object(runtimeMarchView(context, row))),
        ),
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
      });
      const reply = (body: Fields, event = true) => ({
        response: encode(body),
        event: event || Boolean(context.write.worldMutation) ? encode(push()) : null,
      });
      if (command === "world.tick") return reply({}, Boolean(context.write.worldMutation));
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
      if (command === "world.march" || command === "world.march.check") {
        const targetId = cityInteger(int(params, "point"), 1, size * size),
          target = point(context, targetId),
          world = context.state.worldMutation.world;
        if (
          int(params, "type") !== 0 ||
          num(target, "pointType") !== 3 ||
          num(target, "worldId") !== 0 ||
          text(target, "ownerMarchUUid") ||
          text(target, "ownerId") ||
          num(target, "resInitValue") <= num(target, "resCostValue")
        )
          worldMutationFailure();
        const companions = selectMarchCompanions(context, params, marchRows(context));
        if (marchRows(context).length >= Math.max(1, Math.trunc(1 + context.effect(55))))
          worldMutationFailure();
        const soldiers = fields(params.soldiers),
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
          marchSpeed = Math.min(marchSpeed, Math.fround(Number(rule.speed)));
          army.soldiers!.push({
            owner: context.owner,
            armsId: id,
            total: quantity,
            dead: 0,
            loadEffect: 0,
            basicArm: null,
          });
        }
        const castle = context.state.buildings.find((row) => num(row, "itemId") === 400000);
        if (!castle) worldMutationFailure();
        const max =
          Number(
            context.rules
              .building("400000", num(castle, "level"))
              .clientParameters?.[0]?.value.split(";")[0] ?? 0,
          ) + context.effect(56);
        if (!troops.length || total > max) worldMutationFailure();
        const resource = cityInteger(target.pointItem, 0, 5);
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
        const capacity = resourceArmyLoad(
          { rawArmyLoad: raw, pointType: 3, pointItem: String(resource), plunder: [] },
          context.rules,
        );
        army.cachedLoad = capacity;
        const route = ordinaryMarchRoute(
          context.rules,
          size,
          num(world, "pointId"),
          targetId,
          marchSpeed,
          context.effect(60) + context.effect(97) + context.effect(2193),
          true,
          false,
          context.effect(402),
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
        const collectRate = resourceGatherRate(
          context.rules,
          resource,
          num(castle, "level"),
          gatherEffect,
        );
        const reserved = reserveMarch(
          {
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
        if (command === "world.march.check")
          return reply(
            {
              marchTime: sfs.int(Number(duration)),
              armyLoad: sfs.int(capacity),
              collectSpd: sfs.double(collectRate),
            },
            false,
          );
        attachMarchCompanions(context, army, companions);
        const state: RuntimeMarch = {
          ...reserved.march,
          capacity,
          collectRate,
          marchSpeed,
          targetType: 3,
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
          targetType: 3,
          targetUid: "",
          type: 0,
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
        const target = cityInteger(
            random ? context.state.worldMutation.randomDestination : int(params, "point"),
            1,
            size * size,
          ),
          world = context.state.worldMutation.world,
          source = num(world, "pointId"),
          destination = worldFootprint(target, size),
          original = worldFootprint(source, size);
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
          if (row.ownerId !== context.owner) worldMutationFailure();
          Object.assign(row, {
            pointType: 0,
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
            pointType: id === target ? 1 : 2,
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
        for (const row of marchRows(context)) {
          const id = text(row, "uuid"),
            record =
              context.write.worldMutation?.checkpoints?.find((row) => row.id === id) ??
              context.state.worldMutation.checkpoints.find((row) => row.id === id);
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
        }
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
      return reply(
        runtimeMarchView(
          context,
          marchRows(context).find((row) => row.uuid === id)!,
        ),
      );
    },
    async apply() {
      worldMutationFailure();
    },
  };
}
