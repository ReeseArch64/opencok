import { sfs, encode } from "@opencok/messages/sfs";
import { num, long, text } from "@opencok/contracts/rows";
import type { RuntimeMarch } from "@opencok/contracts/world-march-runtime";
import type { WorldScoutTarget } from "@opencok/contracts/world-scout-report";
import type { CityProgressionContext } from "./city-progression";
import { cityInteger } from "@opencok/rules/city-progression";
import { legacyPlayerVersionAtLeast } from "@opencok/rules/availability";
import { scoutCost, barbarianCurrentHP } from "@opencok/rules/world-scout";
import { scoutTowerSelectors } from "@opencok/rules/world-scout-report";
import { serverFeature } from "@opencok/rules/power-context";
import { ordinaryMarchRoute, worldMutationFailure } from "@opencok/rules/world-march-runtime";
import { resolveWorldCityGeometry } from "@opencok/rules/world-city-geometry";
import { scoutDetectReport, scoutBarbarianReport, planScoutMail } from "./world-scout-report";
import { scoutWatchtowerValues } from "@opencok/rules/world-scout-watchtower";
import { refreshQuests } from "./quests";
import { CampaignPlanner } from "./local-campaign";
import { generalSkillPoints } from "./power";
import { generalSkillEffects } from "@opencok/rules/power-attributes";
import { expeditionOpen } from "@opencok/rules/new-expedition";
import { territoryTreeEffects } from "@opencok/rules/power-territory";
import { javaHashMapOrder } from "@opencok/rules/java-hash-map-order";
export const ordinaryScoutTargets = [1, 2, 3, 44] as const;
export function scoutWatchtower(context: CityProgressionContext) {
  const tower = context.state.buildings.find((row) => num(row, "itemId") === 417000);
  return {
    tower,
    ...scoutWatchtowerValues(context.rules, tower, {
      kingdomId: context.rules.kingdomId,
      version: text(context.state.profile ?? {}, "appVersion"),
      now: Number(context.now),
    }),
  };
}
export function scoutTarget(context: CityProgressionContext, id: number) {
  const target = context.state.worldMutation?.scoutTargets?.get(id);
  if (!target) worldMutationFailure();
  return target;
}
export function scoutDeparture(context: CityProgressionContext, id: number) {
  const target = scoutTarget(context, id),
    kind = num(target.point, "pointType"),
    uid = text(target.point, "ownerId"),
    guild = text(context.state.profile, "allianceId"),
    watch = scoutWatchtower(context);
  if (
    !(ordinaryScoutTargets as readonly number[]).includes(kind) ||
    num(target.point, "worldId") !== 0 ||
    num(context.state.profile, "serverId") !== context.rules.kingdomId ||
    num(context.state.profile, "crossFightSrcServerId") > 0 ||
    num(context.state.worldMutation!.world, "pointId") === id ||
    uid === context.owner
  )
    worldMutationFailure();
  if (kind === 44) {
    if (
      !serverFeature(context.rules, "barbarion_switch", {
        kingdomId: context.rules.kingdomId,
        version: "12.06.0",
        now: Number(context.now),
      }) ||
      !target.barbarian ||
      long(target.point, "flushTime") <= context.now ||
      barbarianCurrentHP(target.point, target.barbarian, context.rules, context.now) <= 0
    )
      worldMutationFailure();
  } else {
    if (!watch.tower) worldMutationFailure();
    if (
      !uid ||
      !target.participant ||
      text(target.participant.profile, "uid") !== uid ||
      num(target.participant.profile, "serverId") !== context.rules.kingdomId ||
      num(target.participant.world, "worldId") !== 0 ||
      (guild &&
        (guild === text(target.point, "allianceId") ||
          guild === text(target.participant.profile, "allianceId")))
    )
      worldMutationFailure();
    if (kind === 1 && num(target.participant.world, "pointId") !== id) worldMutationFailure();
    if (
      kind !== 1 &&
      (!target.occupyingMarch ||
        target.occupyingMarch.ownerUid !== uid ||
        num(target.occupyingMarch, "targetId") !== id ||
        num(target.occupyingMarch, "state") !== 1)
    )
      worldMutationFailure();
    const selectors = scoutTowerSelectors(context.rules, watch.tower);
    if (
      selectors.some((value) => value >= 15 && value <= 18) &&
      target.rallies.length &&
      !target.rallyDetails
    )
      worldMutationFailure();
  }
  const shield = scoutShield(context, target).protected;
  if (
    shield &&
    serverFeature(context.rules, "glory_watchtower", {
      kingdomId: context.rules.kingdomId,
      version: text(context.state.profile, "appVersion"),
      now: Number(context.now),
    }) &&
    legacyPlayerVersionAtLeast(
      text(context.state.profile, "appVersion"),
      context.rules.features.get("glory_watchtower")?.version,
    ) &&
    !watch.ready
  )
    worldMutationFailure();
  const castle = target.participant?.buildings.find((row) => num(row, "itemId") === 400000),
    cost = scoutCost(target.point, castle, context.rules, context.effect(404));
  cityInteger(cost);
  if (kind === 44) {
    const config = context.rules.world.barbarians?.get(text(target.point, "pointItem")),
      parts = config?.para4?.split(";");
    if (!parts || parts.length !== 2) worldMutationFailure();
    const resource = cityInteger(parts[0], 0, 5),
      asset = ["wood", "stone", "iron", "food", "silver", "gold"][resource]!;
    if (asset === "gold") {
      if (context.balance("gold") < BigInt(cost)) worldMutationFailure();
      context.economy.gold(-BigInt(cost));
    } else context.spend({ [asset]: BigInt(cost) }, false);
  } else context.spend({ food: BigInt(cost) }, false);
  const honour = kind === 1 && shield && watch.ready;
  if (honour) {
    context.write.buildings = [
      ...(context.write.buildings ?? []).filter((row) => row.uuid !== watch.tower!.uuid),
      { ...watch.tower!, effectTime: context.now },
    ];
    const write = (context.write.worldMutation ??= {});
    write.companionPushes = [
      ...(write.companionPushes ?? []),
      { command: "push.watchtower.cd", body: encode({ cd: sfs.long(context.now / 1000n) }) },
    ];
  }
  if (uid) {
    const origin = context.state.worldMutation!.points.find(
      (row) => num(row, "id") === num(context.state.worldMutation!.world, "pointId"),
    );
    if (!origin) worldMutationFailure();
    const write = (context.write.worldMutation ??= {});
    write.points = [
      ...(write.points ?? []).filter((row) => row.id !== origin.id),
      { ...origin, shieldTime: 0n },
    ];
    context.write.deletedStates = [
      ...(context.write.deletedStates ?? []),
      ...context.state.effects.states
        .filter((row) =>
          (context.rules.power.statuses?.get(String(row.stateId))?.effect ?? "")
            .split("|")
            .some((pair) => pair.split(";")[0] === "61"),
        )
        .map((row) => num(row, "stateId")),
    ];
  }
  return { target, honour, watch };
}
export function scoutDepartureProgress(context: CityProgressionContext) {
  const previous = context.write.statistics ?? {
    power: long(context.state.statistics, "power"),
    buildingPower: long(context.state.statistics, "buildingPower"),
    armyCure: num(context.state.statistics, "armyCure"),
  };
  context.write.statistics = {
    ...previous,
    detectNum: cityInteger((previous.detectNum ?? num(context.state.statistics, "detectNum")) + 1),
  };
  refreshQuests(context, { story: 16, key: "1", count: 1 });
  new CampaignPlanner(context).event(37, "1");
}
export function scoutRoute(
  context: CityProgressionContext,
  target: WorldScoutTarget,
  size: number,
  speed: number,
  returning = false,
) {
  const state = context.state.worldMutation!,
    origin = num(state.world, "pointId"),
    id = num(target.point, "id"),
    kind = num(target.point, "pointType"),
    watch = scoutWatchtower(context);
  const destination =
    kind === 1 && !returning
      ? resolveWorldCityGeometry(id, size, text(target.point, "ownerId"), state.points)?.points
      : undefined;
  if (!returning && kind === 1 && !destination) worldMutationFailure();
  let adjusted = speed;
  if (!returning && kind === 1 && target.participant) {
    if (!context.foreignEffect) worldMutationFailure();
    adjusted = Math.fround(
      speed /
        Math.max(
          Math.fround(1 + Math.fround(context.foreignEffect(target.participant.effects, 37) / 100)),
          1,
        ),
    );
  }
  return ordinaryMarchRoute(
    context.rules,
    size,
    returning ? id : origin,
    returning ? origin : id,
    adjusted,
    context.effect(401) + watch.speed + context.effect(402),
    true,
    returning ? kind === 1 || kind === 6 : kind === 1,
    0,
    true,
    returning ? scoutSourceFootprint(id, size) : state.cityFootprint,
    returning ? (kind === 1 || kind === 6 ? state.cityFootprint : [origin]) : destination,
    returning,
  );
}
function failMail(
  context: CityProgressionContext,
  state: RuntimeMarch,
  target: WorldScoutTarget,
  id: string,
  to = context.owner,
  params: readonly string[] = [],
  type: 2 | 6 = 6,
) {
  const template = context.rules.mail.get(id);
  if (!template?.message) worldMutationFailure();
  planScoutMail(
    context,
    state.id,
    target,
    type,
    to,
    `${template.message}${params.length ? "|" + params.join("|") : ""}`,
    "",
    template.sender ?? "",
    template.title ?? "",
    1,
  );
}
export function scoutArrival(
  context: CityProgressionContext,
  state: RuntimeMarch,
  target: WorldScoutTarget,
  size: number,
): RuntimeMarch {
  const kind = num(target.point, "pointType"),
    uid = text(target.point, "ownerId"),
    person = target.participant,
    watch = scoutWatchtower(context),
    valid =
      (ordinaryScoutTargets as readonly number[]).includes(kind) &&
      num(target.point, "worldId") === 0;
  if (
    valid &&
    kind === 44 &&
    target.barbarian &&
    long(target.point, "flushTime") > context.now &&
    barbarianCurrentHP(target.point, target.barbarian, context.rules, context.now) > 0 &&
    serverFeature(context.rules, "barbarion_switch", {
      kingdomId: context.rules.kingdomId,
      version: "12.06.0",
      now: Number(context.now),
    })
  )
    state = {
      ...state,
      scoutReport: planScoutMail(
        context,
        state.id,
        target,
        8,
        context.owner,
        scoutBarbarianReport(context, target),
      ),
    };
  else if (
    valid &&
    uid &&
    person &&
    uid !== context.owner &&
    (!text(context.state.profile, "allianceId") ||
      text(context.state.profile, "allianceId") !== text(person.profile, "allianceId"))
  ) {
    if (!context.foreignEffect) worldMutationFailure();
    const shield = scoutShield(context, target).protected,
      territoryAnti = [1, 2].includes(kind) && scoutTerritoryAnti(context, target) > 0,
      anti =
        territoryAnti || ([1, 2].includes(kind) && context.foreignEffect(person.effects, 62) > 0);
    const newMail = serverFeature(context.rules, "mail_defence", {
      kingdomId: context.rules.kingdomId,
      version: "12.06.0",
      now: Number(context.now),
    });
    if (shield && !state.scoutHonour) {
      if (newMail)
        failMail(context, state, target, "11687", context.owner, [text(person.profile, "name")]);
    } else if (anti && !(shield && state.scoutHonour)) {
      if (newMail) {
        failMail(context, state, target, territoryAnti ? "11746" : "11689", context.owner, [
          text(person.profile, "name"),
        ]);
        failMail(context, state, target, territoryAnti ? "11747" : "10006", uid, [
          text(context.state.profile, "name"),
        ]);
      } else {
        failMail(context, state, target, "10002", context.owner, [], 2);
        failMail(context, state, target, "10006", uid, [text(context.state.profile, "name")], 2);
      }
    } else {
      const report = anti
        ? {}
        : scoutDetectReport(
            context,
            target,
            scoutTowerSelectors(context.rules, watch.tower!),
            num(watch.tower!, "level"),
          );
      if (shield)
        report.protectCD = sfs.long((scoutShield(context, target).end - context.now) / 1000n);
      state = {
        ...state,
        scoutReport: planScoutMail(context, state.id, target, 8, context.owner, report),
      };
      const guild = text(context.state.profile, "allianceId"),
        abbr = guild ? text(context.state.quests?.alliance ?? {}, "abbr") : "",
        name = `${abbr ? "(" + abbr + ")" : ""}${text(context.state.profile, "name")}`;
      planScoutMail(
        context,
        state.id,
        target,
        6,
        uid,
        `${name}|${kind}|${state.target}`,
        context.owner,
        "",
        String(kind),
      );
      const write = (context.write.worldMutation ??= {});
      write.companionPushes = [
        ...(write.companionPushes ?? []),
        { command: "push.scout.info", body: encode({ pointId: sfs.int(state.target) }) },
      ];
    }
  }
  const route = scoutRoute(
    context,
    { ...target, point: { ...target.point, pointType: state.targetType } },
    size,
    state.marchSpeed,
    true,
  );
  return {
    ...state,
    phase: "returning",
    startedAt: context.now,
    dueAt: context.now + route.duration,
    returnDuration: route.duration,
    segments: route.segments,
    version: state.version + 1,
  };
}

function scoutSourceFootprint(id: number, size: number) {
  cityInteger(id, 1, size * size);
  const x = (id - 1) % size,
    y = Math.trunc((id - 1) / size);
  const point = (a: number, b: number) => (a < 0 || b < 0 ? -1 : 1 + a + b * size);
  return [id, point(x - 1, y), point(x, y - 1), point(x - 1, y - 1)];
}
export function scoutArmySpeed(context: CityProgressionContext, id: string) {
  const rule = context.rules.arms.get(id);
  if (!rule) worldMutationFailure();
  const type = cityInteger(rule.arm, 1),
    base = Number(rule.speed);
  let bonus = 0;
  const generals = new Map(context.state.effects.generals.map((row) => [text(row, "uuid"), row]));
  for (const key of javaHashMapOrder(generals.keys())) {
    const effects = generalSkillEffects(generalSkillPoints([generals.get(key)!]), context.rules);
    let value = Math.fround(type <= 8 ? (effects.get(1300 + type) ?? 0) : 0);
    if (type < 8) value = Math.fround(value + Math.fround(effects.get(1300) ?? 0));
    bonus = Math.trunc(Math.fround(Math.fround(bonus) + value));
  }
  if (type <= 8)
    bonus = Math.trunc(
      Math.fround(
        Math.fround(bonus) + Math.fround(context.effect(780 + Math.floor((type - 1) / 2))),
      ),
    );
  const speed = Math.fround(
    Math.fround(Math.fround(base) * Math.fround(Math.max(100 + bonus, 20))) / 100,
  );
  if (!Number.isFinite(speed) || speed <= 0) worldMutationFailure();
  return speed;
}

function scoutShield(context: CityProgressionContext, target: WorldScoutTarget) {
  if (num(target.point, "pointType") !== 1 || !text(target.point, "ownerId"))
    return { protected: false, end: 0n };
  let end = 0n;
  for (const row of target.participant?.effects.effects.states ?? []) {
    if (long(row, "endTime") <= context.now) continue;
    if (
      (context.rules.power.statuses?.get(text(row, "stateId"))?.effect ?? "")
        .split("|")
        .some((pair) => pair.split(";")[0] === "61")
    )
      end = end > long(row, "endTime") ? end : long(row, "endTime");
  }
  return { protected: end > context.now || long(target.point, "shieldTime") > context.now, end };
}

function scoutTerritoryAnti(context: CityProgressionContext, target: WorldScoutTarget) {
  const person = target.participant!;
  const snapshot = person.effects.effects;
  let value =
    territoryTreeEffects(snapshot.profile, snapshot.territoryTrees, context.rules).get(62) ?? 0;
  const guild = text(person.profile, "allianceId");
  if (!guild) return value;
  const size = context.state.worldMutation?.mapSize ?? 1200;
  const home = cityInteger(person.world.pointId, 1, size * size);
  const side = Math.floor(cityInteger(context.rules.items.get("alliance_territory")?.k11) / 2) + 1;
  let selected: import("@opencok/contracts/rows").Row | undefined;
  for (const tower of person.turrets ?? []) {
    const point = cityInteger(tower.pointId, 1, size * size);
    if (
      text(tower, "allianceId") !== guild ||
      num(tower, "type") !== 20 ||
      num(tower, "atWorldId") !== 0
    )
      worldMutationFailure();
    if (
      Math.abs(((point - 1) % size) - ((home - 1) % size)) > side ||
      Math.abs(Math.trunc((point - 1) / size) - Math.trunc((home - 1) / size)) > side
    )
      continue;
    if (!selected || num(tower, "level") > num(selected, "level")) selected = tower;
  }
  if (selected)
    for (const skill of person.territorySkills ?? []) {
      if (
        text(skill, "buildingUid") !== text(selected, "uid") ||
        num(skill, "effect") !== 62 ||
        long(skill, "startTime") <= 0n ||
        long(skill, "endTime") <= context.now ||
        !context.rules.alliance.buildingSkills?.has(text(skill, "skillId"))
      )
        continue;
      value = (value + num(skill, "effectValue")) | 0;
    }
  return value;
}

export function scoutExpeditionEffect(context: CityProgressionContext, id: 908 | 909 | 911 | 2600) {
  const expedition = context.state.expedition,
    phase = expedition?.phase;
  if (
    !expeditionOpen(context.rules, context.now) ||
    !expedition?.period ||
    expedition.closed ||
    expedition.projectionOnly ||
    !phase ||
    phase.stage !== 8 ||
    phase.startTime > context.now ||
    phase.endTime <= context.now ||
    !serverFeature(context.rules, "tech_newEffect", {
      kingdomId: context.rules.kingdomId,
      version: "12.06.0",
      now: Number(context.now),
    })
  )
    return 0;
  return Math.trunc(context.effect(id));
}

export function scoutSoldierLimit(context: CityProgressionContext) {
  const f = Math.fround;
  const cast = (value: number) => {
    if (!Number.isFinite(value)) worldMutationFailure();
    return Math.max(-2147483648, Math.min(2147483647, Math.trunc(value)));
  };
  let base = cityInteger(context.rules.items.get("building_base")?.k5);
  for (const row of context.state.buildings) {
    if (num(row, "itemId") !== 427000) continue;
    const rule = context.rules.building(
      "427000",
      num(row, "level"),
      num(row, "star"),
      num(row, "progress"),
    );
    if (
      rule.unlockConditions !== undefined &&
      num(row, "level") === 1 &&
      num(row, "unlockFlag") === 0
    )
      continue;
    base += cityInteger(rule.effects?.reinforcementCapacity ?? 0);
  }
  base = cast(f(f(base) + f(f(context.effect(56)) + f(context.effect(171)))));
  base = cast(f(f(base) + f(context.generalEffect(56, 427000))));
  base = cast(f(f(base) + f(scoutExpeditionEffect(context, 911))));
  base = cast(f(f(base) + f(scoutExpeditionEffect(context, 2600))));
  let add = cast(context.effect(882));
  add = cast(f(f(add) + f(context.generalEffect(882, 427000))));
  add = cast(f(f(add) + f(scoutExpeditionEffect(context, 909))));
  const civilization = num(context.state.profile, "civilizationType");
  const ratio = f(
    f(
      f(f(100 + f(context.effect(8))) + f(context.effect(2071))) +
        f(civilization >= 1 && civilization <= 4 ? context.effect(2438 + civilization) : 0),
    ) / 100,
  );
  return cityInteger(cast(f(f(base) * ratio)) + add + 1);
}
