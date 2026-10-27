import { decodeJavaIntMap } from "@opencok/messages/java-int-map";
import { MOBILE_CLIENT_VERSION } from "@opencok/constants/game";
import { dragonDefinition } from "@opencok/rules/dragon-progression";
import { reconnectUpkeep } from "@opencok/rules/reconnect-upkeep";
import { settleReconnectFood } from "@opencok/rules/reconnect-resources";
import { ruleAvailable, legacyPlayerVersionAtLeast } from "@opencok/rules/availability";
import { createHash, randomInt } from "node:crypto";
import { sfs, encode, fields, type Fields, type Value } from "@opencok/messages/sfs";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import type {
  ScoutParticipant,
  WorldScoutTarget,
  WorldScoutMail,
} from "@opencok/contracts/world-scout-report";
import type { CityProgressionContext } from "./city-progression-context.ts";
import {
  scoutApproximate,
  scoutBarbarianArmy,
  scoutPairs,
} from "@opencok/rules/world-scout-report";
import { barbarianCurrentHP } from "@opencok/rules/world-scout";
import { javaHashMapOrder, javaIntHashMapOrder } from "@opencok/rules/java-hash-map-order";
import { cityInteger } from "@opencok/rules/city-progression";
import { cityFireSpeed, settleCityFire } from "@opencok/rules/city-defense";
import { worldMutationFailure } from "@opencok/rules/world-march-runtime";
import { serverFeature } from "@opencok/rules/power-context";
import { decodeWorldMarchArmy, type SavedMarchArmy } from "@opencok/messages/world-resource-army";
import { decodeLegacyJsonArray } from "@opencok/messages/legacy-json";
import { resourceGeneralBuildingEffect } from "@opencok/hero/services/general-building-effects";
import { generalSkillPoints } from "@opencok/hero/services/general-power";
import { encodeScoutReport, scoutMailPush } from "@opencok/mappings/world-scout-report";

const cast = (value: number) =>
  Number.isNaN(value) ? 0 : Math.max(-2147483648, Math.min(2147483647, Math.trunc(value)));

const wrap = (value: number) => value | 0;

function ordered<T>(rows: readonly T[], key: (row: T) => string) {
  const indexed = new Map(rows.map((row) => [key(row), row]));

  if (indexed.size !== rows.length) {worldMutationFailure();}

  return javaHashMapOrder(indexed.keys()).map((id) => indexed.get(id)!);
}

function effect(
  context: CityProgressionContext,
  who: ScoutParticipant,
  id: number,
  at = context.now,
) {
  if (!context.foreignEffect) {worldMutationFailure();}

  return context.foreignEffect(who.effects, id, at);
}

function units(
  rows: readonly { id: string; count: number; star: number }[],
  approximate: boolean,
  detail: boolean,
  straw: number,
  stars: boolean,
  random: (maximum: number) => number,
): Fields {
  let total = 0;
  const arms: Value[] = [];

  for (const unit of rows) {
    cityInteger(unit.count);

    if (unit.count < 1) {continue;}

    const chosen = detail ? unit.count : scoutApproximate(unit.count, random);

    if (!approximate && !detail) {total = wrap(total + chosen);}
    else {
      const count = cast(Math.fround(Math.fround(chosen) * Math.fround(1 + straw)));
      total = wrap(total + count);
      arms.push(
        sfs.object({
          num: sfs.int(count),
          id: sfs.string(unit.id),
          star: sfs.int(stars ? unit.star : 0),
        }),
      );
    }
  }

  if (!approximate && !detail)
    {total = cast(Math.fround(Math.fround(total) * Math.fround(1 + straw)));}

  return { total: sfs.int(total), arms: sfs.array(arms), about: sfs.bool(!detail) };
}

function marchArmy(row: Row) {
  if (!Buffer.isBuffer(row.armyInfo)) {worldMutationFailure();}

  const army = decodeWorldMarchArmy(row.armyInfo as Buffer);

  if (!army || army.owner !== row.ownerUid || !army.soldiers || army.soldiers.length > 256)
    {worldMutationFailure();}

  return army;
}

function defendingArmy(
  context: CityProgressionContext,
  target: WorldScoutTarget,
  approximate: boolean,
  detail: boolean,
  straw: number,
  stars: boolean,
  companions: boolean,
  friendship: boolean,
  levels: boolean,
  random: (maximum: number) => number,
): Fields {
  const person = target.participant!;
  const city = num(person.world, "pointId") === num(target.point, "id");
  const army = city
    ? undefined
    : target.occupyingMarch
      ? marchArmy(target.occupyingMarch)
      : undefined;

  if (
    !city &&
    (!army ||
      target.occupyingMarch!.ownerUid !== person.profile.uid ||
      num(target.occupyingMarch!, "state") !== 1 ||
      num(target.occupyingMarch!, "targetId") !== num(target.point, "id"))
  )
    {worldMutationFailure();}

  const rows = city
    ? ordered(person.armies, (row) => text(row, "armyId")).map((row) => {
        const trainingId = context.rules.arms.get(text(row, "armyId"))?.building;
        const training = ordered(person.buildings, (row) => text(row, "uuid")).find(
          (building) => String(building.itemId) === trainingId,
        );

        return {
          id: text(row, "armyId"),
          count: num(row, "free"),
          star: training && num(training, "level") >= 30 ? num(training, "star") : 0,
        };
      })
    : (army!.soldiers ?? []).map((row) => ({
        id: row.armsId!,
        count: row.total - row.dead,
        star: row.level ?? 0,
      }));
  const result = units(rows, approximate, detail, straw, stars, random);

  if (companions) {
    if (city) {
      const inMarch = new Set<string>();

      for (const march of person.marches) {
        if (!march.armyInfo) {continue;}

        for (const row of marchArmy(march).dragons ?? []) {
          if (row.owner !== person.profile.uid || !row.uuid) {worldMutationFailure();}

          inMarch.add(row.uuid);
        }
      }

      const environment = {
          kingdomId: context.rules.kingdomId,
          version: "",
          now: Number(context.now),
        },
        active =
          serverFeature(context.rules, "dragon_new", environment) &&
          serverFeature(context.rules, "dragon_battle", environment),
        selected = active
          ? ordered(person.dragons, (row) => text(row, "uuid")).find(
              (row) =>
                num(row, "dragonState") === 3 &&
                num(row, "useFlag") === 1 &&
                !inMarch.has(text(row, "uuid")),
            )
          : undefined;

      if (selected) {result.defDrag = sfs.array([sfs.object(dragon(context, selected, friendship))]);}

      const indexed = new Map(person.newGenerals.map((row) => [num(row, "id"), row])),
        general = javaIntHashMapOrder(indexed.keys())
          .map((id) => indexed.get(id)!)
          .find(
            (row) =>
              (num(row, "state") === 2 &&
                person.buildings.some(
                  (building) =>
                    building.uuid === row.buildingUuid && num(building, "itemId") === 419000,
                )) ||
              (num(row, "state") === 6 &&
                person.offices.some(
                  (office) =>
                    num(office, "id") === num(row, "id") &&
                    office.uid === row.uid &&
                    text(office, "officeId") === "53833" &&
                    num(office, "position") !== 0 &&
                    long(office, "startTime") !== 0n,
                )),
          );

      if (general)
        {result.generalInfo = sfs.array([
          sfs.object({
            userId: sfs.string(text(general, "uid")),
            generalId: sfs.string(String(general.id)),
            ...(levels ? { level: sfs.int(num(general, "level")) } : {}),
          }),
        ]);}
    } else {appendSavedCompanions(context, result, army!, person.dragons, friendship, levels);}
  }

  return result;
}

function dragon(context: CityProgressionContext, row: Row, friendship: boolean): Fields {
  const definition = dragonDefinition(context.rules, row);

  return {
    dragonId: sfs.int(cityInteger(definition.level.id, 1)),
    level: sfs.int(cityInteger(row.lv, 1)),
    ...(friendship ? { friendly: sfs.int(cityInteger(row.friendly)) } : {}),
  };
}

function appendSavedCompanions(
  context: CityProgressionContext,
  result: Fields,
  army: SavedMarchArmy,
  dragons: readonly Row[],
  friendship: boolean,
  levels: boolean,
) {
  if (army.dragons?.length)
    {result.defDrag = sfs.array(
      army.dragons.flatMap((saved) => {
        if (saved.owner !== army.owner || !saved.uuid) {worldMutationFailure();}

        const row = dragons.find((row) => row.uid === saved.owner && row.uuid === saved.uuid);

        return row ? [sfs.object(dragon(context, row, friendship))] : [];
      }),
    );}

  if (army.general) {
    if (army.general.owner !== army.owner) {worldMutationFailure();}

    result.generalInfo = sfs.array([
      sfs.object({
        userId: sfs.string(army.general.owner!),
        generalId: sfs.string(String(cityInteger(army.general.id))),
        ...(levels ? { level: sfs.int(cityInteger(army.general.level, 1)) } : {}),
      }),
    ]);
  }

  return result;
}

function fortView(view: Fields) {
  for (const item of view.arms!.value as Value[]) {delete fields(item).star;}

  return { total: view.total!, forts: view.arms!, about: view.about! };
}

function soldierInfo(
  army: SavedMarchArmy,
  about: boolean,
  stars: boolean,
  random: (maximum: number) => number,
) {
  return sfs.array(
    (army.soldiers ?? []).map((row) =>
      sfs.object({
        armyId: sfs.string(row.armsId!),
        count: sfs.int(
          about ? scoutApproximate(row.total - row.dead, random) : row.total - row.dead,
        ),
        star: sfs.int(stars ? (row.level ?? 0) : 0),
        about: sfs.bool(about),
      }),
    ),
  );
}

function resources(
  context: CityProgressionContext,
  person: ScoutParticipant,
  target: WorldScoutTarget,
): Fields {
  const result: Fields = {},
    totals = new Map<string, number>(),
    f = Math.fround;
  const environment = {
      kingdomId: context.rules.kingdomId,
      version: text(person.profile, "appVersion"),
      now: Number(context.now),
    },
    resolve = (id: number) => effect(context, person, id),
    upkeep = reconnectUpkeep(
      person.armies,
      person.buildings,
      context.rules,
      { ...environment, version: environment.version || MOBILE_CLIENT_VERSION },
      {
        specialServer: serverFeature(context.rules, "araf_mode", environment),
        consumptionRatio: 1,
        effect: resolve,
        cellarGeneralEffect: () =>
          resourceGeneralBuildingEffect(
            person.effects,
            context.rules,
            environment,
            72,
            resolve,
            () => context.now,
            404000,
          ),
      },
    ),
    foodState = settleReconnectFood(person.resources, context.now, upkeep.rates, upkeep.options),
    balances = { ...person.resources, food: foodState.food, foodbind: foodState.foodbind };

  for (const building of ordered(person.buildings, (row) => text(row, "uuid"))) {
    const config = context.rules.building(
        String(building.itemId),
        num(building, "level"),
        num(building, "star"),
        num(building, "progress"),
      ),
      id = config.effects?.productionResourceId;

    if (id === undefined || id < 0 || id > 3 || config.effects?.productionPerHour === undefined)
      {continue;}

    const asset = ["wood", "stone", "iron", "food"][id]!,
      from = long(building, "refreshTime") > 0n ? long(building, "refreshTime") : context.now,
      until = long(building, "effectTime"),
      speed = f(f(f(config.effects.productionPerHour) / 3600) / 1000),
      ordinary = f(speed * Math.max(0, f(f(100 + resolve(50 + id)) / 100))),
      bonus = f(
        ordinary *
          Math.max(0, f(f(100 + Number(context.rules.items.get("building_base")?.k7 ?? 0)) / 100)),
      ),
      capacity = cityInteger(config.effects.productionCapacity ?? 4000);

    if (from >= context.now) {continue;}

    let output: number;

    if (until <= from) {output = cast(f(Number(BigInt.asIntN(32, context.now - from)) * ordinary));}
    else if (until < context.now)
      {output = cast(
        f(
          cast(f(Number(until - from) * bonus)) +
            f(Number(BigInt.asIntN(32, context.now - until)) * ordinary),
        ),
      );}
    else {output = cast(f(Number(context.now - from) * bonus));}

    if (output < 0 || output > capacity) {output = capacity;}

    totals.set(asset, wrap((totals.get(asset) ?? 0) + cast(output * 0.5)));
  }

  const bound = upkeep.options.separateBound,
    exposed = new Map<string, bigint>();

  for (const asset of ["wood", "stone", "iron", "food"] as const)
    {exposed.set(
      asset,
      bound
        ? long(balances, asset) > 0n
          ? long(balances, asset)
          : 0n
        : BigInt.asIntN(64, long(balances, asset) + long(balances, `${asset}bind`)),
    );}

  if (
    bound &&
    ruleAvailable(context.rules.features.get("glory_warehouse"), {
      ...environment,
      version: text(context.state.profile, "appVersion"),
    })
  ) {
    const cellar = ordered(context.state.buildings, (row) => text(row, "uuid")).find(
        (row) => num(row, "itemId") === 404000,
      ),
      config = cellar
        ? context.rules.building(
            "404000",
            num(cellar, "level"),
            num(cellar, "star"),
            num(cellar, "progress"),
          )
        : undefined,
      parts = config?.clientParameters?.[4]?.value?.split("_"),
      attackerMixed = context.state.quests?.mixed;

    if (parts?.length === 3 && attackerMixed?.uid) {
      const rate = cityInteger(parts[0]),
        once = cityInteger(parts[1]),
        day = cityInteger(parts[2]),
        mixed = attackerMixed,
        used =
          long(mixed, "plunderTime") / 86400000n === context.now / 86400000n
            ? num(mixed, "plunderResource")
            : 0,
        target = ["wood", "stone", "iron", "food"].map((asset) =>
          Number(
            BigInt.asIntN(
              32,
              BigInt.asIntN(64, long(balances, `${asset}bind`) * BigInt(rate)) / 100n,
            ),
          ),
        ),
        obtained = [0, 0, 0, 0];
      let limit = Math.min(once, wrap(day - used)),
        steps = 0;

      while (limit > 0 && obtained.some((n, i) => n !== target[i])) {
        if (++steps > 4096) {worldMutationFailure();}

        const quarter = Math.ceil(limit / 4),
          adds = [quarter, Math.ceil(quarter / 24), Math.ceil(quarter / 6), quarter];

        for (let i = 0; i < 4; i++)
          {obtained[i] =
            obtained[i] !== target[i] && target[i]! > adds[i]! + obtained[i]!
              ? wrap(obtained[i]! + adds[i]!)
              : target[i]!;}

        limit = wrap(
          limit -
            wrap(
              obtained[0]! +
                Math.imul(obtained[1]!, 24) +
                Math.imul(obtained[2]!, 6) +
                obtained[3]!,
            ),
        );
      }

      for (const [i, asset] of ["wood", "stone", "iron", "food"].entries())
        {exposed.set(asset, BigInt.asIntN(64, long(balances, asset) + BigInt(obtained[i]!)));}
    }
  }

  const castle = ordered(context.state.buildings, (row) => text(row, "uuid")).find(
    (row) => num(row, "itemId") === 400000,
  );

  for (const asset of ["wood", "food", "stone", "iron"] as const) {
    if (
      (asset === "stone" || asset === "iron") &&
      num(castle ?? {}, "level") + num(castle ?? {}, "star") <
        Number(context.rules.items.get("building_base")?.[asset === "stone" ? "k4" : "k3"])
    )
      {continue;}

    result[asset] = sfs.long(exposed.get(asset)!);
    result[`${asset}_not_collected`] = sfs.int(totals.get(asset) ?? 0);
  }

  const wall = person.buildings.find((row) => num(row, "itemId") === 419000);

  if (!wall) {worldMutationFailure();}

  const maximum = Math.trunc(
    Number(
      context.rules.building("419000", num(wall, "level"), num(wall, "star"), num(wall, "progress"))
        .clientParameters?.[1]?.value,
    ) + effect(context, person, 125),
  );
  const settled = settleCityFire(
    target.point,
    context.now,
    cityFireSpeed(target.point, target.cityBosses, context.rules, (id) =>
      effect(context, person, id),
    ),
  );
  result.cityDefMax = sfs.int(cityInteger(maximum));
  result.cityDefValue = sfs.int(Math.min(maximum, num(settled, "cityDefValue")));
  const repair = [...(context.rules.configuration.kingdomSkills?.values() ?? [])].find(
      (rule) => Number(rule.effectType) === 18,
    ),
    activation = repair
      ? person.kingSkills?.find((row) => text(row, "skillId") === repair.id)
      : undefined,
    logged = repair
      ? person.kingSkillLogs?.find((row) => num(row, "skillId") === Number(repair.id))
      : undefined;

  if (activation && (!logged || long(logged, "logTime") <= long(activation, "startTime")))
    {result.cityDefValue = sfs.int(cityInteger(maximum));}

  result.isResourceShieldState = sfs.bool(
    person.effects.effects.states.some(
      (row) =>
        num(row, "stateId") === 501051 &&
        long(row, "endTime") > context.now &&
        long(row, "startTime") <= context.now,
    ),
  );

  return result;
}

function rallyReport(target: WorldScoutTarget, level: number, towerLevel: number): Fields {
  if (target.rallies.length && !target.rallyDetails) {worldMutationFailure();}

  const result: Fields = { total: sfs.int(0) };
  const person = target.participant!;
  const merge = (before: Value, after: Value) => {
    const entries = before.value as Value[];

    for (const item of after.value as Value[]) {
      const id = fields(item).armyId?.value,
        old = entries.find((entry) => fields(entry).armyId?.value === id);

      if (old)
        {fields(old).count = sfs.int(
          wrap(Number(fields(old).count!.value) + Number(fields(item).count!.value)),
        );}
      else {entries.push(item);}
    }
  };

  for (const entry of target.rallyDetails ?? []) {
    if (!entry.team || entry.team.leaderUid !== entry.march.ownerUid) {continue;}

    const army = marchArmy(entry.march),
      count = (army.soldiers ?? []).reduce((sum, row) => wrap(sum + row.total - row.dead), 0),
      originator: Fields = {
        name: sfs.string(text(person.profile, "name")),
        abbr: sfs.string(text(person.alliance ?? {}, "abbr")),
        level: sfs.int(num(person.profile, "level")),
        total: sfs.int(count),
        pic: sfs.string(text(person.profile, "pic")),
        picVer: sfs.int(num(person.profile, "picVer")),
        picfraId: sfs.int(num(person.profile, "picfraId")),
      };

    if (level > 1) {originator.armys = soldierInfo(army, false, towerLevel >= 10, () => 0);}

    let total = count;
    const members: Value[] = [];

    if (level > 2)
      {for (const member of entry.members) {
        const saved = marchArmy(member.march),
          amount = (saved.soldiers ?? []).reduce((sum, row) => wrap(sum + row.total - row.dead), 0),
          view: Fields = {
            name: sfs.string(text(member.profile, "name")),
            abbr: sfs.string(text(member.alliance ?? {}, "abbr")),
            level: sfs.int(num(member.profile, "level")),
            total: sfs.int(amount),
            pic: sfs.string(text(member.profile, "pic")),
            picVer: sfs.int(num(member.profile, "picVer")),
            picfraId: sfs.int(num(member.profile, "picfraId")),
          };
        total = wrap(total + amount);

        if (level > 3) {view.armys = soldierInfo(saved, false, towerLevel >= 10, () => 0);}

        members.push(sfs.object(view));
      }}

    result.total = sfs.int(wrap(Number(result.total!.value) + total));

    if (!result.originator) {result.originator = sfs.object(originator);}
    else {
      const before = fields(result.originator);
      before.total = sfs.int(wrap(Number(before.total!.value) + count));

      if (before.armys && originator.armys) {merge(before.armys, originator.armys);}
    }

    if (level > 2) {
      if (!result.members) {result.members = sfs.array(members);}
      else
        {for (const member of members) {
          const list = result.members.value as Value[],
            view = fields(member),
            before = list.find((entry) => fields(entry).name?.value === view.name?.value);

          if (!before) {list.push(member);}
          else {
            fields(before).total = sfs.int(
              wrap(Number(fields(before).total!.value) + Number(view.total!.value)),
            );

            if (fields(before).armys && view.armys) {merge(fields(before).armys!, view.armys);}
          }
        }}
    }
  }

  result.bLevel = sfs.int(towerLevel);

  return result;
}

export function scoutDetectReport(
  context: CityProgressionContext,
  target: WorldScoutTarget,
  selectors: readonly number[],
  towerLevel: number,
  random: (maximum: number) => number = randomInt,
): Fields {
  const person = target.participant;

  if (!person) {worldMutationFailure();}

  const city = num(person.world, "pointId") === num(target.point, "id"),
    straw = effect(context, person, 63),
    report: Fields = {};

  for (const selector of selectors) {
    if (selector === 1 && city) {report.resource = sfs.object(resources(context, person, target));}
    else if ([2, 5, 9].includes(selector))
      {report.defence = sfs.object(
        defendingArmy(
          context,
          target,
          selector === 5,
          selector === 9,
          straw,
          towerLevel >= 10,
          selector !== 2,
          selector === 9,
          selector === 9,
          random,
        ),
      );}
    else if ([3, 6, 10].includes(selector) && city)
      {report.fort = sfs.object(
        fortView(
          units(
            ordered(person.forts, (row) => text(row, "armyId")).map((row) => ({
              id: text(row, "armyId"),
              count: num(row, "num"),
              star: 0,
            })),
            selector === 6,
            selector === 10,
            0,
            false,
            random,
          ),
        ),
      );}
    else if (selector === 4 && city) {
      let total = 0;

      for (const entry of target.reinforcements)
        {total += (marchArmy(entry.march).soldiers ?? []).reduce(
          (sum, row) => sum + row.total - row.dead,
          0,
        );}

      report.rein_about = sfs.object({
        total: sfs.int(scoutApproximate(total, random)),
        about: sfs.bool(true),
      });
    } else if (selector === 7 && city)
      {report.rein_detail = sfs.array(
        target.reinforcements.map((entry) =>
          sfs.object({
            uid: sfs.string(text(entry.profile, "uid")),
            name: sfs.string(text(entry.profile, "name")),
            pic: sfs.string(text(entry.profile, "pic")),
            picVer: sfs.int(num(entry.profile, "picVer")),
            picfraId: sfs.int(num(entry.profile, "picfraId")),
            level: sfs.int(num(entry.profile, "level")),
            race: sfs.int(num(entry.profile, "civilizationType")),
            abbr: sfs.string(text(entry.alliance ?? {}, "abbr")),
            power: sfs.long(long(entry.statistics, "power")),
          }),
        ),
      );}
    else if ((selector === 8 || selector === 11) && city) {
      const rows: Value[] = [],
        dragons: Value[] = [],
        generals: Value[] = [];

      for (const entry of target.reinforcements) {
        const army = marchArmy(entry.march);
        rows.push(soldierInfo(army, selector === 8, towerLevel >= 10, random));
        const saved: Fields = {};
        appendSavedCompanions(
          context,
          saved,
          army,
          entry.dragons,
          selector === 11,
          selector === 11,
        );
        dragons.push(saved.defDrag ?? sfs.array([]));
        generals.push(
          army.general
            ? sfs.object({
                userId: sfs.string(army.general.owner!),
                generalId: sfs.string(String(army.general.id)),
                ...(selector === 11 ? { level: sfs.int(army.general.level!) } : {}),
              })
            : sfs.object({}),
        );
      }

      report.rein_about_detail = sfs.array(rows);
      report.rein_about_detail_pet_dragon = sfs.array(dragons);
      report.generalList = sfs.array(generals);
    } else if (selector === 12 && city)
      {report.tower = sfs.array(
        person.buildings
          .filter((row) => num(row, "itemId") === 403000)
          .map((row) =>
            sfs.object({ level: sfs.int(num(row, "level")), star: sfs.int(num(row, "star")) }),
          ),
      );}
    else if (selector === 13)
      {report.science = sfs.array(
        person.sciences
          .filter(
            (row) =>
              context.rules.power.sciences?.get(String(num(row, "itemId") + num(row, "level") - 1))
                ?.mark === "1",
          )
          .map((row) =>
            sfs.object({ id: sfs.string(text(row, "itemId")), level: sfs.int(num(row, "level")) }),
          ),
      );}
    else if (selector === 14) {
      const first = javaHashMapOrder(person.generals.map((row) => text(row, "uuid")))[0],
        general = person.generals.find((row) => row.uuid === first);
      const ability = general?.ability
        ? decodeLegacyJsonArray(Buffer.from(general.ability as Buffer).toString("utf8"))
        : [];
      report.ability = sfs.array(
        ability
          .filter((row) => !fields(row).ids)
          .map((row) => {
            const view = { ...fields(row) };
            delete view["620700"];

            if (!legacyPlayerVersionAtLeast(text(person.profile, "appVersion"), "1.1.2"))
              {for (const id of ["622300", "622200", "622100", "622000"]) {delete view[id];}}

            return sfs.object(view);
          }),
      );
    } else if (
      selector >= 15 &&
      selector <= 18 &&
      ruleAvailable(context.rules.features.get("tower"), {
        kingdomId: context.rules.kingdomId,
        version: text(context.state.profile, "appVersion"),
        now: Number(context.now),
      })
    ) {
      report.aggregation = sfs.object(rallyReport(target, selector - 14, towerLevel));
    } else if (
      selector === 19 &&
      ruleAvailable(context.rules.features.get("scout_skill"), {
        kingdomId: context.rules.kingdomId,
        version: text(context.state.profile, "appVersion"),
        now: Number(context.now),
      })
    ) {
      const first = javaHashMapOrder(person.generals.map((row) => text(row, "uuid")))[0],
        points = generalSkillPoints(person.generals.filter((row) => row.uuid === first)).flat();
      report.generalSkill = sfs.object({
        "50000": sfs.int(0),
        "50001": sfs.int(0),
        "50002": sfs.int(0),
        ...Object.fromEntries(points.map((row) => [row.id, sfs.int(row.points)])),
      });
    }
  }

  report.user = sfs.object({
    pointId: sfs.int(num(target.point, "id")),
    serverId: sfs.int(context.rules.kingdomId),
    uid: sfs.string(text(person.profile, "uid")),
    name: sfs.string(text(person.profile, "name")),
    pic: sfs.string(text(person.profile, "pic")),
    picVer: sfs.int(num(person.profile, "picVer")),
    picfraId: sfs.int(num(person.profile, "picfraId")),
    race: sfs.int(num(person.profile, "civilizationType")),
    ...(person.alliance
      ? {
          abbr: sfs.string(text(person.alliance, "abbr")),
          allianceName: sfs.string(text(person.alliance, "alliancename")),
        }
      : {}),
    level: sfs.int(num(person.profile, "level")),
  });
  report.name = sfs.string(text(person.profile, "name"));
  report.pointId = sfs.int(num(person.world, "pointId"));
  report.pointType = sfs.int(num(target.point, "pointType"));

  return report;
}

export function scoutBarbarianReport(
  context: CityProgressionContext,
  target: WorldScoutTarget,
): Fields {
  const actor = target.barbarian;

  if (!actor || actor.configId !== target.point.pointItem) {worldMutationFailure();}

  const rule = context.rules.world.barbarians?.get(text(actor, "configId"));

  if (!rule) {worldMutationFailure();}

  const savedArmy = actor.lastArmyMapByteArray,
    savedRewards = actor.lastAwardArmyMapByteArray;

  if (!Buffer.isBuffer(savedArmy) || !Buffer.isBuffer(savedRewards)) {worldMutationFailure();}

  const army = scoutBarbarianArmy(actor, context.rules, context.now, decodeJavaIntMap(savedArmy)),
    rewards = scoutBarbarianArmy(
      actor,
      context.rules,
      context.now,
      decodeJavaIntMap(savedRewards),
      true,
    ),
    base = scoutPairs(context.rules.world.armies?.get(rule.army ?? "")?.arm),
    count = [...army.values()].reduce((a, b) => a + b, 0);

  return {
    barbarionReward: sfs.array(
      [...rewards].map(([id, count]) => sfs.object({ t: sfs.string(id), v: sfs.int(count) })),
    ),
    user: sfs.object({ pointId: sfs.int(num(target.point, "id")), name: sfs.string("") }),
    pointType: sfs.int(44),
    barbarionCurrentDef: sfs.int(
      barbarianCurrentHP(target.point, actor, context.rules, context.now),
    ),
    barbarionTotalDef: sfs.int(cityInteger(rule.para1)),
    barbarionConfigId: sfs.string(text(actor, "configId")),
    barbarionCurrentArmyCount: sfs.int(cityInteger(count)),
    barbarionTotalArmyCount: sfs.int(cityInteger([...base.values()].reduce((a, b) => a + b, 0))),
    defence: sfs.object({
      total: sfs.int(cityInteger(count)),
      about: sfs.bool(true),
      arms: sfs.array(
        [...army].map(([id, count]) =>
          sfs.object({ num: sfs.int(count), id: sfs.string(id), star: sfs.int(0) }),
        ),
      ),
    }),
  };
}

export function planScoutMail(
  context: CityProgressionContext,
  march: string,
  target: WorldScoutTarget,
  type: 2 | 6 | 8,
  recipient: string,
  body: Fields | string,
  sender = "",
  senderName = "",
  title = "",
  itemIdFlag: 0 | 1 = 0,
) {
  const id =
      createHash("sha256")
        .update(`scout:${march}:${recipient}:${type}`)
        .digest("hex")
        .slice(0, 32) + "00",
    value: WorldScoutMail = {
      id,
      march,
      owner: context.owner,
      target: num(target.point, "id"),
      targetOwner: text(target.point, "ownerId"),
      recipient,
      type,
      itemIdFlag,
      sender,
      senderName,
      title,
      contents: typeof body === "string" ? Buffer.from(body) : encodeScoutReport(body),
      createdAt: context.now,
    };
  const write = (context.write.worldMutation ??= {});
  write.scoutMails = [...(write.scoutMails ?? []), value];

  if (!context.economy.event) {worldMutationFailure();}

  context.economy.event({
    id: `scout.${id}`,
    type: "world.scout.mail",
    payload: encode({ owner: sfs.string(recipient), mail: sfs.object(scoutMailPush(value)) }),
  });

  return id;
}
