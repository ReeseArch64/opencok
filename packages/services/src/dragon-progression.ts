import { CityCommandDomain } from "./city-command-domain.ts";
import { randomInt, randomUUID } from "node:crypto";
import { sfs, str, int, encode, Type, type Fields, type Value } from "@opencok/messages/sfs";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import { decodeWorldMarchArmy } from "@opencok/messages/world-resource-army";
import {
  dragonDefinition,
  dragonFailure,
  dragonFeature,
  dragonFriendly,
  dragonDecay,
  dragonPower,
  dragonJson,
  emptyDragonTravel,
  type DragonTravel,
} from "@opencok/rules/dragon-progression";
import { cityInteger, cityAmount, cityPrestige, cityAssets } from "@opencok/rules/city-progression";
import { nicknameLength, nicknameCharactersAllowed } from "@opencok/rules/nickname";
import { containsNicknameBadWords } from "@opencok/rules/nickname-words";
import { dragonView, dragonSkillView } from "@opencok/mappings/dragon-progression";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { chooseWeight } from "@opencok/rules/equipment";
import {
  pinProgressionReward,
  progressionRewardPreview,
  grantPinnedProgressionReward,
} from "./progression-rewards";
import type { CityDomain } from "./city-domain.ts";
import type { CityProgressionContext } from "./city-progression-context.ts";

export function dragonRoster(context: CityProgressionContext) {
  return {
    dragons: context.write.dragons?.dragons ?? context.state.dragons?.dragons ?? [],
    skills: context.write.dragons?.skills ?? context.state.dragons?.skills ?? [],
  };
}

function writeDragon(context: CityProgressionContext, row: Row) {
  const write = (context.write.dragons ??= {});
  write.dragons = [
    ...dragonRoster(context).dragons.filter((prior) => prior.uuid !== row.uuid),
    row,
  ];
}

function writeSkill(context: CityProgressionContext, row: Row) {
  const write = (context.write.dragons ??= {});
  write.skills = [...dragonRoster(context).skills.filter((prior) => prior.uuid !== row.uuid), row];
}

function marching(context: CityProgressionContext, row: Row) {
  return (context.state.dragons?.marches ?? []).some((march) => {
    const army = march.armyInfo ? decodeWorldMarchArmy(march.armyInfo as Buffer) : null;

    return army?.dragons?.some(
      (dragon) => dragon.owner === context.owner && dragon.uuid === row.uuid,
    );
  });
}

function finishTravel(
  context: CityProgressionContext,
  row: Row,
  travel: DragonTravel,
  end: bigint,
) {
  const rule = context.rules.advanced.dragonTravel?.get(String(travel.travelItemId));

  if (!rule) {dragonFailure();}

  const percent = (Number(end - BigInt(travel.travelStartTime)) / 1000 / Number(rule.time)) * 100;
  const rewards = (rule.time_reward ?? "").split("|"),
    limits = (rule.time_percent ?? "").split("|");
  let id: string | undefined;

  if (percent >= 100) {id = rewards.at(-1);}
  else
    {for (const [index, pair] of limits.entries()) {
      const [min, max] = pair.split(";").map(Number);

      if (min! <= percent && percent < max!) {
        id = rewards[index];
        break;
      }
    }}

  travel.travelState = 2;
  travel.travelEndTime = Number(end);
  travel.rewardId = id ?? null;
  travel.rewardGoods = id ? pinProgressionReward(context, id) : null;
  row.travelData = JSON.stringify(travel);
}

function settleDragon(context: CityProgressionContext, saved: Row): Row {
  const row = { ...saved },
    { base, level } = dragonDefinition(context.rules, row);

  if (
    num(row, "dragonState") === 1 &&
    context.now >= long(row, "clickEggTime") + BigInt(cityInteger(base.hatch_time)) * 1000n
  )
    {row.dragonState = 2;}

  if (long(row, "lastClickBubbleTime") / 86400000n !== context.now / 86400000n)
    {row.clickBubbleTimesForDay = 0;}

  dragonDecay(row, level, context.rules, context.now, context.effect);
  const travel = dragonJson(row.travelData, emptyDragonTravel);

  if (travel.travelState === 1) {
    const rule = context.rules.advanced.dragonTravel?.get(String(travel.travelItemId));

    if (!rule) {dragonFailure();}

    const end = BigInt(travel.travelStartTime) + BigInt(cityInteger(rule.time)) * 1000n;

    if (context.now >= end) {finishTravel(context, row, travel, end);}
  }

  writeDragon(context, row);

  return row;
}

function view(context: CityProgressionContext, row: Row) {
  const travel = dragonJson(row.travelData, emptyDragonTravel);

  return dragonView(
    row,
    dragonRoster(context).skills,
    context.rules,
    context.now,
    marching(context, row),
    context.effect,
    travel.rewardGoods
      ? rewardPreviewArray(progressionRewardPreview(travel.rewardGoods))
      : undefined,
  );
}

function requireFeature(context: CityProgressionContext, key: string) {
  if (!dragonFeature(context.rules, key, context.now)) {dragonFailure();}
}

function requireDragon(row: Row) {
  if (num(row, "dragonState") !== 3) {dragonFailure();}
}

function checkName(context: CityProgressionContext, raw: string, row?: Row) {
  const name = raw.replaceAll("\\n", " ").replaceAll("\n", " ").trim(),
    length = nicknameLength(name);

  if (
    !name ||
    name.startsWith("(") ||
    length < 3 ||
    length > 16 ||
    !name.isWellFormed() ||
    /[\p{Cc}{}]/u.test(name) ||
    !nicknameCharactersAllowed(name) ||
    containsNicknameBadWords(name, context.rules.profile.nicknameWords ?? []) ||
    dragonRoster(context).dragons.some(
      (prior) => prior.uuid !== row?.uuid && prior.nickName === name,
    )
  )
    {dragonFailure();}

  return name;
}

export function newDragonSkill(
  context: CityProgressionContext,
  id: string,
  ownerId = 0,
  index1 = -1,
) {
  const rule = context.rules.power.dragonSkills?.get(id);

  if (!rule) {dragonFailure();}

  const row = {
    uuid: randomUUID().replaceAll("-", ""),
    uid: context.owner,
    skillId: id,
    level: cityInteger(rule.init_Lv ?? 1),
    exp: 0,
    totalExp: cityInteger(rule.init_exp ?? 0),
    ownerId,
    index1,
    strengthenLevel: 0,
  };
  writeSkill(context, row);

  return row;
}

export function grantDragon(context: CityProgressionContext, id: string) {
  const base = context.rules.power.dragonBases?.get(id);

  if (!base || dragonRoster(context).dragons.some((row) => text(row, "itemId") === id))
    {dragonFailure();}

  const row: Row = {
    uuid: randomUUID().replaceAll("-", ""),
    uid: context.owner,
    itemId: cityInteger(id),
    dragonState: 1,
    friendly: 0,
    clickBubbleTimesForDay: 0,
    clickBubbleTotalTimes: 0,
    gainEggTime: context.now,
    clickEggTime: context.now,
    lastClickBubbleTime: 0n,
    useFlag: 0,
    friendShipDecreaseTime: 0n,
    exp: 0,
    initFriendShipFlag: 0,
    lastUpLevelTime: 0n,
    lv: cityInteger(base.initlevel ?? 1),
    nickName: null,
    travelData: JSON.stringify(emptyDragonTravel),
    communicateData: JSON.stringify({ communicateTimestamps: {} }),
  };
  dragonDefinition(context.rules, row);
  writeDragon(context, row);

  for (const [index, skill] of (base.skill ?? "").split("|").filter(Boolean).entries())
    {newDragonSkill(context, skill, cityInteger(id), index);}

  return row;
}

function commandGate(context: CityProgressionContext, command: string) {
  requireFeature(context, "dragon_new");

  if (command.includes("travel")) {requireFeature(context, "dragon_travel");}

  if (command === "petdragon.eat.exp" || command === "petdragon.level.up")
    {requireFeature(context, "dragon_levelup");}

  if (command.includes("nickName")) {requireFeature(context, "dragon_nickname");}
}

export const dragonProgressionCommands = [
  "dragon.init",
  "dragon.tick",
  "dragon.item",
  "petdragon.get.all",
  "petdragon.getinfo",
  "petdragon.startincubate",
  "petdragon.incubate",
  "petdragon.speed.incubate",
  "petdragon.clickbubble",
  "petdragon.communicate",
  "petdragon.sendgift",
  "petdragon.civilizedmake",
  "petdragon.change.use.flag",
  "petdragon.eat.exp",
  "petdragon.level.up",
  "petdragon.travel",
  "petdragon.travel.stop",
  "petdragon.immediately.travel",
  "petdragon.travel.take.reward",
  "petdragon.check.nickName",
  "petdragon.modify.nickName",
  "petdragon.change.skill",
  "petdragon.upgrade.skill",
];

export class DragonProgressionDomain extends CityCommandDomain {
  public readonly commands: CityDomain["commands"] = dragonProgressionCommands;

  public readonly types: CityDomain["types"] = [];

  public readonly prepare: CityDomain["prepare"] = async (context, command, params) => {
    if (command !== "dragon.init" && command !== "dragon.tick") {commandGate(context, command);}

    if (command === "dragon.item") {
      const itemId = str(params, "itemId"),
        count = cityInteger(int(params, "count"), 1, 128),
        rule = context.rules.goods.get(itemId);

      if (!rule || !["37", "40"].includes(rule.type ?? "")) {dragonFailure();}

      if (rule.type === "37") {
        if (count !== 1) {dragonFailure();}

        const row = grantDragon(context, rule.para1!);

        return { response: encode(view(context, row)) };
      }

      requireFeature(context, "dragon_skill");
      const skills = Array.from({ length: count }, () => newDragonSkill(context, rule.para1!));

      return {
        response: encode({
          petdragonSkillList: sfs.array(skills.map((row) => sfs.object(dragonSkillView(row)))),
        }),
      };
    }

    if (
      command === "dragon.init" &&
      dragonRoster(context).dragons.length === 0 &&
      dragonFeature(context.rules, "dragon_new", context.now)
    ) {
      const id = context.rules.items.get("dragon_new")?.k5;

      if (!id) {dragonFailure();}

      const row = grantDragon(context, id);
      writeDragon(context, { ...row, dragonState: 0, useFlag: 1, clickEggTime: 0n });
    }

    for (const dragon of dragonRoster(context).dragons) {
      const { base } = dragonDefinition(context.rules, dragon);

      for (const [index, id] of (base.skill ?? "").split("|").filter(Boolean).entries())
        {if (
          !dragonRoster(context).skills.some(
            (skill) =>
              num(skill, "ownerId") === num(dragon, "itemId") && num(skill, "index1") === index,
          )
        )
          {newDragonSkill(context, id, num(dragon, "itemId"), index);}}
    }

    const original = dragonRoster(context).dragons;

    for (const row of original) {settleDragon(context, row);}

    if (command === "dragon.tick") {return { response: encode({}), event: null };}

    if (command === "dragon.init" || command === "petdragon.get.all")
      {return {
        response: encode({
          userPetDragonList: sfs.array(
            dragonRoster(context).dragons.map((row) => sfs.object(view(context, row))),
          ),
          petdragonSkillList: sfs.array(
            dragonRoster(context).skills.map((row) => sfs.object(dragonSkillView(row))),
          ),
        }),
        event: null,
      };}

    if (command === "petdragon.civilizedmake") {
      const id = str(params, "petDragonTableId"),
        base = context.rules.power.dragonBases?.get(id),
        condition = base?.reputation_condition?.split(";");

      if (
        !condition ||
        condition.length !== 2 ||
        cityPrestige(context.state, context.rules, cityInteger(condition[0])) <
          cityInteger(condition[1])
      )
        {dragonFailure();}

      const row = grantDragon(context, id);

      return {
        response: encode({}),
        pushes: [{ command: "push.petdragon.info", body: encode(view(context, row)) }],
      };
    }

    if (command === "petdragon.check.nickName") {
      const raw = str(params, "nickName"),
        length = nicknameLength(raw);
      let valid = true;

      try {
        checkName(context, raw);
      } catch {
        valid = false;
      }

      return {
        response: encode({
          occupied: sfs.int(valid ? 0 : 1),
          exist: sfs.int(valid ? 0 : 1),
          length: sfs.int(length),
          remainLength: sfs.int(16 - length),
        }),
        event: null,
      };
    }

    if (command === "petdragon.upgrade.skill" || command === "petdragon.change.skill")
      {return { response: encode(dragonSkillCommand(context, command, params)) };}

    const saved = dragonRoster(context).dragons.find(
      (row) => row.uuid === str(params, "petDragonUid"),
    );

    if (!saved) {dragonFailure();}

    const row = { ...saved },
      { base, level } = dragonDefinition(context.rules, row),
      global = context.rules.items.get("dragon_new");

    if (!global) {dragonFailure();}

    let extra: Fields = {};

    if (command === "petdragon.getinfo")
      {return { response: encode(view(context, row)), event: null };}

    if (command === "petdragon.startincubate") {
      if (num(row, "dragonState") === 0) {
        row.dragonState = 1;
        row.clickEggTime = context.now;
      } else if (num(row, "dragonState") !== 1 && num(row, "dragonState") !== 2) {dragonFailure();}
    } else if (command === "petdragon.incubate") {
      if (num(row, "dragonState") !== 2) {dragonFailure();}

      row.dragonState = 3;
      row.friendly = cityInteger(level.friendship);
      row.initFriendShipFlag = 1;
      row.friendShipDecreaseTime = context.now;
      row.lastClickBubbleTime = context.now;

      if (
        !dragonRoster(context).dragons.some(
          (prior) => num(prior, "dragonState") === 3 && num(prior, "useFlag") === 1,
        )
      )
        {row.useFlag = 1;}

      context.power(dragonPower(row, context.rules));
    } else if (command === "petdragon.speed.incubate") {
      if (num(row, "dragonState") !== 1) {dragonFailure();}

      const item = context.economy.ownedItem?.(str(params, "goodsUuid"));

      if (!item) {dragonFailure();}

      const good = context.rules.goods.get(item.itemId),
        count = cityInteger(int(params, "useGoodsNum"), 1, 32767);

      if (good?.para1 !== "1" || good.para2 !== "1" || good.type !== "2") {dragonFailure();}

      context.spendItem(item.itemId, count);
      row.clickEggTime =
        long(row, "clickEggTime") - BigInt(cityInteger(good.para3)) * BigInt(count) * 1000n;

      if (context.now >= long(row, "clickEggTime") + BigInt(cityInteger(base.hatch_time)) * 1000n)
        {row.dragonState = 2;}

      extra = {
        goodsItemId: sfs.string(item.itemId),
        goodsCurrCount: sfs.int(context.economy.quantity?.(item.itemId) ?? 0),
      };
    } else {
      requireDragon(row);
      const travel = dragonJson(row.travelData, emptyDragonTravel),
        max = cityInteger(level.friendship);

      if (command === "petdragon.clickbubble") {
        if (
          num(row, "clickBubbleTimesForDay") >= cityInteger(global.k3) ||
          context.now < long(row, "lastClickBubbleTime") + BigInt(cityInteger(global.k2)) * 1000n
        )
          {dragonFailure();}

        row.clickBubbleTimesForDay = num(row, "clickBubbleTimesForDay") + 1;
        row.clickBubbleTotalTimes = cityInteger(num(row, "clickBubbleTotalTimes") + 1);
        row.lastClickBubbleTime = context.now;
        dragonFriendly(row, cityInteger(global.k4), max, context.now);
      } else if (command === "petdragon.communicate") {
        requireFeature(context, "dragon_friendship");
        const kind = cityInteger(int(params, "communicateId"), 0, 3),
          communication = dragonJson(row.communicateData, {
            communicateTimestamps: {} as Record<string, number>,
          });
        const threshold = cityInteger(base.communicate_cond?.split("|")[kind]),
          cd = Math.max(
            0,
            Math.trunc(
              Math.fround(Number(level.communicate_cooltime?.split("|")[kind])) *
                Math.fround(1 - Math.max(context.effect(490 + kind) / 100, 0)),
            ),
          );

        if (
          num(row, "friendly") < threshold ||
          num(row, "friendly") >= max ||
          context.now < BigInt(communication.communicateTimestamps[kind] ?? 0) + BigInt(cd) * 1000n
        )
          {dragonFailure();}

        dragonFriendly(
          row,
          Math.trunc(
            Number(level.communicate_friendship?.split("|")[kind]) + context.effect(481 + kind),
          ),
          max,
          context.now,
        );
        communication.communicateTimestamps[kind] = Number(context.now);
        row.communicateData = JSON.stringify(communication);
      } else if (command === "petdragon.sendgift") {
        const item = context.economy.ownedItem?.(str(params, "goodsUuid")),
          count = cityInteger(int(params, "useGoodsNum"), 1, 32767);

        if (
          !item ||
          !(base.gift ?? "").split("|").includes(item.itemId) ||
          num(row, "friendly") >= max
        )
          {dragonFailure();}

        const good = context.rules.goods.get(item.itemId);

        if (!good) {dragonFailure();}

        context.spendItem(item.itemId, count);
        dragonFriendly(
          row,
          Math.trunc(
            Number(good.para1 ?? 0) * count +
              Math.fround(Number(good.para2 ?? 0) / 100) * max * count,
          ),
          max,
          context.now,
        );
        extra = {
          goodsItemId: sfs.string(item.itemId),
          goodsCurrCount: sfs.int(context.economy.quantity?.(item.itemId) ?? 0),
        };
      } else if (command === "petdragon.modify.nickName") {
        const nickName = checkName(context, str(params, "nickName"), row);
        context.economy.gold(-cityAmount(base.nickname_cost));
        row.nickName = nickName;
        extra = {
          petDragonUid: sfs.string(text(row, "uuid")),
          nickName: sfs.string(nickName),
          gold: sfs.long(context.balance("gold")),
        };
      } else if (command === "petdragon.change.use.flag") {
        if (num(row, "useFlag") === 1) {return { response: encode({}), event: null };}

        if (
          marching(context, row) ||
          context.now < (context.state.dragons?.switchedAt ?? 0n) + 3000n
        )
          {dragonFailure();}

        const previous = dragonRoster(context).dragons.find(
          (prior) => num(prior, "useFlag") === 1 && num(prior, "dragonState") === 3,
        );

        if (previous) {
          if (marching(context, previous)) {dragonFailure();}

          writeDragon(context, { ...previous, useFlag: 0 });
        }

        row.useFlag = 1;
        extra = {
          oldUseUuid: sfs.string(previous ? text(previous, "uuid") : ""),
          newUseUuid: sfs.string(text(row, "uuid")),
        };
      } else if (command === "petdragon.eat.exp") {
        if (num(row, "exp") >= cityInteger(level.exp)) {dragonFailure();}

        const count = cityInteger(int(params, "count", 1), 1, 32767),
          kind = cityInteger(int(params, "eatExpType"), 0, 1);

        if (kind === 0) {context.economy.gold(-cityAmount(level.exp_gold) * BigInt(count));}
        else {
          const costs: Partial<Record<(typeof cityAssets)[number], bigint>> = {};

          for (const pair of (level.exp_resource ?? "").split("|").filter(Boolean)) {
            const [asset, amount] = pair.split(";");
            costs[cityAssets[cityInteger(asset, 0, 4)]!] = cityAmount(amount) * BigInt(count);
          }

          context.spend(costs, false);
        }

        let gained: number;

        if (count === 1) {
          const crit = (level.exp_crit ?? "1;1")
            .split("|")
            .map((pair) => pair.split(";").map(Number));
          const chosen = chooseWeight(
            crit.map((pair) => cityInteger(pair[1])),
            randomInt,
          );
          gained = Math.trunc(Math.fround(Number(level.exp_once)) * Math.fround(crit[chosen]![0]!));
        } else {
          const [mult, round] = (base.hold_crit ?? "1;1").split(";").map(Number);

          if (!round || !mult) {dragonFailure();}

          const crit = Math.trunc(count / round);
          gained =
            Number(level.exp_once) * (count - crit) +
            Math.trunc(Math.fround(Number(level.exp_once)) * mult * crit);
        }

        row.exp = cityInteger(num(row, "exp") + gained);
        extra = {
          userResource: sfs.object({
            ...context.resource(),
            gold: sfs.long(context.balance("gold")),
          }),
        };
      } else if (command === "petdragon.level.up") {
        const next = context.rules.power.dragonLevels?.get(level.nextLevelItemId ?? "");

        if (
          !next ||
          num(row, "exp") < cityInteger(level.exp) ||
          Number(next.base_id) !== num(row, "itemId")
        )
          {dragonFailure();}

        for (const pair of (level.level_item ?? "").split("|").filter(Boolean)) {
          const [id, count] = pair.split(";");

          if (!id) {dragonFailure();}

          context.spendItem(
            id,
            Math.max(0, Math.trunc(Number(count) * Math.fround(1 - context.effect(2381) / 100))),
          );
        }

        const before = dragonPower(row, context.rules);
        row.exp = num(row, "exp") - cityInteger(level.exp);
        row.lv = cityInteger(next.level, 1, 127);
        row.friendly = cityInteger(next.friendship);
        row.lastUpLevelTime = context.now;
        context.power(dragonPower(row, context.rules) - before);
        extra = {
          remainItems: sfs.array(
            Object.keys(context.items).map((id) =>
              sfs.object({
                itemId: sfs.string(id),
                count: sfs.int(context.economy.quantity?.(id) ?? 0),
              }),
            ),
          ),
        };
      } else if (command === "petdragon.travel") {
        if (
          travel.travelState !== 0 ||
          dragonRoster(context).dragons.some(
            (prior) => dragonJson(prior.travelData, emptyDragonTravel).travelState === 1,
          ) ||
          marching(context, row)
        )
          {dragonFailure();}

        const types = (level.travel ?? "").split("|"),
          index = cityInteger(int(params, "travelType"), 1, types.length),
          type = types[index - 1]!,
          ratio = (num(row, "friendly") / max) * 100;
        const candidates = [...(context.rules.advanced.dragonTravel?.values() ?? [])].filter(
          (rule) => rule.type === type,
        );
        const rule =
          candidates.find((rule) => {
            const [min, max] = (rule.friendship_cond ?? "").split(";").map(Number);

            return min! <= ratio && ratio < max!;
          }) ??
          (ratio >= 100
            ? candidates
                .sort(
                  (a, b) =>
                    Number(a.friendship_cond?.split(";")[1]) -
                    Number(b.friendship_cond?.split(";")[1]),
                )
                .at(-1)
            : undefined);

        if (!rule) {dragonFailure();}

        Object.assign(travel, {
          travelState: 1,
          travelType: Number(type),
          travelItemId: cityInteger(rule.id),
          travelStartTime: Number(context.now),
          travelEndTime: 0,
          rewardId: null,
          rewardGoods: null,
        });
        row.travelData = JSON.stringify(travel);
      } else if (
        command === "petdragon.travel.stop" ||
        command === "petdragon.immediately.travel"
      ) {
        if (travel.travelState !== 1) {dragonFailure();}

        let end = context.now;

        if (command === "petdragon.immediately.travel") {
          const rule = context.rules.advanced.dragonTravel?.get(String(travel.travelItemId));
          end = BigInt(travel.travelStartTime) + BigInt(cityInteger(rule?.time)) * 1000n;
          const cost = Math.ceil(
            Math.fround(Number(context.rules.items.get("dragon")?.k2)) *
              Number((end - context.now) / 1000n),
          );

          if (cost < 0 || cost > num(row, "friendly")) {dragonFailure();}

          dragonFriendly(row, -cost, max, context.now);
        }

        finishTravel(context, row, travel, end);
      } else if (command === "petdragon.travel.take.reward") {
        if (travel.travelState !== 2) {dragonFailure();}

        if (travel.rewardGoods)
          {extra = {
            awardItems: sfs.object({
              rewards: grantPinnedProgressionReward(context, travel.rewardGoods),
            }),
          };}

        Object.assign(travel, {
          travelState: 0,
          travelEndTime: 0,
          rewardId: null,
          rewardGoods: null,
        });
        row.travelData = JSON.stringify(travel);
      } else {dragonFailure();}
    }

    writeDragon(context, row);

    if (command === "petdragon.modify.nickName" || command === "petdragon.change.use.flag")
      {return { response: encode(extra) };}

    return { response: encode({ ...view(context, row), ...extra }) };
  };

  public readonly apply: CityDomain["apply"] = async () => {
    dragonFailure();
  };
}

export const dragonProgressionDomain: CityDomain = new DragonProgressionDomain();

function dragonSkillCommand(
  context: CityProgressionContext,
  command: string,
  params: Fields,
): Fields {
  requireFeature(context, "dragon_skill");
  requireFeature(
    context,
    command === "petdragon.upgrade.skill" ? "dragon_skill_levelup" : "dragon_skill_learn",
  );
  const skills = dragonRoster(context).skills,
    target = skills.find((row) => row.uuid === str(params, "uuid"));

  if (!target) {dragonFailure();}

  const row = { ...target },
    rule = context.rules.power.dragonSkills?.get(text(row, "skillId"));

  if (!rule) {dragonFailure();}

  if (command === "petdragon.change.skill") {
    const replacement = skills.find((prior) => prior.uuid === str(params, "replaceUuid")),
      dragon = dragonRoster(context).dragons.find(
        (prior) => prior.uuid === str(params, "dragonUuid"),
      );

    if (
      !replacement ||
      !dragon ||
      num(replacement, "ownerId") !== 0 ||
      num(row, "ownerId") !== num(dragon, "itemId") ||
      marching(context, dragon)
    )
      {dragonFailure();}

    const replacementRule = context.rules.power.dragonSkills?.get(text(replacement, "skillId")),
      { base } = dragonDefinition(context.rules, dragon);

    if (
      !replacementRule ||
      rule.type !== "1" ||
      replacementRule.type !== "1" ||
      num(dragon, "lv") < cityInteger(rule.unlock_lv) ||
      Number(replacementRule.quality) >
        Number(base.skill_slot_quality?.split("|")[num(row, "index1")]) ||
      !(
        replacementRule.skill_learn_object === "all" ||
        (replacementRule.skill_learn_object ?? "").split("|").includes(text(dragon, "itemId"))
      )
    )
      {dragonFailure();}

    if (
      replacementRule.is_special === "1" &&
      skills.some(
        (prior) =>
          prior.uuid !== row.uuid &&
          num(prior, "ownerId") === num(dragon, "itemId") &&
          context.rules.power.dragonSkills?.get(text(prior, "skillId"))?.is_special === "1",
      )
    )
      {dragonFailure();}

    context.economy.gold(-cityAmount(rule.learn_gold));
    writeSkill(context, {
      ...replacement,
      ownerId: num(row, "ownerId"),
      index1: num(row, "index1"),
    });
    row.ownerId = 0;
    row.index1 = -1;
    writeSkill(context, row);

    return {
      gold: sfs.long(context.balance("gold")),
      skillInfo: sfs.string(
        dragonRoster(context)
          .skills.filter((prior) => num(prior, "ownerId") === num(dragon, "itemId"))
          .sort((a, b) => num(a, "index1") - num(b, "index1"))
          .map((prior) => text(prior, "uuid"))
          .join("|"),
      ),
      petdragonSkillList: sfs.array(
        dragonRoster(context)
          .skills.filter((prior) => prior.uuid === row.uuid || prior.uuid === replacement.uuid)
          .map((prior) => sfs.object(dragonSkillView(prior))),
      ),
    };
  }

  const material = params.materialArr;

  if (material?.type !== Type.Array) {dragonFailure();}

  const ids = (material.value as Value[]).map((value) => str({ id: value }, "id"));

  if (
    ids.length < 1 ||
    ids.length > 128 ||
    new Set(ids).size !== ids.length ||
    ids.includes(text(row, "uuid"))
  )
    {dragonFailure();}

  const materials = ids.map((id) => {
    const source = skills.find((prior) => prior.uuid === id),
      sourceRule = source
        ? context.rules.power.dragonSkills?.get(text(source, "skillId"))
        : undefined;

    if (!source || !sourceRule || num(source, "ownerId") !== 0 || sourceRule.born_dragon)
      {dragonFailure();}

    return source;
  });
  const boosters = materials.filter((source) => rule.boost_condition === source.skillId),
    ordinary = materials.filter((source) => rule.boost_condition !== source.skillId),
    boostLimit = cityInteger(rule.boost_level ?? 0),
    baseMaximum = cityInteger(rule.maxLv, 1),
    maximumStrength = Math.min(boostLimit, num(row, "strengthenLevel") + boosters.length);

  if (num(row, "level") >= baseMaximum + maximumStrength) {dragonFailure();}

  const consumed: string[] = [];
  const addExperience = (source: Row, maximum: number) => {
    const gained = cityInteger(
      Math.trunc(
        Math.fround(
          Math.fround(num(source, "totalExp")) *
            Math.fround(Number(context.rules.items.get("dragon_new")?.k13)),
        ),
      ),
    );
    row.exp = cityInteger(num(row, "exp") + gained);
    let discarded = 0;

    for (let guard = 0; guard < 1000; guard++) {
      const thresholds = [...(context.rules.advanced.dragonSkillExp?.values() ?? [])].filter(
        (entry) => entry.quality === rule.quality && Number(entry.level) === num(row, "level"),
      );

      if (thresholds.length !== 1) {dragonFailure();}

      const threshold = cityInteger(thresholds[0]!.exp, 1);

      if (num(row, "exp") < threshold) {break;}

      if (num(row, "level") >= maximum) {
        discarded = num(row, "exp") - threshold + 1;
        row.exp = threshold - 1;
        break;
      }

      row.exp = num(row, "exp") - threshold;
      row.level = num(row, "level") + 1;
    }

    row.totalExp = cityInteger(num(row, "totalExp") + gained - discarded);
    consumed.push(text(source, "uuid"));

    return num(row, "level") >= maximum;
  };

  for (const source of boosters) {
    const full = addExperience(source, baseMaximum + maximumStrength);
    row.strengthenLevel = Math.min(boostLimit, num(row, "strengthenLevel") + 1);

    if (full && num(row, "strengthenLevel") === boostLimit) {break;}
  }

  if (num(row, "level") < baseMaximum + num(row, "strengthenLevel"))
    {for (const source of ordinary)
      {if (addExperience(source, baseMaximum + num(row, "strengthenLevel"))) {break;}}}

  if (!consumed.length) {dragonFailure();}

  writeSkill(context, row);
  const write = context.write.dragons!;
  write.deletedSkills = consumed;
  write.skills = dragonRoster(context).skills.filter(
    (prior) => !consumed.includes(text(prior, "uuid")),
  );

  return { petdragonSkillList: sfs.array([sfs.object(dragonSkillView(row))]) };
}
