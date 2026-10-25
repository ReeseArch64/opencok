import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { encode, sfs, str, int, Type, type Fields } from "@opencok/messages/sfs";
import { num, text, long, type Row } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import {
  generalBase,
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
import { newGeneral, generalPurchase } from "@opencok/mappings/generals";
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
  const equipment = context.state.equipment
    .filter((item) => item.generalid === row.id && num(item, "on") === 2)
    .map((item) => ({ itemId: num(item, "itemId"), extraProperty: text(item, "extraProperty") }));
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
  for (const values of permanent) for (const [id, value] of values) append(id, value);
  const statuses = new Map(
    generalRoster(context)
      .statuses.filter((status) => status.newGeneralId === row.id)
      .map((status) => [num(status, "stateId"), status]),
  );
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
    ];
  const office =
    context.write.generalRoster?.offices?.find((office) => office.id === row.id) ??
    roster.offices.find((office) => office.id === row.id);
  return newGeneral(row, generalEffects(context, row), skills, office);
}
export function generalChanges(context: CityProgressionContext, rows: readonly Row[]) {
  return { generallist: sfs.array(rows.map((row) => sfs.object(generalView(context, row)))) };
}
export function recruitGeneral(context: CityProgressionContext, id: number, fragments = true) {
  const base = generalBase(context.rules, id),
    roster = generalRoster(context);
  const building = context.state.buildings.find(
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
  if (base.faction && base.faction !== "0") generalFailure();
  if (fragments) {
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
  if (command === "general.init") {
    body = {
      ...generalChanges(context, generalRoster(context).generals),
      generalBuyList: sfs.array(
        generalRoster(context).purchases.map((row) => sfs.object(generalPurchase(row))),
      ),
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
      if (action === "addexp") {
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
      } else generalFailure();
    }
  }
  return { response: encode({ data: sfs.object(body) }), responseKind: "nested" as const };
}
export const generalsDomain: CityDomain = {
  commands: ["general.init", "newgeneral", "newgeneral.buy"],
  types: [],
  prepare,
  async apply() {
    generalFailure();
  },
};
