import { worldBirthRules } from "./world-birth";
import { randomUUID } from "node:crypto";
import type { CharacterReservation, CharacterSeed } from "@opencok/contracts/provisioning";
import { starterVersion } from "@opencok/contracts/provisioning";
import type { Row } from "@opencok/contracts/rows";
import { MOBILE_CLIENT_VERSION } from "@opencok/constants/game";
import type { Rules } from "./game.ts";

const basics = new Set([
  "400000",
  "419000",
  "418000",
  "417000",
  "423000",
  "424000",
  "404000",
  "415000",
  "413000",
  "411000",
]);

const queueTypes = new Map([
  [423000, 1],
  [424000, 8],
  [411000, 3],
]);

const forever = 9223372036854775807n;

function integer(value: string | number | undefined): number {
  if (
    value === undefined ||
    !/^\d+$/.test(String(value)) ||
    !Number.isSafeInteger(Number(value)) ||
    Number(value) > 2147483647
  )
    throw new Error("Invalid initial character rule");

  return Number(value);
}

export function characterSeed(input: CharacterReservation, rules: Rules): CharacterSeed {
  if (input.preset !== starterVersion || input.kingdomId !== rules.kingdomId)
    throw new Error("Invalid character preset");

  if (!rules.profile.characters?.get("44000")?.name) throw new Error("Missing initial portrait");

  const uid = input.gameUid,
    now = BigInt(input.createdAt);
  const positions = [...rules.positions.values()].filter(
    (row) => row.default === "1" && basics.has(row.building!),
  );

  if (
    new Set(positions.map((row) => row.building)).size !== basics.size ||
    new Set(positions.map((row) => row.position)).size !== positions.length
  )
    throw new Error("Incomplete initial city catalog");

  const definitions = positions.map((row) => rules.building(row.building!, 1));
  const buildings = positions.map((row) => ({
    uuid: randomUUID(),
    uid,
    itemId: integer(row.building),
    pos: integer(row.position),
    level: 1,
    star: 0,
    progress: 0,
    opType: 0,
    reward: 0,
    updateTime: 0n,
    effectTime: 0n,
    refreshTime: now,
    unlockFlag: 0,
  }));
  const queues: Row[] = [1, 2, 3].map((qid) => ({
    uuid: randomUUID(),
    ownerId: uid,
    qid,
    type: 0,
    startTime: forever,
    endTime: qid === 1 ? forever : now,
    updateTime: forever,
    totalTime: 0n,
    para: 0,
    isHelped: 0,
  }));

  for (const type of new Set([
    19,
    ...buildings.map((row) => queueTypes.get(row.itemId)).filter((type) => type !== undefined),
  ]))
    queues.push({
      uuid: randomUUID(),
      ownerId: uid,
      qid: 1,
      type,
      startTime: forever,
      endTime: forever,
      updateTime: forever,
      totalTime: 0n,
      para: 0,
      isHelped: 0,
    });

  const role = rules.roles.get("100101");

  if (!role) throw new Error("Missing initial role rule");

  const shieldEnd = now + BigInt(integer(rules.power.statuses?.get("500009")?.time)) * 1000n;
  const buildingPower = definitions.reduce((sum, row) => sum + integer(row.power), 0);
  const power = buildingPower + integer(role.power);
  const tasks = (rules.reconnect.quests ?? [])
    .filter((row) => row.default !== undefined && row.type1 === "1")
    .map((row) => {
      let count = 0;
      const matching = buildings.filter((entry) => String(entry.itemId) === row.para1);

      if (row.type2 === "0") count = matching.length ? 1 : 0;
      else if (row.type2 === "8") count = matching.length;
      else if (row.type2 === "5") count = 1;
      else if (row.type2 === "3")
        count = definitions
          .filter((entry) => String(entry.effects?.productionResourceId) === row.para1)
          .reduce((sum, entry) => sum + (entry.effects?.productionPerHour ?? 0), 0);

      const target = integer(row.para2);

      return { uid, id: row.id!, type: 1, num: count, state: count >= target ? 1 : 0 };
    });
  const generals = (rules.items.get("hero")?.k1 ?? "")
    .split("|")
    .filter(Boolean)
    .map((id, index) => {
      const rule = rules.power.generals?.get(id);

      if (!rule) throw new Error("Missing initial general rule");

      return {
        uuid: randomUUID(),
        uid,
        generalId: id,
        level: 1,
        status: index < 3 ? 1 : 0,
        exp: 0,
        time: now,
        color: integer(rule.color),
        abilityIndex: 1,
        plusSkillPoint: 0,
      };
    });
  const vipScore = integer(rules.items.get("vip")?.k1);

  return {
    birth: worldBirthRules(rules),
    profile: {
      uid,
      name: input.name,
      level: 1,
      exp: 0,
      gold: 1000n,
      crystal: 0n,
      country: input.country,
      lang: input.language,
      deviceUuid: input.deviceUuid,
      deviceId: input.deviceUuid,
      pf: "Google",
      platform: "android",
      appVersion: MOBILE_CLIENT_VERSION,
      regTime: now,
      lastOnlineTime: now,
      allianceId: "",
      serverId: input.kingdomId,
      srcServerId: input.kingdomId,
      civilizationType: 0,
      openedPos: "",
      guideStep: "",
      pic: rules.profile.characters?.get("44000")?.name ?? "",
    },
    resource: {
      uid,
      wood: 100000n,
      food: 100000n,
      stone: 0n,
      iron: 0n,
      silver: 0,
      chip: 0,
      diamond: 0,
      dragon_food: 0,
      dragon_gold: 0,
      woodbind: 0n,
      stonebind: 0n,
      ironbind: 0n,
      foodbind: 0n,
      lastUpdateTime: now,
    },
    buildings,
    queues,
    tasks,
    generals,
    player: { uid, power: BigInt(power), buildingPower: BigInt(buildingPower), questPower: 0 },
    lord: {
      uid,
      userSign: "",
      firstJoinAllianceFlag: 1,
      levelUp: 1,
      lastPayTime: now,
      pveLevel: 0,
      dailyTaskFlushTime: now,
      newDailyTaskFlushTime: now,
      castleLevelUp: 1,
      castleLevelUpStatus: 1,
    },
    vip: {
      uid,
      score: vipScore,
      level: 0,
      loginDays: 1,
      lastLoginTime: now,
      vipEndTime: 0n,
      sPoint: 0,
      sLevel: 0,
    },
    shield: {
      uid,
      stateId: 500009,
      startTime: now,
      endTime: shieldEnd,
      type: 1,
      type2: 1,
      groupType: 100,
      ranEffId: -1,
      ranEffValue: 0,
      count: 1,
    },
    shieldEnd,
    cityDefense: integer(rules.building("419000", 1).clientParameters?.[1]?.value),
    stamina: integer(role.stamina),
    color: integer(rules.items.get("alliance_color")?.k1),
  };
}
