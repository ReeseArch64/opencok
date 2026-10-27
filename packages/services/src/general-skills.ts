import { randomInt } from "node:crypto";
import { sfs, int, str, Type, type Fields, type Value } from "@opencok/messages/sfs";
import { num, text, long, type Row } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import {
  generalBase,
  generalBaseSkills,
  generalPairs,
  generalList,
  generalTalentPoints,
  generalFailure,
} from "@opencok/rules/general-progression";
import { activateGeneralTalent } from "@opencok/rules/general-talents";
import {
  activateGeneralRefinement,
  generalProperties,
  generalPropertiesContent,
  refineGeneralValues,
  refineGeneralTypes,
} from "@opencok/rules/general-refinement";
import { generalFeatureAvailable } from "@opencok/rules/new-general-content";
import { temporaryEffect } from "@opencok/rules/player-effects";
import { unitPower } from "@opencok/rules/military";
import { grantRewards, refreshQuests } from "./quests";
import { generalRefinement } from "@opencok/mappings/generals";
import type { CityProgressionContext } from "./city-progression";

export function generalAbility(
  context: CityProgressionContext,
  row: Row,
  action: string,
  params: Fields,
  effect: (id: number) => number,
): { row: Row; body?: Fields } {
  if (action === "activatetalent")
    return {
      row: activateGeneralTalent(
        context.rules,
        row,
        cityInteger(int(params, "talentid"), 1),
        cityInteger(int(params, "full", 0), 0, 1),
      ),
    };

  if (action === "resettalent") {
    if (!generalPairs(text(row, "talent")).size) generalFailure();

    const uuid = str(params, "goods", "");

    if (uuid) {
      const item = context.economy.ownedItem?.(uuid);

      if (item?.itemId !== "200040") generalFailure();

      context.spendItem(item.itemId, 1);
    } else
      context.economy.gold(-BigInt(cityInteger(context.rules.items.get("ability_cost")?.k3, 1)));

    return {
      row: {
        ...row,
        talent: "",
        talentpoint: generalTalentPoints(
          context.rules,
          generalBase(context.rules, num(row, "id")),
          num(row, "level"),
        ),
      },
      body: { gold: sfs.long(context.balance("gold")) },
    };
  }

  if (action === "skilluse") return useSkill(context, row, params, effect);

  if (
    !["activaterefine", "refinevalue", "refinerollback", "refinelock", "refinetype"].includes(
      action,
    )
  )
    generalFailure();

  if (
    !generalFeatureAvailable(context.rules, "general_random_effect", {
      kingdomId: context.rules.kingdomId,
      version: "12.06.0",
      now: Number(context.now),
    })
  )
    generalFailure();

  if ([3, 4, 5].includes(num(row, "state"))) generalFailure();

  let next: Row = row;

  if (action === "activaterefine") {
    const result = activateGeneralRefinement(context.rules, row, randomInt);

    if (result.cost > 0) {
      if (!result.item) generalFailure();

      context.spendItem(result.item, result.cost);
    }

    next = result.row;
  } else if (action === "refinevalue") {
    const batch = cityInteger(int(params, "batch", 0)) > 1;

    if (
      batch &&
      !generalFeatureAvailable(context.rules, "general_random_effect_10times", {
        kingdomId: context.rules.kingdomId,
        version: "12.06.0",
        now: Number(context.now),
      })
    )
      generalFailure();

    if (
      batch &&
      !context.state.effects.states.some(
        (state) =>
          state.stateId === 509047 &&
          long(state, "startTime") <= context.now &&
          long(state, "endTime") > context.now,
      )
    )
      generalFailure();

    const result = refineGeneralValues(context.rules, row, batch, randomInt),
      mixed = context.state.quests?.mixed ?? {};
    const count =
      long(mixed, "generalRefineTime") / 86400000n === context.now / 86400000n
        ? cityInteger(num(mixed, "generalRefineCount"))
        : 0;
    const free =
        !batch && count < cityInteger(context.rules.items.get("general_random_effect")?.k4),
      base = generalBase(context.rules, num(row, "id"));
    const cost = free
      ? 0
      : cityInteger(cityInteger(base.refine_card, 1) * result.count * (batch ? 10 : 1));

    if (cost) {
      if (!base.pieces_id) generalFailure();

      context.spendItem(base.pieces_id, cost);
    } else
      (context.write.generalRoster ??= {}).refinementPeriod = {
        count: count + 1,
        time: context.now,
      };

    next = { ...result.row, refinecard: cityInteger(num(row, "refinecard") + cost) };
    refreshQuests(context, { main: 63, daily: 46, count: batch ? 10 : 1, key: String(row.id) });
  } else if (action === "refinerollback") {
    const values = generalProperties(text(row, "oldrefineproperty"));

    if (!values.size) generalFailure();

    next = { ...row, refineproperty: generalPropertiesContent(values), oldrefineproperty: "" };
  } else if (action === "refinelock") {
    const index = cityInteger(int(params, "index"), 1, 5),
      lock = cityInteger(int(params, "lock"), 0, 1),
      locked = new Set(generalList(text(row, "lockproperty")));

    if (!generalProperties(text(row, "refineproperty")).has(index) || locked.has(index) === !!lock)
      generalFailure();

    if (lock) locked.add(index);
    else locked.delete(index);

    next = { ...row, lockproperty: [...locked].join(";") };
  } else {
    const result = refineGeneralTypes(context.rules, row, randomInt);
    context.economy.gold(-BigInt(result.cost));
    next = result.row;
  }

  return {
    row: next,
    body: { ...generalRefinement(next, context.rules), gold: sfs.long(context.balance("gold")) },
  };
}

function useSkill(
  context: CityProgressionContext,
  row: Row,
  params: Fields,
  effect: (id: number) => number,
) {
  if ([4, 5].includes(num(row, "state"))) generalFailure();

  const id = str(params, "skillId"),
    rule = context.rules.power.newGeneralSkills?.get(id),
    learned = generalPairs(text(row, "talent"));

  if (
    !rule ||
    !rule.cd_time ||
    (rule.class !== undefined
      ? !learned.has(Number(id))
      : !generalBaseSkills(context.rules, row).includes(Number(id)))
  )
    generalFailure();

  if (generalList(rule.replace).some((id) => learned.has(id))) generalFailure();

  const prior = context.state.generalRoster?.skills.find(
    (skill) => skill.newGeneralId === row.id && skill.skillId === id,
  );

  if (prior && (num(prior, "stat") === 1 || long(prior, "endTime") > context.now)) generalFailure();

  const cooldown = Math.max(
    0,
    Math.trunc(
      cityInteger(rule.cd_time, 1) *
        60000 *
        (1 - (rule.cdtime_effect ? effect(cityInteger(rule.cdtime_effect, 1)) : 0) / 100),
    ),
  );

  if (!Number.isSafeInteger(cooldown) || cooldown > 315360000000) generalFailure();

  const type = Number(rule.type),
    count = () =>
      cityInteger(
        Number(rule.base) +
          Math.trunc(rule.base_effect ? effect(cityInteger(rule.base_effect, 1)) : 0),
        1,
      );
  let body: Fields | undefined;
  let actTime = context.now,
    stat = 2;

  if (type === 10) {
    const statusId = cityInteger(rule.para1, 1),
      status = context.rules.power.statuses?.get(String(statusId));

    if (!status || !status.time || (status.overlap ?? "0") !== "0") generalFailure();

    actTime += BigInt(cityInteger(status.time, 1)) * 1000n;
    const write = (context.write.generalRoster ??= {});
    write.statuses = [
      {
        uid: context.owner,
        newGeneralId: num(row, "id"),
        stateId: statusId,
        startTime: context.now,
        endTime: actTime,
      },
    ];
    write.deletedStatuses = (context.state.generalRoster?.statuses ?? [])
      .filter(
        (prior) =>
          prior.newGeneralId === row.id &&
          context.rules.power.statuses?.get(text(prior, "stateId"))?.group === status.group,
      )
      .map((prior) => ({ generalId: num(row, "id"), stateId: num(prior, "stateId") }));
  } else if (type === 11) {
    const asset = (["woodbind", "stonebind", "ironbind", "foodbind", "silver"] as const)[
      cityInteger(rule.para1, 0, 4)
    ];
    context.economy.resource(asset!, BigInt(count()));
  } else if (type === 14 || type === 15) {
    let armyId = rule.para1;

    if (type === 14) {
      const choices = context.state.buildings
        .filter((building) => [423000, 424000, 425000, 426000].includes(num(building, "itemId")))
        .sort((a, b) => num(b, "level") + num(b, "star") - num(a, "level") - num(a, "star"));
      const building = choices[0];

      if (!building) generalFailure();

      const unlocked = [...context.rules.arms.values()]
        .filter(
          (army) =>
            Number(army.building) >= num(building, "itemId") &&
            Number(army.building) <= num(building, "itemId") + num(building, "level"),
        )
        .sort((a, b) => Number(b.building) - Number(a.building));
      armyId = unlocked[0]?.id;
    }

    if (!armyId || !context.rules.arms.has(armyId)) generalFailure();

    const amount = count(),
      previous = context.state.armies.find((army) => army.armyId === armyId) ?? {
        uid: context.owner,
        armyId,
        free: 0,
        level: 0,
        pve: 0,
        march: 0,
        defence: 0,
        train: 0,
        finishTime: 0n,
        foodCostTime: context.now,
      };
    context.write.armies = [{ ...previous, free: cityInteger(num(previous, "free") + amount) }];
    context.power(unitPower(context.rules.arms.get(armyId)!, amount));
  } else if (type === 16) {
    const selected = params.points,
      resource = cityInteger(int(params, "resType"), 0, 3),
      definition = (rule.para1 ?? "")
        .split("|")
        .map((entry) => entry.split(";"))
        .find(([type]) => Number(type) === resource);

    if (selected?.type !== Type.Array || !definition || definition.length !== 3) generalFailure();

    const points = selected.value as Value[];

    if (!points.length || points.length > 16 || points.some((point) => point.type !== Type.Int))
      generalFailure();

    const ids = points.map((point) => cityInteger(point.value, 0, 2147483647));

    if (new Set(ids).size !== ids.length) generalFailure();

    (context.write.generalRoster ??= {}).worldResources = ids.map((pointId) => ({
      pointId,
      type: resource,
      level: cityInteger(definition[1], 1, 100),
      amount: cityInteger(definition[2], 1),
    }));
  } else if (type === 17) grantRewards(context, rule.para1);
  else if (type === 18 || type === 21) {
    const queueType = type === 18 ? 11 : 6,
      queue = context.state.queues.find(
        (queue) =>
          queue.type === queueType &&
          num(queue, "qid") === 1 &&
          text(queue, "itemId") !== "" &&
          long(queue, "updateTime") > context.now,
      );

    if (!queue) generalFailure();

    const milliseconds = BigInt(cityInteger(rule.para1, 1)) * 1000n,
      due = long(queue, "updateTime") - milliseconds;
    (context.write.generalRoster ??= {}).accelerations = [
      { type: queueType, queueId: text(queue, "uuid"), milliseconds },
    ];
    body = {
      skillQueue: sfs.object({
        queueId: sfs.string(text(queue, "uuid")),
        updateTime: sfs.long(due > context.now ? due : context.now),
        senderId: sfs.string(context.owner),
      }),
    };
  } else if (type === 19) {
    if (!rule.para1) generalFailure();

    const plan = temporaryEffect(
      context.state.effects.states,
      context.rules,
      context.owner,
      rule.para1,
      context.now,
      1,
      randomInt,
    );
    context.write.states = plan.states;
    context.write.deletedStates = plan.deleted;
  } else if (type === 20) {
    actTime += BigInt(cityInteger(rule.duration, 1)) * 1000n;
    stat = 3;
  } else generalFailure();

  const skill = {
    uid: context.owner,
    newGeneralId: num(row, "id"),
    skillId: id,
    startTime: context.now,
    actTime,
    endTime: (type === 10 ? actTime : context.now) + BigInt(cooldown),
    stat,
  };
  (context.write.generalRoster ??= {}).skills = [skill];

  return { row, body };
}
