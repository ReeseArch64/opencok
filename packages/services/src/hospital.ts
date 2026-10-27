import { recordTargetTask } from "./target-task";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { Type, sfs, str, int, encode, type Fields } from "@opencok/messages/sfs";
import { text, num, long, type Row } from "@opencok/contracts/rows";
import type {
  ActivityAction,
  PreparedActivity,
  TimedActivity,
} from "@opencok/contracts/timed-activity";
import {
  cityAssets,
  cityAmount,
  cityInteger,
  cityDuration,
  progressionActivityData,
  reducedCityCost,
  type CityAsset,
} from "@opencok/rules/city-progression";
import {
  troopDefinition,
  unitPower,
  totalBuildingParameter,
  transferTroops,
  reserveTroops,
  healingSelection,
} from "@opencok/rules/military";
import { CityProgressionContext, type CityDomain } from "./city-progression";

export function hospitalCapacity(context: CityProgressionContext) {
  const base =
    totalBuildingParameter(context.state, context.rules, 411000, 0) +
    context.effect(73) +
    context.generalEffect(73);
  const multiplier = 1 + (context.effect(57) + context.generalEffect(57)) / 100;
  return cityInteger(Math.max(0, Math.trunc(base * Math.max(0, multiplier))));
}
function healthy(context: CityProgressionContext, armyId: string): Row {
  return (
    context.state.armies.find((army) => army.armyId === armyId) ?? {
      uid: context.owner,
      armyId,
      level: 0,
      free: 0,
      defence: 0,
      march: 0,
      pve: 0,
      train: 0,
      finishTime: 0n,
      foodCostTime: context.now,
    }
  );
}
function complete(
  context: CityProgressionContext,
  rows: readonly Row[],
  instant?: ReadonlyMap<string, number>,
) {
  const armies: Row[] = [],
    hospital: Row[] = [];
  let healed = 0,
    power = 0n;
  for (const row of rows) {
    const count = cityInteger(instant?.get(text(row, "armyId")) ?? num(row, "heal"), 1),
      armyId = text(row, "armyId"),
      army = healthy(context, armyId);
    const [, free] = transferTroops(count, num(army, "free"), count);
    armies.push({ ...army, free, foodCostTime: context.now });
    hospital.push({
      ...row,
      heal: instant ? num(row, "heal") : 0,
      finishTime: instant ? long(row, "finishTime") : 0n,
    });
    healed = cityInteger(healed + count);
    power += unitPower(troopDefinition(context.rules, armyId), count);
  }
  if (!healed) throw new GameError(errors.queue, "city_progression");
  context.write.armies = armies;
  context.write.hospital = hospital;
  context.power(power, 0n, healed);
  recordTargetTask(context, 2, healed, "3");
  return {
    army: sfs.array(
      armies.map((army) =>
        sfs.object({ id: sfs.string(text(army, "armyId")), free: sfs.int(num(army, "free")) }),
      ),
    ),
    cure: sfs.int(healed),
  };
}
async function prepare(
  context: CityProgressionContext,
  command: string,
  params: Fields,
): Promise<PreparedActivity> {
  if (command === "hospital.fire") {
    const armyId = str(params, "id"),
      count = cityInteger(int(params, "num"));
    troopDefinition(context.rules, armyId);
    const row = context.state.hospital.find((hospital) => hospital.armyId === armyId);
    const [dead] = transferTroops(num(row ?? {}, "dead"), 0, count);
    if (row) context.write.hospital = [{ ...row, dead }];
    return {
      response: encode({
        hospital: sfs.array([sfs.object({ id: sfs.string(armyId), dead: sfs.int(dead) })]),
      }),
    };
  }
  const direct = command === "hospital.cd";
  const selection = healingSelection(params, Type.Int),
    count = [...selection.values()].reduce((sum, quantity) => sum + quantity, 0);
  if (count > hospitalCapacity(context)) throw new GameError(errors.invalid, "city_progression");
  if (
    !context.state.buildings.some(
      (building) =>
        num(building, "itemId") === 411000 &&
        num(building, "level") > 0 &&
        num(building, "opType") === 0,
    )
  )
    throw new GameError(errors.troopBuilding, "city_progression");
  if (
    !direct &&
    (context.state.hospital.some((row) => num(row, "heal") > 0) ||
      context.state.queues.some((queue) => num(queue, "type") === 3 && text(queue, "itemId")))
  )
    throw new GameError(errors.occupied, "city_progression");
  const payment = int(params, "isBuyRes", 0);
  if (![0, 1].includes(payment)) throw new GameError(errors.invalid, "city_progression");
  const costs: Partial<Record<CityAsset, bigint>> = {},
    hospital: Row[] = [];
  const reduction = context.effect(108) + context.generalEffect(108) + context.effect(2153);
  let seconds = 0,
    itemCount = 0;
  for (const [armyId, quantity] of selection) {
    const row = context.state.hospital.find((wounded) => wounded.armyId === armyId);
    if (!row) throw new GameError(errors.missing, "city_progression");
    const [dead, heal] = transferTroops(num(row, "dead"), direct ? 0 : num(row, "heal"), quantity);
    reserveTroops(context.state, armyId, quantity);
    const rule = troopDefinition(context.rules, armyId),
      rate = cityInteger(rule.heal_res, 0, 1000);
    for (const asset of cityAssets) {
      const percent = asset === "silver" ? cityInteger(rule.heal_silver ?? rate, 0, 1000) : rate;
      costs[asset] =
        (costs[asset] ?? 0n) +
        reducedCityCost(
          (cityAmount(rule[asset] ?? 0) * BigInt(quantity) * BigInt(percent)) / 100n,
          reduction,
        );
    }
    seconds += (cityInteger(rule.time) * quantity * cityInteger(rule.heal_time)) / 1000;
    itemCount += Math.ceil((cityInteger(rule.fine_iron ?? 0) * quantity * rate) / 10000);
    hospital.push({ ...row, dead, heal: direct ? num(row, "heal") : heal });
  }
  const durationMs = cityDuration(
    seconds,
    context.effect(121) + context.generalEffect(121) + context.effect(304) + context.effect(2155),
    context.effect(2154),
  );
  context.checkPower(
    [...selection].reduce(
      (sum, [id, quantity]) => sum + unitPower(troopDefinition(context.rules, id), quantity),
      0n,
    ),
  );
  context.spend(costs, direct || payment === 1);
  if (itemCount) context.spendItem("211508", cityInteger(itemCount));
  if (direct) {
    context.accelerate(durationMs);
    return {
      response: encode({
        ...complete(context, hospital, selection),
        resource: sfs.object(context.resource()),
        gold: sfs.long(context.balance("gold")),
      }),
    };
  }
  context.write.hospital = hospital.map((row) => ({
    ...row,
    finishTime: context.now + durationMs,
  }));
  return {
    type: 3,
    itemId: "1",
    durationMs,
    data: context.data("heal", { units: Object.fromEntries(selection) }),
    responseKind: "nested",
    item: encode({ itemId: sfs.string("1") }),
    response: encode({
      resource: sfs.object(context.resource()),
      gold: sfs.long(context.balance("gold")),
    }),
  };
}
async function apply(
  context: CityProgressionContext,
  action: ActivityAction,
  activity: TimedActivity,
): Promise<Fields> {
  const data = progressionActivityData(activity.data),
    saved = context.state.queues.find((queue) => queue.uuid === activity.queueId);
  const rows = context.state.hospital.filter((row) => num(row, "heal") > 0);
  if (
    !saved ||
    saved.itemId !== "1" ||
    activity.itemId !== "1" ||
    !rows.length ||
    rows.some((row) => long(row, "finishTime") !== long(saved, "updateTime")) ||
    (data &&
      (data.kind !== "heal" ||
        Object.keys(data.units ?? {}).length !== rows.length ||
        rows.some((row) => data.units?.[text(row, "armyId")] !== num(row, "heal"))))
  )
    throw new GameError(errors.queue, "city_progression");
  if (action === "start") throw new GameError(errors.invalid, "city_progression");
  if (action === "restore" || action === "reschedule") {
    context.write.hospital = rows.map((row) => ({ ...row, finishTime: activity.dueAt }));
    return { itemId: sfs.string("1") };
  }
  if (action === "cancel") {
    context.refund(data);
    context.write.hospital = rows.map((row) => {
      const [, dead] = transferTroops(num(row, "heal"), num(row, "dead"), num(row, "heal"));
      return { ...row, dead, heal: 0, finishTime: 0n };
    });
    return { resource: sfs.object(context.resource()) };
  }
  return complete(context, rows);
}
export const hospitalDomain: CityDomain = {
  commands: ["hospital.cure", "hospital.cd", "hospital.fire"],
  types: [3],
  prepare,
  apply,
};
