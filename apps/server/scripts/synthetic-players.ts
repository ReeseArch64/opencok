import { randomUUID } from "node:crypto";
import { and, eq, inArray, sql } from "drizzle-orm";
import { createDatabase } from "@opencok/drizzle";
import { requireEnv } from "@opencok/env/database";
import { loadRules } from "@opencok/resources/rules";
import { characterSeed } from "@opencok/rules/character-seed";
import { generalRecruit } from "@opencok/hero/rules/general-progression";
import { calculatePlayerPower } from "@opencok/rules/power";
import { powerContext } from "@opencok/services/power";
import { starterVersion } from "@opencok/contracts/provisioning";
import type { Rules } from "@opencok/rules/game";
import type { Row } from "@opencok/contracts/rows";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_science } from "@opencok/drizzle/schema/opencok_kingdom/user_science";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { user_general } from "@opencok/drizzle/schema/opencok_kingdom/user_general";
import { new_general } from "@opencok/drizzle/schema/opencok_kingdom/new_general";
import { user_lord } from "@opencok/drizzle/schema/opencok_kingdom/user_lord";
import { user_vip } from "@opencok/drizzle/schema/opencok_kingdom/user_vip";
import { user_task } from "@opencok/drizzle/schema/opencok_kingdom/user_task";
import { user_assets } from "@opencok/drizzle/schema/opencok_kingdom/user_assets";
import { user_reg } from "@opencok/drizzle/schema/opencok_kingdom/user_reg";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";

const firstNames = [
  "Ana",
  "Lucas",
  "Marina",
  "Gabriel",
  "Sofia",
  "Miguel",
  "Julia",
  "Rafael",
  "Clara",
  "Daniel",
  "Alice",
  "Mateus",
  "Camila",
  "Bruno",
  "Laura",
  "Pedro",
  "Bianca",
  "Felipe",
  "Livia",
  "Andre",
];
const lastNames = [
  "Silva",
  "Costa",
  "Oliveira",
  "Santos",
  "Rocha",
  "Lima",
  "Pereira",
  "Almeida",
  "Ribeiro",
  "Martins",
  "Araujo",
  "Teixeira",
  "Mendes",
  "Carvalho",
  "Barbosa",
];
const allianceNames = [
  "Aurora",
  "Lobos do Norte",
  "Guardioes",
  "Legiao Solar",
  "Corvos",
  "Dragao Azul",
  "Horizonte",
  "Sentinelas",
  "Tempestade",
  "Fenix",
  "Vanguarda",
  "Alvorada",
];
const troops = ["107001", "107002", "107100", "107103", "107200", "107202", "107300", "107301"];
const pad = (n: number) => String(n).padStart(3, "0");

export async function seedSyntheticPlayers(
  db: ReturnType<typeof createDatabase<"kingdom">>["db"],
  rules: Rules,
  count: number,
  now: number,
) {
  if (!Number.isInteger(count) || count < 1 || count > 300 || !Number.isSafeInteger(now) || now < 0)
    {throw new Error("Invalid synthetic seed parameters");}
  const realm = rules.kingdomId;
  if (realm !== 1) {throw new Error("Synthetic seed supports only the local first kingdom");}
  const uids = Array.from({ length: count }, (_, i) => `simseed-${realm}-${pad(i + 1)}`);
  const names = uids.map(
    (_, i) =>
      `${firstNames[i % firstNames.length]}${lastNames[Math.floor(i / firstNames.length) % lastNames.length]}${pad(i + 1)}`,
  );
  const groups = Math.ceil(count / 25);
  const ids = Array.from({ length: groups }, (_, i) => `simseed-${realm}-alliance-${pad(i + 1)}`);
  const allianceDisplayNames = ids.map((_, i) => `${allianceNames[i]} ${realm}`);
  const allianceTags = ids.map((_, i) => `S${realm}${pad(i + 1)}`);
  if (troops.some((id) => !rules.arms.has(id))) {throw new Error("Missing troop catalog");}
  const scienceBases = [...(rules.power.sciences?.values() ?? [])]
    .filter((rule) => rule.science_lv === "0" && /^\d+$/.test(rule.id ?? ""))
    .slice(0, 6);
  const itemIds = ["200001", "200002", "200021", "200031", "200390"].filter((id) =>
    rules.goods.has(id),
  );
  if (scienceBases.length < 6 || itemIds.length < 3) {throw new Error("Missing progression catalog");}
  const position = [...rules.positions.values()].find((row) => row.building === "433000");
  if (!position || !rules.power.newGeneralBases?.has("53500"))
    {throw new Error("Missing hero catalog");}
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`opencok-simseed-${realm}`}))`);
    if (
      (
        await tx
          .select({ uid: userprofile.uid })
          .from(userprofile)
          .where(inArray(userprofile.uid, uids))
      ).length ||
      (
        await tx
          .select({ uid: userprofile.uid })
          .from(userprofile)
          .where(inArray(userprofile.name, names))
      ).length ||
      (await tx.select({ uid: alliance.uid }).from(alliance).where(inArray(alliance.uid, ids)))
        .length ||
      (
        await tx
          .select({ uid: alliance.uid })
          .from(alliance)
          .where(inArray(alliance.alliancename, allianceDisplayNames))
      ).length ||
      (
        await tx
          .select({ uid: alliance.uid })
          .from(alliance)
          .where(inArray(alliance.abbr, allianceTags))
      ).length
    )
      {throw new Error("Synthetic identities or names already exist; no changes were made");}
    const points = await tx.execute<{ id: number }>(sql`
      SELECT p.id FROM opencok_kingdom.worldpoint p
      JOIN opencok_kingdom.worldpoint e ON e.id = p.id + 1 AND e."worldId" = 0 AND e.x = p.x + 1 AND e.y = p.y
      JOIN opencok_kingdom.worldpoint s ON s.id = p.id + 1201 AND s."worldId" = 0 AND s.x = p.x AND s.y = p.y + 1
      JOIN opencok_kingdom.worldpoint c ON c.id = p.id + 1202 AND c."worldId" = 0 AND c.x = p.x + 1 AND c.y = p.y + 1
      WHERE p."worldId" = 0 AND p.x % 2 = 0 AND p.y % 2 = 0 AND p.x < 1200 AND p.y < 1200
      AND p.id = 1 + p.x + p.y * 1201
      AND p."pointType" = 0 AND e."pointType" = 0 AND s."pointType" = 0 AND c."pointType" = 0
      AND p."gridType" = 0 AND e."gridType" = 0 AND s."gridType" = 0 AND c."gridType" = 0
      AND p."grid2Type" = 0 AND e."grid2Type" = 0 AND s."grid2Type" = 0 AND c."grid2Type" = 0
      AND coalesce(p."ownerId", '') = '' AND coalesce(e."ownerId", '') = '' AND coalesce(s."ownerId", '') = '' AND coalesce(c."ownerId", '') = ''
      AND coalesce(p."territoryAlliance", '') = '' AND coalesce(e."territoryAlliance", '') = '' AND coalesce(s."territoryAlliance", '') = '' AND coalesce(c."territoryAlliance", '') = ''
      AND coalesce(p.reserve, 0) = 0 AND coalesce(e.reserve, 0) = 0 AND coalesce(s.reserve, 0) = 0 AND coalesce(c.reserve, 0) = 0
      ORDER BY ((p.x * 37 + p.y * 71) % 1201), p.id LIMIT ${count} FOR UPDATE OF p,e,s,c SKIP LOCKED
    `);
    if (points.rows.length !== count) {throw new Error("Not enough safe empty city locations");}
    for (let group = 0; group < groups; group++) {
      const size = Math.min(25, count - group * 25);
      await tx.insert(alliance).values({
        uid: ids[group]!,
        alliancename: allianceDisplayNames[group],
        abbr: allianceTags[group],
        country: "BR",
        language: "pt",
        curMember: size,
        maxMember: 100,
        createtime: BigInt(now - 86400000 * 90),
        bannerStyle: "BR",
        recruit: 1,
        icon: "1",
      });
    }
    for (let i = 0; i < count; i++) {
      const uid = uids[i]!;
      const allianceId = ids[Math.floor(i / 25)]!;
      const createdAt = now - (30 + (i % 180)) * 86400000;
      const seed = characterSeed(
        {
          identityId: uid,
          gameUid: uid,
          name: names[i]!,
          createdAt,
          preset: starterVersion,
          kingdomId: realm,
          deviceUuid: `simulated-device-${realm}-${pad(i + 1)}`,
          country: "BR",
          language: "pt",
        },
        rules,
      );
      const level = 5 + ((i * 7) % 25);
      const castle = 4 + ((i * 11) % 22);
      const buildings: Row[] = seed.buildings.map((building) => {
        let target = Math.min(
          castle,
          Number(building.itemId) === 400000 ? castle : Math.max(1, castle - (i % 4)),
        );
        while (target > 1) {
          try {
            rules.building(String(building.itemId), target);
            break;
          } catch {
            target--;
          }
        }
        return { ...building, level: target, refreshTime: BigInt(now) };
      });
      if (buildings.some((building) => Number(building.pos) === Number(position.position)))
        {throw new Error("Hero building position occupied");}
      rules.building("433000", 1);
      buildings.push({
        uuid: randomUUID(),
        uid,
        itemId: 433000,
        pos: Number(position.position),
        level: 1,
        star: 0,
        progress: 0,
        opType: 0,
        reward: 0,
        updateTime: 0n,
        effectTime: 0n,
        refreshTime: BigInt(now),
        unlockFlag: 0,
      });
      const army = troops.map((armyId, troop) => ({
        uid,
        armyId,
        level: 0,
        free: 10000 + ((i * 7919 + troop * 1543) % 90000),
        pve: 0,
        march: 0,
        defence: 0,
        train: 0,
        foodCostTime: BigInt(now),
        finishTime: 0n,
      }));
      const sciences = scienceBases.map((rule, index) => {
        const itemId = rule.id!;
        let level = 1 + ((i + index) % 5);
        while (level > 0 && !rules.power.sciences?.has(String(Number(itemId) + level))) {level--;}
        return { uid, itemId, level, cd: 9223372036854775807n };
      });
      const items = itemIds.map((itemId, index) => ({
        uuid: randomUUID(),
        ownerId: uid,
        itemId,
        count: 10 + ((i * 13 + index * 17) % 250),
        value: 0,
        vanishTime: 0n,
      }));
      const statistics = {
        ...seed.player,
        battlesWin: 5 + i * 3,
        battlesLose: i % 39,
        attacksWin: i * 2,
        attacksLose: i % 17,
        defensesWin: i,
        detectNum: i * 4,
        armyKill: BigInt(i * 2137),
        armyDead: i * 315,
        armyCure: i * 244,
        cityDestroyed: i % 31,
        questPower: i * 23,
      };
      const profile = {
        ...seed.profile,
        level,
        allianceId,
        worldPoint: points.rows[i]!.id,
        lastOnlineTime: BigInt(now - (i % 48) * 3600000),
        gold: BigInt(10000 + i * 300),
      };
      const generals = seed.generals.map((general) => ({ ...general, level }));
      const power = calculatePlayerPower(
        {
          profile,
          statistics,
          generals,
          armies: army,
          walls: [],
          buildings,
          sciences,
          civilizationSciences: [],
          sagaSciences: [],
          foreignSciences: [],
          equipment: [],
          heroes: [],
          dragons: [],
          dragonSkills: [],
          knight: undefined,
          items: [],
          states: [],
          vip: undefined,
          allianceSciences: [],
          prestige: [],
          military: undefined,
          miracle: undefined,
          office: undefined,
          kingdomFights: [],
          territoryTrees: [],
          luckyDay: undefined,
          powerServer: undefined,
          throneRewards: [],
        },
        rules,
        powerContext(rules, undefined, { kingdomId: realm, version: "12.06.0", now }),
      );
      const point = points.rows[i]!.id;
      await tx.insert(userprofile).values(profile as typeof userprofile.$inferInsert);
      await tx.insert(user_resource).values({
        ...seed.resource,
        wood: BigInt(2000000 + i * 30000),
        food: BigInt(3000000 + i * 40000),
        iron: BigInt(1000000 + i * 8000),
        stone: BigInt(1500000 + i * 12000),
        silver: 50000 + i * 200,
        lastUpdateTime: BigInt(now),
      } as typeof user_resource.$inferInsert);
      await tx.insert(user_building).values(buildings as (typeof user_building.$inferInsert)[]);
      await tx.insert(queue).values(seed.queues as (typeof queue.$inferInsert)[]);
      await tx.insert(user_lord).values(seed.lord as typeof user_lord.$inferInsert);
      await tx.insert(user_vip).values(seed.vip as typeof user_vip.$inferInsert);
      if (seed.tasks.length)
        {await tx.insert(user_task).values(seed.tasks as (typeof user_task.$inferInsert)[]);}
      if (generals.length)
        {await tx.insert(user_general).values(generals as (typeof user_general.$inferInsert)[]);}
      await tx
        .insert(new_general)
        .values(
          generalRecruit(rules, 53500, uid, BigInt(createdAt)) as typeof new_general.$inferInsert,
        );
      await tx.insert(user_army).values(army);
      await tx.insert(user_science).values(sciences);
      await tx.insert(user_item).values(items);
      await tx.insert(playerinfo).values({
        ...statistics,
        uid,
        power: power.total,
        buildingPower: BigInt(power.buildingPower),
      } as typeof playerinfo.$inferInsert);
      await tx.insert(user_assets).values({ uid, lastUpdateTime: BigInt(now) });
      await tx.insert(user_reg).values({
        uid,
        appVersion: "12.06.0",
        deviceId: `simulated-device-${realm}-${pad(i + 1)}`,
      });
      await tx.insert(user_world).values({
        uid,
        pointId: point,
        worldId: 0,
        color: seed.color,
        lastCityDefTime: BigInt(now),
        attMonsterStamina: seed.stamina,
        lastStaminaTime: 9223372036854775807n,
      });
      await tx.insert(alliance_member).values({
        uid,
        allianceId,
        rank: i % 25 === 0 ? 5 : i % 25 < 4 ? 4 : 1,
        jointime: BigInt(createdAt),
        point: i * 25,
        accPoint: i * 200,
        progress: i * 10,
      });
      await tx
        .update(worldpoint)
        .set({
          pointType: 1,
          ownerId: uid,
          ownerName: names[i],
          allianceId,
          resLevel: 1,
          cityDefValue: seed.cityDefense,
          shieldTime: 0n,
        })
        .where(and(eq(worldpoint.worldId, 0), eq(worldpoint.id, point)));
      await tx
        .update(worldpoint)
        .set({ pointType: 8, ownerId: uid, pointItem: String(point) })
        .where(
          and(
            eq(worldpoint.worldId, 0),
            inArray(worldpoint.id, [point + 1, point + 1201, point + 1202]),
          ),
        );
    }
    return { kingdom: realm, players: count, alliances: groups, cities: points.rows.length };
  });
}

if (import.meta.main) {
  let database: ReturnType<typeof createDatabase<"kingdom">> | undefined;
  try {
    const [realmArg, countArg, apply, extra] = process.argv.slice(2);
    if (
      realmArg !== "1" ||
      !countArg ||
      !/^[1-9][0-9]*$/.test(countArg) ||
      apply !== "--apply" ||
      extra !== undefined
    )
      {throw new Error("Usage: synthetic-players.ts 1 <1-300> --apply");}
    const url = new URL(requireEnv("DATABASE_URL"));
    if (process.env.NODE_ENV !== "development" || url.hostname !== "postgres")
      {throw new Error("Synthetic seeding is limited to the local development stack");}
    url.pathname = "/opencok_kingdom_1";
    database = createDatabase("kingdom", { connectionString: url.toString(), max: 1 });
    const rules = await loadRules(undefined, 1);
    console.log(
      JSON.stringify(await seedSyntheticPlayers(database.db, rules, Number(countArg), Date.now())),
    );
  } catch {
    console.error(
      "Synthetic seed failed; verify that identities, names and map locations are available",
    );
    process.exitCode = 1;
  } finally {
    await database?.close();
  }
}
