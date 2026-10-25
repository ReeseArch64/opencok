import { sfs, str, type Fields } from "@opencok/messages/sfs";
import { num, text, long, type Row } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import {
  generalOfficeUnlocked,
  generalGarrison,
  generalMarch,
  generalMarchReturn,
  generalOfficeExperience,
} from "@opencok/rules/general-assignments";
import {
  generalBase,
  generalPairs,
  generalList,
  generalExperience,
  generalFailure,
} from "@opencok/rules/general-progression";
import { newGeneralPrestigeLevel } from "@opencok/rules/new-general-prestige";
import { generalFeatureAvailable } from "@opencok/rules/new-general-content";
import {
  generalRoster,
  ownedGeneral,
  writeGeneral,
  recruitGeneral,
  generalEffects,
} from "./generals";
import type { CityProgressionContext } from "./city-progression";
function officeContext(context: CityProgressionContext) {
  const castle = context.state.buildings.find((row) => row.itemId === 400000);
  return {
    castle: num(castle ?? {}, "level") + num(castle ?? {}, "star"),
    player: num(context.state.profile, "level"),
    prestige: newGeneralPrestigeLevel(
      num(context.state.profile, "civilizationType"),
      context.state.effects.prestige.map((row) => ({
        civilizationType: num(row, "civilizationType"),
        prestigeValue: long(row, "prestigeValue"),
      })),
      context.rules,
    ),
  };
}
function offices(context: CityProgressionContext) {
  const pending = context.write.generalRoster?.offices ?? [];
  return [
    ...generalRoster(context).offices.filter((row) => !pending.some((next) => row.id === next.id)),
    ...pending,
  ];
}
function writeOffice(context: CityProgressionContext, row: Row) {
  const write = (context.write.generalRoster ??= {});
  write.offices = [...(write.offices ?? []).filter((previous) => previous.id !== row.id), row];
}
function remove(context: CityProgressionContext, office: Row) {
  writeOffice(context, {
    ...office,
    officeId: "",
    position: 0,
    startTime: 0n,
    lastRefreshExpTime: 0n,
  });
  const general = ownedGeneral(context, num(office, "id"));
  if (num(general, "state") === 6) writeGeneral(context, { ...general, state: 1 });
}
export function refreshGeneralOffices(context: CityProgressionContext) {
  if (!offices(context).some((row) => num(row, "position") > 0)) return;
  for (const office of offices(context)) {
    if (num(office, "position") === 0) continue;
    const general = ownedGeneral(context, num(office, "id")),
      rule = context.rules.power.newGeneralOffices?.get(text(office, "officeId"));
    if (!rule || num(general, "state") !== 6) generalFailure();
    let unlocked = true;
    try {
      generalOfficeUnlocked(
        context.rules,
        text(office, "officeId"),
        num(office, "position"),
        officeContext(context),
      );
    } catch {
      unlocked = false;
    }
    if (!unlocked) {
      remove(context, office);
      continue;
    }
    const accrued = generalOfficeExperience(office, rule, context.now);
    if (!accrued.amount) continue;
    const base = generalBase(context.rules, num(general, "id")),
      gates = generalList(base.breach_level),
      done = new Set(generalList(text(general, "breach")));
    if (
      num(general, "level") < cityInteger(base.max_level, 1) &&
      !(gates.includes(num(general, "level")) && !done.has(num(general, "level")))
    )
      writeGeneral(context, generalExperience(context.rules, general, accrued.amount).row);
    writeOffice(context, { ...office, lastRefreshExpTime: accrued.at });
  }
}
export function generalOfficeCommand(context: CityProgressionContext, params: Fields): Fields {
  if (
    !generalFeatureAvailable(context.rules, "general_official", {
      kingdomId: context.rules.kingdomId,
      version: "12.06.0",
      now: Number(context.now),
    })
  )
    generalFailure();
  const action = str(params, "M__REQUEST_ID__H");
  refreshGeneralOffices(context);
  if (action === "appoint") {
    const id = cityInteger(str(params, "heroId"), 1),
      officeId = str(params, "officeId"),
      name = str(params, "positionName"),
      position = ["master", "adjutant", "executive"].indexOf(name) + 1;
    if (!position) generalFailure();
    generalOfficeUnlocked(context.rules, officeId, position, officeContext(context));
    const general = ownedGeneral(context, id);
    if (![1, 6].includes(num(general, "state"))) generalFailure();
    for (const office of offices(context))
      if (
        num(office, "position") > 0 &&
        (office.id === id || (office.officeId === officeId && office.position === position))
      )
        remove(context, office);
    writeGeneral(context, { ...general, state: 6, buildingUuid: "" });
    writeOffice(context, {
      uid: context.owner,
      id,
      officeId,
      position,
      startTime: context.now,
      lastRefreshExpTime: context.now,
    });
  } else if (action === "remove") {
    const id = cityInteger(str(params, "heroId"), 1),
      office = offices(context).find((row) => row.id === id && num(row, "position") > 0);
    if (!office) generalFailure();
    remove(context, office);
  } else if (!["info", "refreshExp"].includes(action)) generalFailure();
  const groups = new Map<string, Fields>();
  for (const office of offices(context)) {
    if (!num(office, "position")) continue;
    const id = text(office, "officeId"),
      fields = groups.get(id) ?? { id: sfs.string(id) };
    fields[["master", "adjutant", "executive"][num(office, "position") - 1]!] = sfs.string(
      text(office, "id"),
    );
    groups.set(id, fields);
  }
  return { heroOffice: sfs.array([...groups.values()].map(sfs.object)) };
}
function idleAssignedBuilding(context: CityProgressionContext, building: Row) {
  context.idleBuilding(building);
  const queueType = new Map([
    [423000, 1],
    [424000, 8],
    [425000, 9],
    [426000, 10],
    [419000, 6],
    [429000, 11],
  ]).get(num(building, "itemId"));
  if (
    queueType !== undefined &&
    context.state.queues.some((row) => row.type === queueType && text(row, "itemId") !== "")
  )
    generalFailure();
}
export function assignGeneral(
  context: CityProgressionContext,
  row: Row,
  action: string,
  params: Fields,
) {
  if (action === "garrison") {
    const building = context.ownBuilding(str(params, "buildinguuid"));
    const next = generalGarrison(context.rules, row, building, context.now);
    for (const previous of generalRoster(context).generals)
      if (
        previous.id !== row.id &&
        num(previous, "state") === 2 &&
        previous.buildingUuid === building.uuid
      ) {
        idleAssignedBuilding(context, building);
        writeGeneral(context, { ...previous, state: 1, buildingUuid: "" });
      }
    writeGeneral(context, next);
  } else if (action === "canclegarrison") {
    if (num(row, "state") !== 2) generalFailure();
    idleAssignedBuilding(context, context.ownBuilding(text(row, "buildingUuid")));
    writeGeneral(context, { ...row, state: 1, buildingUuid: "" });
  } else generalFailure();
}
export function refreshGeneralUnlocks(context: CityProgressionContext) {
  const buildings = [
    ...context.state.buildings.filter(
      (row) => !context.write.buildings?.some((next) => next.uuid === row.uuid),
    ),
    ...(context.write.buildings ?? []),
  ];
  const house = buildings.find((row) => row.itemId === 433000 && num(row, "level") > 0);
  if (!house) return;
  const roster = generalRoster(context),
    ids = new Set(
      [...roster.generals, ...(context.write.generalRoster?.generals ?? [])].map((row) =>
        num(row, "id"),
      ),
    );
  const capacity = cityInteger(
    context.rules.building(
      "433000",
      num(house, "level"),
      num(house, "star"),
      num(house, "progress"),
    ).clientParameters?.[0]?.value,
    1,
    256,
  );
  for (const config of context.rules.general.unlocks?.values() ?? []) {
    const id = cityInteger(config.hero_id, 1);
    if (ids.has(id) || ids.size >= capacity) continue;
    const conditions = generalPairs(config.type);
    if (
      ![...conditions].some(([type, level]) =>
        buildings.some(
          (row) =>
            row.itemId === (type === 1 ? 400000 : type === 2 ? 433000 : -1) &&
            num(row, "level") >= level,
        ),
      )
    )
      continue;
    recruitGeneral(context, id, false);
    ids.add(id);
  }
}
export function departGeneral(context: CityProgressionContext, id: number) {
  const row = generalMarch(context.rules, ownedGeneral(context, id));
  writeGeneral(context, row);
  return {
    id,
    owner: context.owner,
    level: num(row, "level"),
    effects: generalEffects(context, row),
  };
}
export function returnGeneral(context: CityProgressionContext, id: number) {
  writeGeneral(context, generalMarchReturn(ownedGeneral(context, id)));
}
export function defenseGeneral(context: CityProgressionContext) {
  const wall = context.state.buildings.find((row) => row.itemId === 416000);
  const office = offices(context).find(
    (row) => row.officeId === "53833" && num(row, "position") > 0,
  );
  return generalRoster(context).generals.find(
    (row) =>
      (num(row, "state") === 2 && wall && row.buildingUuid === wall.uuid) ||
      (num(row, "state") === 6 && office?.id === row.id),
  );
}
