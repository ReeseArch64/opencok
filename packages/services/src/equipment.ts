import { randomInt, randomUUID } from "node:crypto";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { text, num, long, type Row } from "@opencok/contracts/rows";
import { sfs, encode, str, int, Type, type Fields, type Value } from "@opencok/messages/sfs";
import type {
  TimedActivity,
  ActivityAction,
  PreparedActivity,
} from "@opencok/contracts/timed-activity";
import {
  equipmentRule,
  equipmentPairs,
  equipmentCosts,
  equipmentMaterials,
  equipmentColor,
  randomEquipmentProperty,
  dismantleEquipment,
  chooseWeight,
} from "@opencok/rules/equipment";
import {
  cityInteger,
  cityAmount,
  cityDuration,
  progressionActivityData,
} from "@opencok/rules/city-progression";
import { idleDeadline } from "@opencok/rules/timed-activity";
import { equipment, equipmentItems, equipmentItem } from "@opencok/mappings/equipment";
import { queue as queueView } from "@opencok/mappings/city";
import { refreshQuests } from "./quests";
import type { CityDomain, CityProgressionContext } from "./city-progression";
const invalid = () => {
  throw new GameError(errors.invalid, "city_progression");
};
const commands = [
  "equipment.init",
  "equipment.create",
  "equipment.buy",
  "equipment.break",
  "equip.putOn",
  "equip.takeOff",
  "equipment.strength",
  "equip.reforge",
  "suit.equipment.create",
  "suit.create",
  "suit.decompose",
  "set.suit.decompose.effect",
  "material.create",
  "material.break",
];
const quantity = (context: CityProgressionContext) => (id: string) =>
  context.economy.quantity?.(id) ?? 0;
function forge(context: CityProgressionContext) {
  const row = context.state.buildings.find(
    (row) => num(row, "itemId") === 429000 && num(row, "level") > 0,
  );
  if (!row) throw new GameError(errors.troopBuilding, "city_progression");
  context.idleBuilding(row);
  return context.rules.building(
    "429000",
    num(row, "level"),
    num(row, "star"),
    num(row, "progress"),
  );
}
function own(context: CityProgressionContext, id: string) {
  const row = context.state.equipment.find((row) => row.uuid === id);
  if (!row) throw new GameError(errors.missing, "city_progression");
  return row;
}
function idle(row: Row) {
  if (num(row, "on") !== 0 || num(row, "generalid") !== 0) invalid();
}
export function newEquipment(context: CityProgressionContext, id: string): Row {
  equipmentRule(context.rules, id);
  if (context.state.equipment.length + (context.write.equipment?.length ?? 0) >= 1000)
    throw new GameError(errors.full, "city_progression");
  return {
    uid: context.owner,
    uuid: randomUUID(),
    itemId: Number(id),
    on: 0,
    generalid: 0,
    cost: "",
    extraProperty: "",
    refineProperty: "",
    strengthLevel: 0,
    reforgeCount: 0,
  };
}
function material(context: CityProgressionContext, command: string, params: Fields) {
  const id = str(params, "material"),
    count = cityInteger(int(params, "number", 1), 1, 10000),
    rule = context.rules.goods.get(id),
    color = Number(id) % 10,
    create = command === "material.create";
  if (rule?.type !== "7" || color < 0 || color > 5 || (create ? color === 5 : color === 0))
    invalid();
  const target = String(Number(id) + (create ? 1 : -1));
  if (!context.rules.goods.has(target)) invalid();
  const ratio = cityInteger(context.rules.items.get("equip")?.k6, 1);
  context.spendItem(id, cityInteger(create ? count * ratio : count));
  context.economy.item(target, cityInteger(create ? count : count * ratio));
  refreshQuests(context, { main: 46, daily: 37, legacy: 15, count });
  return {
    dec: sfs.object(
      equipmentItem(id, quantity(context)(id), context.economy.itemState?.(id), context.rules),
    ),
    add: sfs.object(
      equipmentItem(
        target,
        quantity(context)(target),
        context.economy.itemState?.(target),
        context.rules,
      ),
    ),
  };
}
async function prepare(
  context: CityProgressionContext,
  command: string,
  params: Fields,
): Promise<PreparedActivity> {
  let body: Fields = {};
  let suitColor: number | undefined;
  if (command === "suit.create") {
    const prefix = String(cityInteger(int(params, "groupId"), 1)),
      base = equipmentRule(context.rules, `${prefix}4`),
      sonId = str(params, "sonEquipUUid", ""),
      stoneId = str(params, "material", "0");
    const son = sonId ? own(context, sonId) : undefined;
    if (son) {
      idle(son);
      if (!base.cotyledons?.split(";").includes(text(son, "itemId"))) invalid();
    }
    suitColor = son && num(son, "itemId") % 10 === 5 ? 5 : 4;
    if (stoneId !== "0") {
      if (suitColor === 5) invalid();
      const owned = context.economy.ownedItem?.(stoneId),
        good = owned ? context.rules.goods.get(owned.itemId) : undefined;
      const [minimum, maximum] = good?.para5?.split(";").map(Number) ?? [];
      if (
        !owned ||
        good?.type !== "43" ||
        Number(base.level) < minimum! ||
        Number(base.level) > maximum!
      )
        invalid();
      context.spendItem(owned!.itemId, 1);
      if (randomInt(100) <= cityInteger(good!.para4, 0, 100)) suitColor = 5;
    }
    params = { ...params, itemId: sfs.string(`${prefix}4`), uuid: sfs.string(sonId) };
    command = "suit.equipment.create";
  }
  if (command === "equipment.init")
    body = {
      equip: sfs.array(
        context.state.equipment
          .filter((row) => num(row, "on") !== 2)
          .map((row) => sfs.object(equipment(row))),
      ),
      decomposeequip: sfs.array(
        (context.state.suitDecompositions ?? []).map((row) =>
          sfs.object({
            decompose_suit_item: sfs.string(
              [
                text(row, "suitid"),
                ...Array.from({ length: 6 }, (_, index) => text(row, `item${index + 1}`) || "0"),
              ].join(";"),
            ),
          }),
        ),
      ),
      materialBackup: sfs.int(
        Math.max(1, num(context.state.quests?.mixed ?? {}, "materialBackup")),
      ),
    };
  else if (command === "material.create" && params.equips) {
    const ids = str(params, "equips").split(","),
      count = cityInteger(context.rules.items.get("equip")?.k6, 1);
    if (ids.length !== count || new Set(ids).size !== count) invalid();
    const rows = ids.map((id) => own(context, id)),
      first = equipmentRule(context.rules, text(rows[0]!, "itemId"));
    if (Number(first.color) >= 5) invalid();
    for (const row of rows) {
      idle(row);
      const rule = equipmentRule(context.rules, text(row, "itemId"));
      if (
        rule.color !== first.color ||
        rule.level !== first.level ||
        (rule.suit_id ?? "") !== (first.suit_id ?? "")
      )
        invalid();
    }
    context.write.deletedEquipment = ids;
    const row = newEquipment(context, String(Number(first.id) + 1));
    context.write.equipment = [row];
    body.equipAdd = sfs.array([sfs.object(equipment(row))]);
    refreshQuests(context, { daily: 36, legacy: 14, count: 1 });
  } else if (command.startsWith("material.")) body = material(context, command, params);
  else if (command === "equipment.buy") {
    const good = context.rules.goods.get(str(params, "itemId")),
      count = cityInteger(int(params, "count"), 1, 128);
    if (!good?.para1 || !context.rules.power.equipment?.has(good.para1)) invalid();
    context.economy.gold(-BigInt(cityInteger(good!.price, 1)) * BigInt(count));
    const rows = Array.from({ length: count }, () => newEquipment(context, good!.para1!));
    if (context.state.equipment.length + rows.length > 1000) invalid();
    context.write.equipment = rows;
    body = {
      equips: sfs.array(rows.map((row) => sfs.object(equipment(row)))),
      gold: sfs.long(context.balance("gold")),
    };
  } else if (command === "equipment.create" || command === "suit.equipment.create") {
    const building = forge(context),
      id = str(params, "itemId"),
      rule = equipmentRule(context.rules, id);
    if (rule.no_forge === "1" || rule.site === "6") invalid();
    const modern = params.rate !== undefined,
      multiple = modern ? cityInteger(int(params, "rate"), 1, 99999) : 1;
    const rate = modern
      ? [...(context.rules.progression.forgeRandom?.values() ?? [])].find(
          (rule) => Number(rule.times) === multiple,
        )
      : undefined;
    if (modern && !rate) invalid();
    const payment = int(params, "gold", 0);
    if (![0, 1].includes(payment)) invalid();
    const input = params.tools;
    if (input && input.type !== Type.Array) invalid();
    const tools = ((input?.value ?? []) as Value[]).map((value) => {
      if (value.type !== Type.Int) invalid();
      return cityInteger(value.value);
    });
    const fixed = command === "suit.equipment.create";
    const selected = fixed
      ? {
          costs: new Map(
            Array.from({ length: 4 }, (_, index) => rule[`material${index + 1}`])
              .filter((raw): raw is string => !!raw)
              .flatMap((raw) => [...equipmentPairs(raw)]),
          ),
          colors: [],
        }
      : equipmentMaterials(rule, context.rules, tools, multiple, modern);
    const parent = str(params, "uuid", ""),
      needsParent =
        !!rule.son_equipment ||
        rule.reform === "1" ||
        (suitColor !== undefined && !!rule.cotyledons);
    let son: Row | undefined;
    if (needsParent) {
      son = own(context, parent);
      idle(son);
      const before = equipmentRule(context.rules, text(son, "itemId"));
      if (
        rule.reform === "1" || (suitColor !== undefined && !!rule.cotyledons)
          ? !rule.cotyledons?.split(";").includes(text(son, "itemId"))
          : Number(before.level) < Number(rule.son_equipment) ||
            Number(before.level) > Number(rule.level)
      )
        invalid();
      context.write.deletedEquipment = [text(son, "uuid")];
    }
    for (const [itemId, count] of selected.costs) context.spendItem(itemId, count);
    const reduction =
      context.effect(203) +
      context.generalEffect(203, 429000) +
      Number(building.clientParameters?.[1]?.value ?? 0);
    context.spend(
      equipmentCosts(rule.cost, reduction, Math.max(1, Number(rate?.iron ?? 1))),
      payment === 1,
    );
    const color = fixed
      ? (suitColor ?? cityInteger(rule.color, 0, 5))
      : equipmentColor(
          context.rules,
          selected.colors,
          son,
          modern,
          multiple,
          context.effect(2201),
          randomInt,
        );
    const result = equipmentRule(context.rules, `${id.slice(0, -1)}${color}`),
      row = newEquipment(context, result.id!);
    const stone = str(params, "stoneId", "");
    if (stone) {
      const goods = context.rules.goods.get(stone);
      if (goods?.type !== "43" || color < 4) invalid();
      context.spendItem(stone, multiple);
    }
    if (modern && result.ran) {
      let count = 0;
      for (let index = 1; index <= 3; index++)
        if (randomInt(10000) < Number(rate?.[`ran_${index}`] ?? 0)) count++;
      row.extraProperty = Array.from(
        { length: Math.min(cityInteger(result.ran_num ?? 0), count) },
        () =>
          randomEquipmentProperty(
            context.rules.progression.equipmentRandom?.get(result.ran!),
            color,
            randomInt,
          ),
      ).join("|");
    }
    const duration = cityDuration(
      cityInteger(rule.time),
      context.effect(219) +
        context.generalEffect(219, 429000) +
        Number(building.clientParameters?.[0]?.value ?? 0),
    );
    const durationMs = cityAmount(
      Math.trunc(Number(duration) * Math.max(1, Number(rate?.time ?? 1))),
    );
    row.on = 2;
    row.cost = [...selected.costs].map(([id, count]) => `${id};${count}`).join("|");
    context.write.equipment = [row];
    const quality = context.state.effects.states.filter(
      (state) =>
        (context.rules.power.statuses?.get(String(state.stateId))?.effect ?? "")
          .split("|")
          .some((pair) => pair.startsWith("2201;")) && long(state, "endTime") > context.now,
    );
    if (quality.length) context.write.deletedStates = quality.map((state) => num(state, "stateId"));
    return {
      type: 11,
      itemId: text(row, "uuid"),
      durationMs,
      data: context.data("equipment"),
      responseKind: "nested",
      item: encode({
        itemId: sfs.string(text(row, "itemId")),
        cost: sfs.string(text(row, "cost")),
      }),
      response: encode({
        resource: sfs.object(context.resource()),
        gold: sfs.long(context.balance("gold")),
      }),
    };
  } else if (command === "set.suit.decompose.effect") {
    const selection = str(params, "suits").split(";");
    if (selection.length !== 3) invalid();
    for (const [index, id] of selection.entries())
      if (id !== "0") {
        const row = context.state.suitDecompositions?.find((row) => row.suitid === id);
        if (
          !context.rules.power.equipmentSets?.has(id) ||
          !row ||
          Array.from({ length: 6 }, (_, n) => text(row, `item${n + 1}`)).filter(
            (id) => id && id !== "0",
          ).length <
            (index + 1) * 2
        )
          invalid();
      }
    context.write.equipmentSelection = selection.join(";");
    body.decomposeSuitEffect = sfs.string(selection.join(";"));
  } else if (command === "suit.decompose") {
    const id = str(params, "suitid"),
      ids = str(params, "item", str(params, "uuids", ""))
        .split(";")
        .filter(Boolean);
    if (
      !context.rules.power.equipmentSets?.has(id) ||
      !ids.length ||
      ids.length > 6 ||
      new Set(ids).size !== ids.length
    )
      invalid();
    const prior = context.state.suitDecompositions?.find((row) => row.suitid === id),
      value: Row = { owner: context.owner, suitid: id };
    const consumed = Array.from(
      { length: 6 },
      (_, index) => text(prior ?? {}, `item${index + 1}`) || "0",
    );
    for (const uuid of ids) {
      const row = own(context, uuid);
      idle(row);
      const rule = equipmentRule(context.rules, text(row, "itemId"));
      if (
        rule.suit_id !== id ||
        rule.site === "6" ||
        consumed.some((id) => id !== "0" && equipmentRule(context.rules, id).site === rule.site)
      )
        invalid();
      const slot = consumed.indexOf("0");
      if (slot < 0) invalid();
      consumed[slot] = text(row, "itemId");
    }
    consumed.forEach((id, index) => {
      value[`item${index + 1}`] = id;
    });
    context.write.suitDecompositions = [value];
    context.write.deletedEquipment = ids;
    body = { decompose_suit_item: sfs.string([id, ...consumed].join(";")) };
  } else {
    const row = own(context, str(params, "uuid")),
      rule = equipmentRule(context.rules, text(row, "itemId"));
    if (command === "equip.putOn" || command === "equip.takeOff") {
      if (num(row, "on") === 2) invalid();
      const assigned = context.state.newGenerals.generals.find(
        (general) => num(general, "id") === num(row, "generalid"),
      );
      if (num(row, "generalid") > 0 && (!assigned || ![1, 2, 6].includes(num(assigned, "state"))))
        invalid();
      const put = command === "equip.putOn",
        generalId = cityInteger(str(params, "generalid", "0")),
        general =
          generalId > 0
            ? context.state.newGenerals.generals.find((row) => num(row, "id") === generalId)
            : undefined;
      if (generalId > 0 && (!general || ![1, 2, 6].includes(num(general, "state")))) invalid();
      if (
        put &&
        (Number(rule.level) >
          (generalId > 0 ? num(general!, "level") : num(context.state.profile, "level")) ||
          (rule.exclusive_hero === "1" && generalId === 0))
      )
        invalid();
      if (
        put &&
        ((generalId === 0 && num(row, "on") === 1) ||
          (generalId > 0 && num(row, "generalid") === generalId))
      )
        invalid();
      const old = context.state.equipment.filter(
        (other) =>
          other.uuid !== row.uuid &&
          equipmentRule(context.rules, text(other, "itemId")).site === rule.site &&
          (generalId === 0 ? num(other, "on") === 1 : num(other, "generalid") === generalId),
      );
      const changed = [
        ...old.map((other) => ({ ...other, on: 0, generalid: 0 })),
        { ...row, on: put && generalId === 0 ? 1 : 0, generalid: put ? generalId : 0 },
      ];
      if (!put) {
        if (generalId === 0 ? num(row, "on") !== 1 : num(row, "generalid") !== generalId) invalid();
        changed.splice(0, old.length);
      }
      const power = (records: readonly Row[]) =>
        records
          .filter((row) => num(row, "on") === 1)
          .reduce(
            (sum, row) =>
              sum + cityAmount(equipmentRule(context.rules, text(row, "itemId")).power ?? 0),
            0n,
          );
      context.power(power(changed) - power([row, ...old]));
      context.write.equipment = changed;
      body = { equips: sfs.array(changed.map((row) => sfs.object(equipment(row)))) };
      refreshQuests(context);
    } else if (command === "equipment.break") {
      forge(context);
      idle(row);
      if (rule.no_decompose === "1") invalid();
      const items = dismantleEquipment(rule, randomInt);
      for (const [id, count] of items) context.economy.item(id, count);
      context.write.deletedEquipment = [text(row, "uuid")];
      body = {
        goods: equipmentItems(items, quantity(context), context.rules, context.economy.itemState),
        resource: sfs.object(context.resource()),
        uuid: sfs.string(text(row, "uuid")),
        itemId: sfs.string(text(row, "itemId")),
      };
    } else if (command === "equipment.strength") {
      if (num(row, "on") === 2 || rule.isStrengthen !== "1") invalid();
      const level = cityInteger(num(row, "strengthLevel"), 0, 9);
      context.spend({ silver: cityAmount(rule.Strengthen_iron?.split("|")[level]) }, false);
      for (const pair of rule.Strengthen_cost?.split("|")[level]?.split(";") ?? []) {
        const [id, count] = pair.split(":");
        context.spendItem(id!, cityInteger(count, 1));
      }
      const rate = cityInteger(rule.Strengthen_rate?.split("|")[level], 0, 100),
        success = rate === 100 || randomInt(101) <= rate;
      if (success) context.write.equipment = [{ ...row, strengthLevel: level + 1 }];
      body = {
        strengthLevel: sfs.int(level + (success ? 1 : 0)),
        result: sfs.string(success ? "1" : "0"),
      };
    } else if (command === "equip.reforge") {
      idle(row);
      if (!text(row, "extraProperty") || !rule.reforgeRandomID) invalid();
      const config = context.rules.items.get("equipment_combine"),
        count = num(row, "reforgeCount"),
        multiplier =
          1 + (Math.min(count, Number(config?.k11 ?? 0)) * Number(config?.k10 ?? 0)) / 100;
      context.spend(equipmentCosts(rule.reforgeCost, 0, multiplier), false);
      for (const [id, cost] of equipmentPairs(rule.reforgeItem))
        context.spendItem(id, Math.ceil(cost * multiplier));
      const library =
        config?.k9
          ?.split("|")
          [(count + 1) % cityInteger(config?.k8, 1) === 0 ? 1 : 0]?.split(";")
          .map(Number) ?? [];
      const extra = text(row, "extraProperty")
        .split("|")
        .filter(Boolean)
        .map(() =>
          randomEquipmentProperty(
            context.rules.progression.reforgeRandom?.get(rule.reforgeRandomID!),
            cityInteger(rule.color, 0, 5),
            randomInt,
            chooseWeight(library, randomInt) + 1,
          ),
        )
        .join("|");
      const value = { ...row, extraProperty: extra, reforgeCount: count + 1 };
      context.write.equipment = [value];
      body = equipment(value);
    } else invalid();
  }
  return { response: encode(body), event: null };
}
async function apply(
  context: CityProgressionContext,
  action: ActivityAction,
  activity: TimedActivity,
) {
  const row = own(context, activity.itemId),
    data = progressionActivityData(activity.data);
  if (num(row, "on") !== 2 || (data && data.kind !== "equipment")) invalid();
  if (action === "start") invalid();
  if (action === "restore" || action === "reschedule") return equipment(row);
  if (action === "cancel") {
    context.write.deletedEquipment = [text(row, "uuid")];
    context.refund(data);
    return { resource: sfs.object(context.resource()) };
  }
  const value = { ...row, on: 0, cost: "" };
  context.write.equipment = [value];
  refreshQuests(context, { daily: 36, legacy: 14, count: 1 });
  return equipment(value);
}
export const equipmentDomain: CityDomain = { commands, types: [11], prepare, apply };

const workshopCommands = ["create.tool", "queue.tool", "rm.tool", "tool.queue.buy"];
function workshopQueue(context: CityProgressionContext) {
  const row = context.state.queues.find((row) => num(row, "type") === 12 && num(row, "qid") === 1);
  if (!row) throw new GameError(errors.queue, "city_progression");
  return row;
}
function workshopDuration(context: CityProgressionContext, id: string) {
  const good = context.rules.goods.get(id),
    parts = good?.make?.split("|");
  if (!parts || good?.type !== "7") invalid();
  return cityDuration(
    cityInteger(parts![1]),
    context.effect(204) + context.effect(2157),
    context.effect(248) * 60 + context.effect(2156),
  );
}
async function prepareWorkshop(
  context: CityProgressionContext,
  command: string,
  params: Fields,
): Promise<PreparedActivity> {
  const row = workshopQueue(context),
    items = text(row, "itemId").split(";").filter(Boolean);
  let body: Fields = {};
  if (command === "create.tool") {
    const id = str(params, "itemId"),
      durationMs = workshopDuration(context, id),
      max = Math.max(1, num(context.state.quests?.mixed ?? {}, "materialBackup")),
      index = int(params, "index", 0);
    if (index < 0) invalid();
    if (items.length && index > 0 && index < items.length) items[index] = id;
    else {
      if (items.length >= max) throw new GameError(errors.full, "city_progression");
      items.push(id);
    }
    const queueItemId = items.join(";") + ";";
    if (long(row, "updateTime") === idleDeadline)
      return {
        type: 12,
        itemId: id,
        queueItemId,
        durationMs,
        data: context.data("material"),
        response: encode({ itemId: sfs.string(id) }),
      };
    context.write.queueUpdates = [{ ...row, itemId: queueItemId }];
    body = queueView({ ...row, itemId: queueItemId }, {}, false);
  } else if (command === "rm.tool") {
    const index = cityInteger(int(params, "index"), 1, items.length - 1);
    items.splice(index, 1);
    context.write.queueUpdates = [{ ...row, itemId: items.join(";") + ";" }];
    body = queueView(context.write.queueUpdates[0]!, {}, false);
  } else if (command === "tool.queue.buy") {
    const prior = Math.max(1, num(context.state.quests?.mixed ?? {}, "materialBackup")),
      next = prior + 1;
    const superLevel = num(context.state.effects.vip ?? {}, "sLevel");
    if (
      next > 6 &&
      next >
        6 + Number(context.rules.power.superVip?.get(String(7009 + superLevel))?.queue_num ?? 0)
    )
      invalid();
    const rule = context.rules.role(next > 6 ? 50 + superLevel : prior),
      [type, amount] = rule.queue_unlock?.split("|") ?? [];
    if (type === "5") context.economy.gold(-cityAmount(amount));
    else context.spend(equipmentCosts(`${type};${amount}`), false);
    context.write.materialBackup = next;
    body = {
      materialBackup: sfs.int(next),
      gold: sfs.long(context.balance("gold")),
      resource: sfs.object(context.resource()),
    };
  } else body = queueView(row, {}, false);
  return { response: encode(body), event: null };
}
async function applyWorkshop(
  context: CityProgressionContext,
  action: ActivityAction,
  activity: TimedActivity,
): Promise<Fields> {
  const row = workshopQueue(context),
    items = text(row, "itemId").split(";").filter(Boolean),
    id = items[0];
  if (!id || !activity.itemId.split(";").includes(id)) invalid();
  if (action === "start") invalid();
  if (action === "restore" && num(row, "para") > 0) {
    const completed = cityInteger(num(row, "para"), 0, items.length - 1);
    for (const prior of items.splice(0, completed)) context.economy.item(prior, 1);
    context.write.queueUpdates = [{ ...row, itemId: items.join(";") + ";", para: 0 }];
    return { itemId: sfs.string(items[0]!) };
  }
  if (action === "restore" || action === "reschedule") return { itemId: sfs.string(id!) };
  if (action === "cancel") {
    context.write.queueUpdates = [{ ...row, itemId: "", para: 0 }];
    return {};
  }
  context.economy.item(id!, 1);
  items.shift();
  context.write.queueUpdates = [
    { ...row, itemId: items.length ? items.join(";") + ";" : "", para: 0 },
  ];
  refreshQuests(context, { main: 49, count: 1, key: String(Number(id) % 10) });
  return {
    add: sfs.object(
      equipmentItem(id!, quantity(context)(id!), context.economy.itemState?.(id!), context.rules),
    ),
  };
}
async function nextWorkshop(context: CityProgressionContext, activity: TimedActivity) {
  const row = workshopQueue(context),
    id = text(row, "itemId").split(";").filter(Boolean)[0];
  if (!id) return undefined;
  return {
    type: 12,
    itemId: id,
    queueItemId: text(row, "itemId"),
    durationMs: workshopDuration(context, id),
    startedAt: context.now > activity.dueAt ? context.now : activity.dueAt,
    data: context.data("material"),
    response: encode({}),
  };
}
async function accelerateWorkshop(
  context: CityProgressionContext,
  activity: TimedActivity,
  remaining: bigint,
) {
  const mixed = context.state.quests?.mixed ?? {},
    today = context.now / 86400000n;
  const used =
    long(mixed, "materialCdTime") / 86400000n === today ? num(mixed, "materialCdNum") : 0;
  if (used >= cityInteger(context.rules.items.get("equip")?.k12)) invalid();
  const id = activity.itemId.split(";")[0]!,
    make = context.rules.goods.get(id)?.make?.split("|");
  if (!make) invalid();
  const seconds = Number(remaining / 1000n),
    cost = Math.floor(
      Math.fround(cityInteger(make![2]) * Math.fround(seconds / cityInteger(make![1], 1))) + 0.5,
    );
  context.economy.gold(-BigInt(cityInteger(cost)));
  context.write.materialAcceleration = { materialCdNum: used + 1, materialCdTime: context.now };
}
export const workshopDomain: CityDomain = {
  accelerate: accelerateWorkshop,
  commands: workshopCommands,
  types: [12],
  prepare: prepareWorkshop,
  apply: applyWorkshop,
  next: nextWorkshop,
};
