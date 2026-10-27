import type { ReconnectMarchState } from "@opencok/contracts/reconnect";
import type { Row } from "@opencok/contracts/rows";
import type { WorldResourceLoadEffects } from "@opencok/contracts/world-resource-detail";
import {
  reconnectMarchBase,
  reconnectMarchDragon,
  reconnectMarches,
  type ReconnectMarchView,
} from "@opencok/mappings/reconnect-marches";
import { reconnectMarchGeneral } from "@opencok/hero/mappings/reconnect-march-general";
import { worldResourceOwner } from "@opencok/mappings/world-resource-detail";
import { decodeWorldMarchArmy, type SavedMarchArmy } from "@opencok/messages/world-resource-army";
import { sfs, type Fields } from "@opencok/messages/sfs";
import type { Rules } from "@opencok/rules/game";
import type { RuleContext } from "@opencok/rules/availability";
import { serverFeature } from "@opencok/rules/power-context";
import { javaDecimal } from "@opencok/rules/java-integer";
import { javaIntHashMapOrder, javaHashMapOrder } from "@opencok/rules/java-hash-map-order";
import {
  resourceArmyLoad,
  resourceRawArmyLoad,
  resourceOwnerDetail,
  resourceRemaining,
  resourceSavedCollection,
} from "@opencok/rules/world-resource-detail";
import { restoredResourcePlunder } from "./world-resource-detail.ts";

const int = (value: unknown) => Number(javaDecimal(String(value ?? 0), 32));

const long = (value: unknown) => javaDecimal(String(value ?? 0), 64);

const text = (value: unknown) => {
  if (typeof value !== "string" || !value.isWellFormed() || value.includes("\0"))
    {throw new Error("Invalid march text");}

  return value;
};

const allianceTargets = new Set([
  1, 2, 10, 12, 14, 18, 23, 24, 26, 28, 30, 31, 32, 33, 34, 36, 41, 46, 47,
]);

const monsters = new Set([9, 15, 49, 51, 66, 44]);

function skin(
  states: readonly Row[],
  owner: string,
  march: boolean,
  rules: Rules,
  online: boolean,
): number | undefined {
  const rows = states.filter((row) => row.uid === owner);
  const indexed = new Map(rows.map((row) => [int(row.stateId), row]));
  const order = online ? javaIntHashMapOrder(indexed.keys()) : rows.map((row) => int(row.stateId));

  for (const id of order) {
    const rule = rules.power.statuses?.get(String(id));

    if (!rule) {continue;}

    if (
      march
        ? rule.type2 === "101"
        : rule.effect?.split("|").some((entry) => entry.split(";")[0] === "14")
    )
      {return id;}
  }

  return undefined;
}

function occupiedExtras(
  row: Row,
  army: SavedMarchArmy | null,
  point: Row | undefined,
  rules: Rules,
  effects: WorldResourceLoadEffects | undefined,
): Fields {
  if (int(row.state) !== 1) {return {};}

  const type = int(row.targetType);

  if (type === 6)
    {return {
      exploreSt: sfs.long(long(row.marchArrivalTime)),
      exploreTime: sfs.long(long(row.exploreTime)),
    };}

  if (type === 41) {
    if (!point) {throw new Error("Missing occupied crystal point");}

    return { crt: sfs.int(Number(BigInt.asIntN(32, long(point.startOccupyTime) / 1000n))) };
  }

  if (![3, 18, 37, 60, 63].includes(type)) {return {};}

  if (
    !point ||
    int(point.pointType) !== type ||
    !army ||
    !army.soldiers ||
    army.owner !== row.ownerUid ||
    !effects
  )
    {throw new Error("Missing occupied resource state");}

  const rawArmyLoad = resourceRawArmyLoad(
    {
      cachedLoad: army.cachedLoad,
      residentOwner: true,
      effects,
      soldiers: army.soldiers.map((soldier) => {
        if (soldier.owner !== row.ownerUid || !soldier.armsId)
          {throw new Error("Foreign collection army");}

        return { ...soldier, armsId: soldier.armsId };
      }),
    },
    rules,
  );
  const armyLoad = resourceArmyLoad(
    {
      rawArmyLoad,
      pointType: type,
      pointItem: point.pointItem === null ? null : text(point.pointItem),
      plunder: restoredResourcePlunder(
        row.plunderRes === null || text(row.plunderRes).trim() === "" ? null : text(row.plunderRes),
        type,
      ),
    },
    rules,
  );

  return worldResourceOwner(
    resourceOwnerDetail(type, resourceRemaining(int(point.resInitValue), int(point.resCostValue)), {
      ...resourceSavedCollection(row),
      armyLoad,
      maxCollectTime:
        type === 37 && long(row.occupyResourceEndTime) >= long(row.marchArrivalTime)
          ? long(row.occupyResourceEndTime) - long(row.marchArrivalTime)
          : 0n,
    }),
  );
}

export function projectReconnectMarches(
  state: ReconnectMarchState,
  owner: string,
  rules: Rules,
  context: RuleContext,
  resourceEffects: WorldResourceLoadEffects | undefined,
): Fields {
  const now = BigInt(context.now);
  const petDragon =
    serverFeature(rules, "dragon_new", context) && serverFeature(rules, "dragon_battle", context);
  const indexed = new Map(state.rows.map((row) => [text(row.uuid), row]));

  if (indexed.size !== state.rows.length) {throw new Error("Duplicate reconnect march");}

  const views: ReconnectMarchView[] = javaHashMapOrder(indexed.keys()).map((id) => {
    const row = indexed.get(id)!;
    const uid = text(row.ownerUid);
    const type = int(row.type),
      targetType = int(row.targetType),
      world = int(row.worldId);

    if (type < 0 || type > 23) {throw new Error("Invalid reconnect march type");}

    const profile = state.profiles.find((profile) => profile.uid === uid);
    const army = row.armyInfo === null ? null : decodeWorldMarchArmy(row.armyInfo as Buffer);

    if (army && army.owner !== uid) {throw new Error("Foreign saved march army");}

    const base = reconnectMarchBase(row, army, rules, {
      serverId: profile
        ? int(profile.crossFightSrcServerId ?? -1) === -1
          ? int(profile.serverId)
          : int(profile.crossFightSrcServerId)
        : -2,
      miracle: targetType === 54,
      miracleState: state.miracles.find(
        (entry) => int(entry.worldid) === world && int(entry.point) === int(row.targetId),
      ),
      resourceBattle: targetType === 63,
      siege: type === 8,
    });
    const alliance = state.alliances.find((entry) => entry.uid === row.allianceId);

    if (alliance && alliance.abbr !== null) {base.asn = sfs.string(text(alliance.abbr));}

    if (allianceTargets.has(targetType)) {
      const target =
        typeof row.targetUid === "string" && row.targetUid.trim()
          ? state.profiles.find((entry) => entry.uid === row.targetUid)?.allianceId
          : [14, 23, 46, 47].includes(targetType)
            ? state.territories.find(
                (entry) =>
                  int(entry.atWorldId) === world && int(entry.pointId) === int(row.targetId),
              )?.allianceId
            : undefined;

      if (typeof target === "string" && target.trim()) {base.tali = sfs.string(target);}
    }

    const late: Fields = {};
    const office = state.offices.find((entry) => entry.uid === uid);

    if (
      office &&
      !(office.positionId === "216000000" && int(office.serverId) === context.kingdomId)
    ) {
      const ordinal = int(office.positionId) % 100;

      if (ordinal >= 0 && ordinal <= 16) {late.officer = sfs.string(String(216000 + ordinal));}
    }

    const attacker = skin(state.states, uid, false, rules, uid === owner);

    if (attacker !== undefined) {late.attSkin = sfs.int(attacker);}

    if (typeof row.targetUid === "string" && row.targetUid && !monsters.has(targetType)) {
      const defender = skin(state.states, row.targetUid, false, rules, row.targetUid === owner);

      if (defender !== undefined) {late.defSkin = sfs.int(defender);}
    }

    const marchSkin = skin(state.states, uid, true, rules, uid === owner);

    if (marchSkin !== undefined) {late.marchSkin = sfs.int(marchSkin);}

    if (type === 8) {
      late.monsterCount = sfs.int(int(row.monsterArmyCount));
      late.monsterLevel = sfs.int(int(row.monsterLevel));
    }

    if (targetType === 63) {late.occupyEndTime = sfs.long(long(row.occupyResourceEndTime));}

    const savedDragon = army?.dragons?.[0];

    if (savedDragon && savedDragon.owner !== uid) {throw new Error("Foreign march dragon");}

    const dragon = savedDragon
      ? state.dragons.find((entry) => entry.uid === uid && entry.uuid === savedDragon.uuid)
      : undefined;

    if (army?.general && army.general.owner !== uid) {throw new Error("Foreign march general");}

    const family = [15, 16].includes(type) ? 15 : [18, 19].includes(type) ? 18 : 4;
    const team = state.teams.find(
      (entry) => entry.family === family && entry.id === row.teamId && int(entry.worldId) === world,
    );
    const leader = team
      ? state.rows.find(
          (entry) =>
            entry.teamId === row.teamId &&
            int(entry.worldId) === world &&
            int(entry.type) === family &&
            entry.ownerUid === team.leaderUid,
        )
      : undefined;

    return {
      row,
      base,
      late,
      petDragon: petDragon && army ? reconnectMarchDragon(dragon, rules) : undefined,
      dragon: dragon ? reconnectMarchDragon(dragon, rules) : undefined,
      hasDragon: savedDragon !== undefined,
      general: army?.general ? reconnectMarchGeneral(army.general, state.skills, now) : undefined,
      extras:
        uid === owner
          ? occupiedExtras(
              row,
              army,
              state.points.find(
                (point) => int(point.worldId) === world && int(point.id) === int(row.targetId),
              ),
              rules,
              resourceEffects,
            )
          : {},
      team:
        team && leader
          ? {
              leader: text(leader.uuid),
              members: state.rows
                .filter(
                  (entry) =>
                    entry.teamId === row.teamId &&
                    int(entry.worldId) === world &&
                    int(entry.type) === family + 1,
                )
                .map((entry) => text(entry.uuid)),
              createdAt: long(team.createTime),
            }
          : undefined,
    };
  });

  return reconnectMarches(views, owner, now);
}
