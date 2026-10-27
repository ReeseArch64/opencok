import type { GameServices } from "@opencok/contracts/game";
import type { WorldMarchInspectionStore } from "@opencok/contracts/world-march-inspection";
import { num, long, text } from "@opencok/contracts/rows";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { sfs, str, int, Type, type Fields } from "@opencok/messages/sfs";
import { decodeWorldMarchArmy } from "@opencok/messages/world-resource-army";
import { resourceArmyLoad, resourceRemaining } from "@opencok/rules/world-resource-detail";
import { reconnectMarchDragon, reconnectMarchGeneral } from "@opencok/mappings/reconnect-marches";
import { readResourceRawArmyLoad } from "./world-resource-army-load";
import { restoredResourcePlunder } from "./world-resource-detail";
import type { Rules } from "@opencok/rules/game";
function unavailable(): never {
  throw new GameError(errors.unsupported, "world_state");
}
export async function inspectWorldMarch(
  store: WorldMarchInspectionStore,
  observer: string,
  params: Fields,
  rules: Rules,
  kingdomId: number,
  now: number,
  services: Pick<GameServices, "worldPowerEffects" | "emperorVersion" | "expeditionStage">,
): Promise<Fields> {
  if (int(params, "msFlag", 0) !== 0 || !Number.isSafeInteger(now) || now < 0) unavailable();
  const owner = str(params, "uid", observer),
    id = str(params, "uuid"),
    state = await store.read(observer, owner, id, kingdomId, now);
  if (!state) unavailable();
  const { march, point } = state,
    type = num(march, "type"),
    targetType = num(march, "targetType"),
    phase = num(march, "state");
  if (
    ![0, 1, 2].includes(phase) ||
    !(
      (type === 0 && [0, 2, 3, 37].includes(targetType)) ||
      (type === 1 && [1, 2, 3, 44].includes(targetType)) ||
      (type === 13 && targetType === 1)
    )
  )
    unavailable();
  const army = march.armyInfo ? decodeWorldMarchArmy(march.armyInfo as Buffer) : null;
  if (
    !army ||
    army.owner !== owner ||
    !army.soldiers ||
    army.soldiers.some((unit) => unit.owner !== owner)
  )
    unavailable();
  const raw = await readResourceRawArmyLoad(
      army,
      { ownerUid: owner, residentOwner: true },
      state.owner,
      rules,
      { kingdomId, now },
      services,
      () => BigInt(now),
    ),
    load = resourceArmyLoad(
      {
        rawArmyLoad: raw,
        pointType: num(point, "pointType"),
        pointItem: point.pointItem == null ? null : text(point, "pointItem"),
        plunder: restoredResourcePlunder(text(march, "plunderRes") || null, targetType),
      },
      rules,
    ),
    maximum = Math.min(
      resourceRemaining(num(point, "resInitValue"), num(point, "resCostValue")),
      load,
    ),
    speed = Math.fround(Number(march.collectSpd ?? 0));
  if (!Number.isFinite(speed) || speed < 0) unavailable();
  let end = long(march, "arrivalTime");
  if (phase === 1 && [3, 37].includes(targetType)) {
    if (speed <= 0) unavailable();
    const duration = Math.ceil(Math.fround(Math.fround(maximum) / speed) * 1000);
    if (!Number.isSafeInteger(duration)) unavailable();
    end += BigInt(duration);
  }
  const units = army.soldiers.filter((unit) => unit.total > unit.dead),
    savedDragon = army.dragons?.[0],
    dragon = savedDragon
      ? state.dragons.find((row) => row.uid === owner && row.uuid === savedDragon.uuid)
      : undefined;
  if (
    (savedDragon && savedDragon.owner !== owner) ||
    (army.general && army.general.owner !== owner)
  )
    unavailable();
  const petDragon = dragon ? reconnectMarchDragon(dragon, rules) : undefined,
    general = army.general
      ? reconnectMarchGeneral(army.general, state.skills, BigInt(now))
      : undefined;
  return {
    uuid: sfs.string(id),
    uid: sfs.string(owner),
    name: sfs.string(text(march, "ownerName")),
    marchType: sfs.int(type),
    targetPointIndex: sfs.int(num(march, "targetId")),
    marchState: sfs.int(phase),
    soldiers: sfs.array(
      units.map((unit) =>
        sfs.object({
          armyId: sfs.string(unit.armsId ?? ""),
          star: sfs.int(
            unit.level ??
              num(state.armies.find((row) => row.armyId === unit.armsId) ?? {}, "level"),
          ),
          count: sfs.int(unit.total - unit.dead),
        }),
      ),
    ),
    generals: sfs.array([]),
    ...(petDragon ? { petDragon: sfs.object(petDragon) } : {}),
    ...(general ? { newGeneral: sfs.object(general) } : {}),
    totalTroops: sfs.int(units.reduce((sum, unit) => sum + unit.total - unit.dead, 0)),
    endStamp: sfs.long(end),
    startStamp: sfs.long(
      long(march, phase === 0 ? "marchStartTime" : phase === 2 ? "returnStartTime" : "arrivalTime"),
    ),
    territoryStartTime: sfs.long(long(march, "territoryStartTime")),
    territoryUpdateTime: sfs.long(long(march, "territoryUpdateTime")),
    targetType: sfs.int(targetType),
    actionSpeed: { type: Type.Float, value: speed },
    actionMax: sfs.int(maximum),
  };
}
