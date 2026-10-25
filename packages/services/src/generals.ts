import { restoredResourceGenerals } from "./world-resource-generals";
import { newGeneralPrestigeLevel } from "@opencok/rules/new-general-prestige";
import { generalPrison, recoverGenerals } from "./general-recovery";
import { legacyGeneralCommand } from "./legacy-generals";
import { generalTurntable } from "./general-turntable";
import {
  assignGeneral,
  generalOfficeCommand,
  refreshGeneralOffices,
  refreshGeneralUnlocks,
} from "./general-assignments";
import { generalAbility } from "./general-skills";
import { generalProperties, generalPropertyRule } from "@opencok/rules/general-refinement";
import { generalFeatureAvailable } from "@opencok/rules/new-general-content";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { encode, sfs, str, int, Type, fields, type Fields } from "@opencok/messages/sfs";
import { num, text, long, type Row } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import {
  generalBase,
  generalBaseSkills,
  generalRecruit,
  generalPairs,
  generalExperience,
  generalBreach,
  generalStar,
  generalBaseSkillUpgrade,
  generalFailure,
} from "@opencok/rules/general-progression";
import { newGeneralSkillEffects } from "@opencok/rules/new-general-skills";
import { newGeneralEquipmentEffects } from "@opencok/rules/new-general-equipment";
import { newGeneral, generalPurchase, generalRefinement } from "@opencok/mappings/generals";
import type { CityDomain, CityProgressionContext } from "./city-progression";

export function generalRoster(context: CityProgressionContext) {
  return (
    context.state.generalRoster ?? {
      generals: [],
      purchases: [],
      skills: [],
      statuses: [],
      offices: [],
    }
  );
}
export function ownedGeneral(context: CityProgressionContext, id: number) {
  const row =
    context.write.generalRoster?.generals?.find((row) => row.id === id) ??
    generalRoster(context).generals.find((row) => row.id === id);
  if (!row) throw new GameError(errors.missing, "city_progression");
  generalBase(context.rules, id);
  return row;
}
export function writeGeneral(context: CityProgressionContext, row: Row) {
  const write = (context.write.generalRoster ??= {});
  write.generals = [...(write.generals ?? []).filter((prior) => prior.id !== row.id), row];
}
export function generalEffects(context: CityProgressionContext, row: Row) {
  const state = {
    id: num(row, "id"),
    star: num(row, "star"),
    baseSkill: text(row, "baseSkill"),
    talent: text(row, "talent"),
  };
  const effects = newGeneralSkillEffects(state, context.rules);
  const writtenEquipment = context.write.equipment ?? [],
    equipmentRows = [
      ...context.state.equipment.filter(
        (item) => !writtenEquipment.some((next) => next.uuid === item.uuid),
      ),
      ...writtenEquipment,
    ];
  const projected = restoredResourceGenerals(
    {
      ...context.state.newGenerals,
      generals: [
        {
          id: state.id,
          state: num(row, "state"),
          buildingUuid: text(row, "buildingUuid"),
          star: state.star,
          baseSkill: state.baseSkill,
          talent: state.talent,
          opTime: text(row, "optime"),
          refinement: text(row, "refineproperty"),
        },
      ],
      equipment: equipmentRows
        .filter((item) => num(item, "generalid") > 0)
        .sort((a, b) =>
          text(a, "uuid") < text(b, "uuid") ? -1 : text(a, "uuid") > text(b, "uuid") ? 1 : 0,
        )
        .map((item) => ({
          uid: context.owner,
          uuid: text(item, "uuid"),
          generalId: num(item, "generalid"),
          itemId: num(item, "itemId"),
          extraProperty: text(item, "extraProperty"),
        })),
    },
    context.rules,
  )[0];
  const equipment = projected?.orderedEquipment ?? [];
  const permanent = [
    effects.skills,
    effects.talents,
    newGeneralEquipmentEffects(state.id, equipment, context.rules, context.effect),
  ];
  const buff: Fields[] = [];
  const append = (id: number, value: number, start = 0n, end = 9223372036854775807n) =>
    buff.push({
      effectid: sfs.int(id),
      effectvalue: { type: Type.Float, value },
      begintime: sfs.long(start),
      endtime: sfs.long(end),
    });
  const statuses = new Map(
    generalRoster(context)
      .statuses.filter((status) => status.newGeneralId === row.id)
      .map((status) => [num(status, "stateId"), status]),
  );
  for (const status of context.write.generalRoster?.statuses ?? [])
    if (status.newGeneralId === row.id) statuses.set(num(status, "stateId"), status);
  for (const deleted of context.write.generalRoster?.deletedStatuses ?? [])
    if (deleted.generalId === row.id) statuses.delete(deleted.stateId);
  for (const status of context.write.generalRoster?.statuses ?? [])
    if (status.newGeneralId === row.id) statuses.set(num(status, "stateId"), status);
  for (const status of statuses.values()) {
    if (long(status, "startTime") > context.now || long(status, "endTime") < context.now) continue;
    for (const entry of (context.rules.power.statuses?.get(text(status, "stateId"))?.effect ?? "")
      .split("|")
      .filter(Boolean)) {
      const [id, value] = entry.split(";").map(Number);
      if (!Number.isInteger(id) || !Number.isFinite(value)) generalFailure();
      append(id!, value!, long(status, "startTime"), long(status, "endTime"));
    }
  }
  for (const values of permanent) for (const [id, value] of values) append(id, value);
  if (
    generalFeatureAvailable(context.rules, "general_random_effect", {
      kingdomId: context.rules.kingdomId,
      version: "12.06.0",
      now: Number(context.now),
    })
  ) {
    for (const property of generalProperties(text(row, "refineproperty")).values())
      for (const id of (generalPropertyRule(context.rules, property.id).effect ?? "")
        .split(";")
        .filter(Boolean))
        append(cityInteger(id, 1), property.value);
  }
  return buff;
}
export function generalView(context: CityProgressionContext, row: Row) {
  const roster = generalRoster(context),
    skills = [
      ...roster.skills.filter(
        (skill) =>
          !context.write.generalRoster?.skills?.some(
            (next) => next.newGeneralId === skill.newGeneralId && next.skillId === skill.skillId,
          ),
      ),
      ...(context.write.generalRoster?.skills ?? []),
    ].map((skill) => ({ ...skill }));
  const activeIds = [
    ...new Set([
      ...generalBaseSkills(context.rules, row),
      ...generalPairs(text(row, "talent")).keys(),
    ]),
  ].filter((id) => Number(context.rules.power.newGeneralSkills?.get(String(id))?.type ?? 0) !== 0);
  for (const id of activeIds) {
    const saved = skills.find(
      (skill) => skill.newGeneralId === row.id && skill.skillId === String(id),
    );
    if (!saved)
      skills.push({
        newGeneralId: num(row, "id"),
        skillId: String(id),
        actTime: 0n,
        endTime: 9223372036854775807n,
        stat: 0,
      });
    else if (long(saved, "endTime") <= context.now) {
      saved.stat = 0;
      saved.endTime = 9223372036854775807n;
      saved.actTime = 0n;
    }
  }
  const office =
    context.write.generalRoster?.offices?.find((office) => office.id === row.id) ??
    roster.offices.find((office) => office.id === row.id);
  return {
    ...newGeneral(row, generalEffects(context, row), skills, office),
    ...generalRefinement(row, context.rules),
  };
}
export function generalChanges(context: CityProgressionContext, rows: readonly Row[]) {
  return { generallist: sfs.array(rows.map((row) => sfs.object(generalView(context, row)))) };
}
export function recruitGeneral(context: CityProgressionContext, id: number, fragments = true) {
  const base = generalBase(context.rules, id),
    roster = generalRoster(context);
  const building = [...(context.write.buildings ?? []), ...context.state.buildings].find(
    (row) => row.itemId === 433000 && num(row, "level") > 0,
  );
  if (!building) throw new GameError(errors.locked, "city_progression");
  const pending = context.write.generalRoster?.generals ?? [],
    ids = new Set([...roster.generals, ...pending].map((row) => num(row, "id")));
  const capacity = cityInteger(
    context.rules.building(
      "433000",
      num(building, "level"),
      num(building, "star"),
      num(building, "progress"),
    ).clientParameters?.[0]?.value,
    1,
    256,
  );
  if (ids.has(id) || ids.size >= capacity) generalFailure();
  if (base.faction && base.faction !== "0") {
    const faction = cityInteger(base.faction, 1),
      prestige = newGeneralPrestigeLevel(
        num(context.state.profile, "civilizationType"),
        context.state.effects.prestige.map((row) => ({
          civilizationType: num(row, "civilizationType"),
          prestigeValue: long(row, "prestigeValue"),
        })),
        context.rules,
      );
    if (
      faction !== num(context.state.profile, "civilizationType") ||
      prestige < cityInteger(base.reputation_level)
    )
      generalFailure();
  }
  if (fragments && (!base.faction || base.faction === "0")) {
    const costs = generalPairs(base.need_pieces);
    if (costs.size !== 1) generalFailure();
    for (const [item, count] of costs) context.spendItem(String(item), count);
  }
  const row = generalRecruit(context.rules, id, context.owner, context.now);
  writeGeneral(context, row);
  return row;
}
async function prepare(context: CityProgressionContext, command: string, params: Fields) {
  let body: Fields;
  let event: Uint8Array | null | undefined;
  const feature = (key: string) =>
    generalFeatureAvailable(context.rules, key, {
      kingdomId: context.rules.kingdomId,
      version: "12.06.0",
      now: Number(context.now),
    });
  if (
    (command === "newgeneral" && !feature("general")) ||
    (command === "newgeneral.buy" && !feature("general_sale"))
  )
    generalFailure();
  recoverGenerals(context, command === "general.init");
  if (command === "general.init" && !feature("general"))
    return { response: encode({ data: sfs.object({}) }), responseKind: "nested" as const };
  if (command === "general.init") {
    refreshGeneralUnlocks(context);
    refreshGeneralOffices(context);
    body = {
      ...generalChanges(context, [
        ...generalRoster(context).generals.filter(
          (row) => !context.write.generalRoster?.generals?.some((next) => next.id === row.id),
        ),
        ...(context.write.generalRoster?.generals ?? []),
      ]),
      generalBuyList: sfs.array(
        generalRoster(context).purchases.map((row) => sfs.object(generalPurchase(row))),
      ),
    };
    event = encode({ at: sfs.long(context.now) });
  } else if (
    ["general.fire", "general.def.ch", "general.pick", "general.recruit"].includes(command)
  ) {
    body = legacyGeneralCommand(context, command, params);
  } else if (command === "robgeneral") {
    body = generalPrison(context, params);
  } else if (command === "generaltrun") {
    const result = generalTurntable(context, params);
    body = result.body;
    event = result.event;
  } else if (command === "heroOffice") {
    body = {
      ...generalOfficeCommand(context, params),
      ...generalChanges(context, context.write.generalRoster?.generals ?? []),
    };
  } else if (command === "newgeneral.buy") {
    const id = cityInteger(int(params, "generalId"), 1),
      type = cityInteger(int(params, "buyCountType"), 1, 4),
      count = cityInteger(int(params, "buyCount", 1), 1, 1000);
    const base = generalBase(context.rules, id),
      sale = context.rules.configuration.generalSales?.get(base.sale_id ?? "");
    if (!sale) generalFailure();
    const previous = generalRoster(context).purchases.find((row) => row.generalId === id) ?? {
        uid: context.owner,
        generalId: id,
      },
      key = `countType${type}`,
      purchased = cityInteger(num(previous, key) + count);
    if (sale.limit === "1" && purchased > cityInteger(sale[`sale_num${type}`])) generalFailure();
    const pieces = [...generalPairs(base.need_pieces).keys()];
    if (pieces.length !== 1) generalFailure();
    const cost = BigInt(cityInteger(sale[`sale_price${type}`], 1)) * BigInt(count);
    context.economy.gold(-cost);
    const quantity = cityInteger(cityInteger(sale[`card_num${type}`], 1) * count),
      itemId = String(pieces[0]);
    context.economy.item(itemId, quantity);
    const row = { ...previous, [key]: purchased };
    (context.write.generalRoster ??= {}).purchases = [row];
    body = {
      gold: sfs.long(context.balance("gold")),
      itemId: sfs.string(itemId),
      count: sfs.int(quantity),
      generalBuyList: sfs.array([sfs.object(generalPurchase(row))]),
    };
  } else {
    const action = str(params, "M__REQUEST_ID__H"),
      id = cityInteger(int(params, "id"), 1);
    if (action === "recruit") {
      const row = recruitGeneral(context, id),
        itemId = String([...generalPairs(generalBase(context.rules, id).need_pieces).keys()][0]);
      body = {
        ...generalChanges(context, [row]),
        itemId: sfs.string(itemId),
        count: sfs.int(context.economy.quantity?.(itemId) ?? 0),
      };
    } else {
      const row = ownedGeneral(context, id);
      if (["garrison", "canclegarrison"].includes(action)) {
        assignGeneral(context, row, action, params);
        body = generalChanges(context, context.write.generalRoster?.generals ?? []);
      } else if (action === "addexp") {
        const uuid = str(params, "goods"),
          item = context.economy.ownedItem?.(uuid),
          rule = item && context.rules.goods.get(item.itemId);
        if (!item || rule?.type !== "3" || rule.para1 !== "109") generalFailure();
        const base = generalBase(context.rules, id);
        if (
          (rule.para3 === undefined && base.lord_exp !== "1") ||
          (rule.para3 !== undefined &&
            rule.para3 !== "all" &&
            !rule.para3.split(";").includes(String(id)))
        )
          generalFailure();
        const result = generalExperience(
          context.rules,
          row,
          cityInteger(rule.para2, 1),
          cityInteger(int(params, "count"), 1, 10000),
        );
        context.spendItem(item.itemId, result.used);
        writeGeneral(context, result.row);
        body = {
          ...generalChanges(context, [result.row]),
          expitem: sfs.object({
            itemId: sfs.string(item.itemId),
            uuid: sfs.string(uuid),
            count: sfs.int(context.economy.quantity?.(item.itemId) ?? 0),
          }),
        };
      } else if (["breach", "star", "baseskillup"].includes(action)) {
        const result =
          action === "breach"
            ? generalBreach(context.rules, row)
            : action === "star"
              ? generalStar(context.rules, row)
              : generalBaseSkillUpgrade(
                  context.rules,
                  row,
                  cityInteger(int(params, "baseskillid"), 1),
                );
        for (const [item, count] of result.costs)
          if (count > 0) context.spendItem(String(item), count);
        writeGeneral(context, result.row);
        body = {
          ...generalChanges(context, [result.row]),
          buff: sfs.array(generalEffects(context, result.row).map(sfs.object)),
        };
        if (action === "breach") body.breach = sfs.string(text(result.row, "breach"));
        if (action === "star") body.star = sfs.int(num(result.row, "star"));
        if (action === "baseskillup") {
          body.id = sfs.int(int(params, "baseskillid"));
          body.level = sfs.int(
            generalPairs(text(result.row, "baseSkill")).get(int(params, "baseskillid"))!,
          );
        }
      } else {
        const result = generalAbility(context, row, action, params, (id) =>
          generalEffects(context, row)
            .filter((effect) => effect.effectid?.value === id)
            .reduce((sum, effect) => Math.fround(sum + Number(effect.effectvalue?.value ?? 0)), 0),
        );
        writeGeneral(context, result.row);
        body = { ...generalChanges(context, [result.row]), ...result.body };
      }
    }
  }
  const pushes: { command: string; body: Uint8Array }[] = [];
  if (body.skillQueue) {
    pushes.push({ command: "push.gemeral.useskill.equip", body: encode(fields(body.skillQueue)) });
    delete body.skillQueue;
  }
  if (
    ["heroOffice", "robgeneral"].includes(command) &&
    context.write.generalRoster?.generals?.length
  )
    pushes.push({
      command: "push.general.info",
      body: encode(generalChanges(context, context.write.generalRoster.generals)),
    });
  return {
    response: encode({ data: sfs.object(body) }),
    responseKind: "nested" as const,
    event,
    pushes,
  };
}
export const generalsDomain: CityDomain = {
  commands: [
    "general.init",
    "newgeneral",
    "newgeneral.buy",
    "heroOffice",
    "generaltrun",
    "robgeneral",
    "general.fire",
    "general.def.ch",
    "general.pick",
    "general.recruit",
  ],
  types: [],
  prepare,
  async apply() {
    generalFailure();
  },
};
