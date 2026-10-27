import { randomUUID } from "node:crypto";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { encode, sfs, str, int, fields, Type, type Fields } from "@opencok/messages/sfs";
import { num, long } from "@opencok/contracts/rows";
import { cityInteger, cityAmount } from "@opencok/rules/city-progression";
import { validateTalentTrees, type TalentTree } from "@opencok/hero/rules/legacy-general-talents";
import { talentTrees, activeSkill } from "@opencok/hero/mappings/legacy-general";
import { decodeGeneralAbilities } from "@opencok/hero/services/profile-generals";

import type { CityProgressionContext } from "@opencok/services/city-progression-context";

export function general(context: CityProgressionContext, id: string) {
  const row = context.state.effects.generals.find((row) => row.uuid === id);

  if (!row) {throw new GameError(errors.missing, "city_progression");}

  return row;
}

export function prepareLegacyGeneral(
  context: CityProgressionContext,
  command: string,
  params: Fields,
  applyStatus: (context: CityProgressionContext, id: string) => Fields,
) {
  let body: Fields = {};

  const row = general(context, str(params, "gUid"));
  const currentPage = num(row, "abilityIndex") || 1,
    page = cityInteger(int(params, "page", currentPage), 1, 3);
  const stored = context.state.abilityPages?.find((row) => num(row, "page") === page);
  let trees: TalentTree[] = [
    ...decodeGeneralAbilities(page === currentPage ? row.ability : stored?.ability, false),
  ].map((tree) => ({ ...tree }));
  const maximum =
    cityInteger(context.rules.role(num(context.state.profile, "level")).endowment ?? 0) +
    cityInteger(num(context.state.effects.generals[0] ?? {}, "plusSkillPoint"));

  if (command === "skill.save") {
    const root = str(params, "abilityId"),
      input = fields(params.skill);
    const tree: TalentTree = { id: root };

    for (const [id, value] of Object.entries(input)) {
      if (id === "id") {continue;}

      if (value.type !== Type.Int) {invalid();}

      const points = cityInteger(value.value);

      if (points > 0) {tree[id] = points;}
    }

    const old = trees.find((tree) => tree.id === root);

    if (
      old &&
      Object.entries(old).some(
        ([id, value]) => id !== "id" && typeof value === "number" && Number(tree[id] ?? 0) < value,
      )
    )
      {invalid();}

    trees = [...trees.filter((tree) => tree.id !== root), tree];
    body = {
      pointRemain: sfs.int(validateTalentTrees(trees, context.rules, maximum)),
      ability: talentTrees(trees),
    };
  } else if (command === "skill.clear") {
    if (str(params, "itemUUid", "").trim()) {
      const id =
        [...context.rules.goods.values()].find((rule) => rule.type === "7" && rule.para1 === "1")
          ?.id ?? "200390";
      context.spendItem(id, 1);
    } else
      {context.economy.gold(-BigInt(cityInteger(context.rules.items.get("ability_cost")?.k3, 1)));}

    trees = trees.filter((tree) => tree.ids !== undefined);
    body = { gold: sfs.long(context.balance("gold")), pointRemain: sfs.int(maximum) };
  } else if (command === "skill.switch") {
    if (page === currentPage)
      {return { response: encode({ gold: sfs.long(context.balance("gold")) }) };}

    const control = context.rules.configuration.payControl?.get("69009");

    if (
      !stored ||
      num(context.state.effects.vip ?? {}, "sLevel") < Number(control?.k2 ?? 2147483647)
    )
      {invalid();}

    validateTalentTrees(trees, context.rules, maximum);
    context.economy.gold(-BigInt(cityInteger(control?.k1, 1)));
    context.write.abilityPages = [
      {
        uid: context.owner,
        page: currentPage,
        ability: Buffer.from(JSON.stringify(decodeGeneralAbilities(row.ability, false))),
      },
    ];
    context.write.generals = [
      { ...row, abilityIndex: page, ability: Buffer.from(JSON.stringify(trees)) },
    ];

    return { response: encode({ gold: sfs.long(context.balance("gold")) }) };
  } else {
    const id = str(params, "skillId"),
      rule = context.rules.power.generalSkills?.get(id),
      subcommand = command === "skill" ? str(params, "M__REQUEST_ID__H") : command.slice(6);

    if (!rule || !trees.some((tree) => Number(tree[id] ?? 0) > 0) || rule.type === "0") {invalid();}

    const skill = context.state.skills.find((row) => row.skillId === id);

    if (!["use", "del"].includes(subcommand)) {invalid();}

    if (subcommand === "del") {
      if (!skill) {invalid();}

      context.write.deletedStates = [Number(rule!.para1)];
      context.write.skills = [{ ...skill!, actTime: context.now }];
    } else {
      if (
        skill &&
        long(skill, "endTime") < 9223372036854775807n &&
        long(skill, "endTime") > context.now
      )
        {invalid();}

      if (id === "610700") {
        const hours = cityInteger(rule!.para1, 1);

        for (const building of context.state.buildings) {
          const definition = context.rules.building(
              String(building.itemId),
              num(building, "level"),
              num(building, "star"),
              num(building, "progress"),
            ),
            resourceId = definition.effects?.productionResourceId,
            base = definition.effects?.productionPerHour;

          if (
            num(building, "level") < 1 ||
            resourceId === undefined ||
            resourceId < 0 ||
            resourceId > 3 ||
            base === undefined
          )
            {continue;}

          const asset = (["wood", "stone", "iron", "food"] as const)[resourceId]!;
          const amount = cityAmount(
            Math.trunc(base * hours * Math.max(0, 1 + context.effect(50 + resourceId) / 100)),
          );

          if (amount > 0n) {context.economy.resource(asset, amount);}
        }

        body.resource = sfs.object(context.resource());
      } else {
        if (!context.rules.power.statuses?.has(rule!.para1 ?? ""))
          {throw new GameError(errors.unsupported, "city_progression");}

        body = applyStatus(context, rule!.para1!);
      }

      if (rule!.duration)
        {context.write.states = context.write.states?.map((state) => ({
          ...state,
          endTime: context.now + BigInt(cityInteger(rule!.duration)) * 1000n,
        }));}

      const end = context.write.states?.[0]?.endTime ?? context.now;
      context.write.skills = [
        {
          uuid: skill?.uuid ?? randomUUID(),
          ownerId: context.owner,
          skillId: id,
          stat: 1,
          startTime: context.now,
          actTime: cityAmount(end),
          endTime:
            cityAmount(end) +
            BigInt(
              Math.trunc(cityInteger(rule!.cd_time) * Math.max(0.2, 1 - context.effect(415) / 100)),
            ) *
              60000n,
          param1: 0,
          param2: 0,
        },
      ];
    }

    const cooldown = context.write.skills?.[0];

    if (cooldown)
      {body = {
        ...activeSkill(cooldown),
        ...body,
        ...(context.write.states?.length ? { itemEffectObj: sfs.object(body) } : {}),
      };}

    return { response: encode(body) };
  }

  if (page === currentPage)
    {context.write.generals = [
      { ...row, abilityIndex: page, ability: Buffer.from(JSON.stringify(trees)) },
    ];}
  else
    {context.write.abilityPages = [
      { uid: context.owner, page, ability: Buffer.from(JSON.stringify(trees)) },
    ];}

  return { response: encode(body), event: null };
}

function invalid(): never {
  throw new GameError(errors.locked, "city_progression");
}
