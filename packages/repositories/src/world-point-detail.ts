import { readSpecialWorldDetail, checkSpecialWorldDetail } from "./world-special-detail.ts";
import { world_barbarion } from "@opencok/drizzle/schema/opencok_kingdom/world_barbarion";
import { readPlayerEffects } from "./power.ts";
import { readWorldResourceOwner, checkWorldResourceOwnerStore } from "./world-resource-owner.ts";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import type { createDatabases } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { stat_reg } from "@opencok/drizzle/schema/opencok_kingdom/stat_reg";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import type {
  WorldPointDetailStore,
  WorldPointDetailSnapshot,
  WorldExplorationSelector,
  WorldPointOwnerSnapshot,
} from "@opencok/contracts/world-point-detail";
import type { Row } from "@opencok/contracts/rows";
import { DependencyError } from "@opencok/errors/dependency";
import { and, asc, desc, eq } from "drizzle-orm";

type Databases = Pick<ReturnType<typeof createDatabases>, "getKingdom" | "kingdoms">;

type Db = ReturnType<Databases["getKingdom"]>["db"];

type Reader = Pick<Db, "select">;

const options = { isolationLevel: "repeatable read", accessMode: "read only" } as const;

const profileColumns = {
  uid: userprofile.uid,
  serverId: userprofile.serverId,
  banTime: userprofile.banTime,
  banFlag: userprofile.banFlag,
  allianceId: userprofile.allianceId,
  appVersion: userprofile.appVersion,
};

const pointColumns = {
  id: worldpoint.id,
  worldId: worldpoint.worldId,
  pointType: worldpoint.pointType,
  pointItem: worldpoint.pointItem,
  ownerId: worldpoint.ownerId,
  ownerName: worldpoint.ownerName,
  allianceId: worldpoint.allianceId,
  ownerMarchUUid: worldpoint.ownerMarchUUid,
  resInitValue: worldpoint.resInitValue,
  resCostValue: worldpoint.resCostValue,
  monsterCurrHP: worldpoint.monsterCurrHP,
  territoryAlliance: worldpoint.territoryAlliance,
  active: worldpoint.active,
  reserve: worldpoint.reserve,
};

const barbarianColumns = {
  pointId: world_barbarion.pointId,
  configId: world_barbarion.configId,
  lastArmyMapByteArray: world_barbarion.lastArmyMapByteArray,
  lastBeAttackedTime: world_barbarion.lastBeAttackedTime,
};

async function readBarbarian(db: Reader, point: Row) {
  const row = single(
    await db
      .select(barbarianColumns)
      .from(world_barbarion)
      .where(eq(world_barbarion.pointId, point.id as number))
      .limit(2),
  );

  if (
    row &&
    (row.pointId !== point.id ||
      !validText(row.configId, 255) ||
      (row.lastArmyMapByteArray !== null &&
        (!Buffer.isBuffer(row.lastArmyMapByteArray) || row.lastArmyMapByteArray.length > 65535)))
  )
    {throw new Error("Invalid barbarian state");}

  return { row };
}

const marchColumns = {
  uuid: world_march.uuid,
  ownerUid: world_march.ownerUid,
  targetId: world_march.targetId,
  worldId: world_march.worldId,
  state: world_march.state,
  marchStartTime: world_march.marchStartTime,
  arrivalTime: world_march.arrivalTime,
  exploreTime: world_march.exploreTime,
};

const resourceMarchColumns = {
  uuid: world_march.uuid,
  ownerUid: world_march.ownerUid,
  targetId: world_march.targetId,
  worldId: world_march.worldId,
  state: world_march.state,
  armyInfo: world_march.armyInfo,
  collectSpd: world_march.collectSpd,
  arrivalTime: world_march.arrivalTime,
  marchArrivalTime: world_march.marchArrivalTime,
  collectedBeforeSpd: world_march.collectedBeforeSpd,
  changeCollectSpdTime: world_march.changeCollectSpdTime,
  occupyResourceEndTime: world_march.occupyResourceEndTime,
  plunderRes: world_march.plunderRes,
};

async function readResourceMarch(db: Reader, point: Row) {
  const id = point.ownerMarchUUid;

  if (!validText(id, 40) || !id) {throw new Error("Invalid resource march pointer");}

  const march = single(
    await db
      .select(resourceMarchColumns)
      .from(world_march)
      .where(eq(world_march.uuid, id))
      .limit(2),
  );

  if (march) {
    if (
      march.uuid !== id ||
      march.ownerUid !== point.ownerId ||
      !integer(march.targetId) ||
      !integer(march.worldId) ||
      (march.state !== null && !integer(march.state)) ||
      (march.armyInfo !== null &&
        (!Buffer.isBuffer(march.armyInfo) || march.armyInfo.length > 65535)) ||
      (march.plunderRes !== null && !validText(march.plunderRes, 2048)) ||
      (march.collectSpd !== null &&
        (typeof march.collectSpd !== "number" ||
          (Number.isFinite(march.collectSpd) && !Number.isFinite(Math.fround(march.collectSpd)))))
    )
      {throw new Error("Invalid resource march state");}

    for (const field of [
      "arrivalTime",
      "marchArrivalTime",
      "collectedBeforeSpd",
      "changeCollectSpdTime",
      "occupyResourceEndTime",
    ] as const) {
      const value = march[field];

      if (value !== null && (typeof value !== "bigint" || BigInt.asIntN(64, value) !== value))
        {throw new Error("Invalid resource march time");}
    }
  }

  return {
    march: march
      ? { ...march, collectSpd: march.collectSpd === null ? null : Math.fround(march.collectSpd) }
      : undefined,
  };
}

async function readExploration(
  db: Reader,
  observer: string,
  point: Row,
  select: WorldExplorationSelector,
) {
  const rows = await db
    .select(marchColumns)
    .from(world_march)
    .where(eq(world_march.ownerUid, observer))
    .orderBy(asc(world_march.uuid))
    .limit(4097);

  if (
    rows.length > 4096 ||
    rows.some((row) => row.ownerUid !== observer || !validText(row.uuid, 40) || !row.uuid) ||
    new Set(rows.map((row) => row.uuid)).size !== rows.length
  )
    {throw new Error("Invalid exploration marches");}

  const id = select(
    Object.freeze({ ...point }),
    Object.freeze(rows.map((row) => Object.freeze({ ...row }))),
  );

  if (id === undefined) {return { march: undefined };}

  const selected = rows.find((row) => row.uuid === id);

  if (!selected || selected.targetId !== point.id || selected.state !== 1)
    {throw new Error("Invalid exploration selection");}

  const report = single(
    await db
      .select({
        uuid: world_march.uuid,
        ownerUid: world_march.ownerUid,
        exploreReport: world_march.exploreReport,
      })
      .from(world_march)
      .where(and(eq(world_march.uuid, id), eq(world_march.ownerUid, observer)))
      .limit(2),
  );

  if (
    !report ||
    report.uuid !== id ||
    report.ownerUid !== observer ||
    (report.exploreReport !== null &&
      (!Buffer.isBuffer(report.exploreReport) || report.exploreReport.length > 65535))
  )
    {throw new Error("Invalid exploration report");}

  return { march: { ...selected, exploreReport: report.exploreReport } };
}

async function readNeutralResource(db: Reader, point: Row) {
  const march = single(
    await db
      .select({
        uuid: world_march.uuid,
        targetId: world_march.targetId,
        worldId: world_march.worldId,
        state: world_march.state,
        occupyResourceEndTime: world_march.occupyResourceEndTime,
      })
      .from(world_march)
      .where(and(eq(world_march.targetId, point.id as number), eq(world_march.state, 1)))
      .orderBy(asc(world_march.uuid))
      .limit(1),
  );

  if (
    march &&
    (!validText(march.uuid, 40) ||
      !march.uuid ||
      march.targetId !== point.id ||
      march.state !== 1 ||
      !integer(march.worldId))
  )
    {throw new Error("Invalid neutral resource march");}

  return { march };
}

function integer(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= -2147483648 &&
    value <= 2147483647
  );
}

function validText(value: unknown, limit: number): value is string {
  return (
    typeof value === "string" &&
    value.length <= limit &&
    value.isWellFormed() &&
    !value.includes("\0")
  );
}

function blank(value: string | null | undefined): boolean {
  if (value == null) {return true;}

  return Array.from(value).every((character) => {
    const code = character.charCodeAt(0);

    return (
      (code >= 9 && code <= 13) ||
      (code >= 28 && code <= 32) ||
      code === 0x1680 ||
      code === 0x180e ||
      (code >= 0x2000 && code <= 0x2006) ||
      (code >= 0x2008 && code <= 0x200a) ||
      [0x2028, 0x2029, 0x205f, 0x3000].includes(code)
    );
  });
}

function authorized(
  profile: Row | undefined,
  observer: string,
  kingdomId: number,
  now: number,
): boolean {
  if (profile?.uid !== observer || profile.serverId !== kingdomId) {return false;}

  const flag = profile.banFlag ?? 0;
  const until = profile.banTime ?? 0n;

  return (
    flag === 0 &&
    typeof until === "bigint" &&
    BigInt.asIntN(64, until) === until &&
    until <= BigInt(now)
  );
}

function single<T>(rows: T[]): T | undefined {
  if (rows.length > 1) {throw new Error("Ambiguous world detail row");}

  return rows[0];
}

async function ownerRows(
  db: Reader,
  point: Row,
  remote: boolean,
  cityExtras: boolean,
): Promise<WorldPointOwnerSnapshot> {
  if (!remote && (point.pointType === 6 || point.pointType === 15)) {return {};}

  const uid = point.ownerId;

  if (uid == null || (typeof uid === "string" && blank(uid))) {return {};}

  if (!validText(uid, 255)) {throw new Error("Invalid point owner");}

  const result: WorldPointOwnerSnapshot = {};
  result.profile = single(
    await db
      .select({
        uid: userprofile.uid,
        pic: userprofile.pic,
        regTime: userprofile.regTime,
        ...(cityExtras && point.pointType === 1
          ? {
              serverId: userprofile.serverId,
              level: userprofile.level,
              allianceId: userprofile.allianceId,
              pf: userprofile.pf,
              civilizationType: userprofile.civilizationType,
              decomposeSuitEffect: userprofile.decomposesuiteffect,
            }
          : {}),
      })
      .from(userprofile)
      .where(eq(userprofile.uid, uid))
      .limit(2),
  );

  if (result.profile && result.profile.uid !== uid) {throw new Error("Foreign point owner");}

  const city = point.pointType === 1 || point.pointType === 2;

  if (result.profile) {
    result.registration = single(
      await db
        .select({ uid: stat_reg.uid, type: stat_reg.type, time: stat_reg.time })
        .from(stat_reg)
        .where(eq(stat_reg.uid, uid))
        .orderBy(desc(eq(stat_reg.type, 2)), desc(stat_reg.time), asc(stat_reg.type))
        .limit(1),
    );

    if (result.registration && result.registration.uid !== uid)
      {throw new Error("Foreign owner registration");}

    if (city) {
      result.statistics = single(
        await db
          .select({ uid: playerinfo.uid, power: playerinfo.power, armyKill: playerinfo.armyKill })
          .from(playerinfo)
          .where(eq(playerinfo.uid, uid))
          .limit(2),
      );

      if (result.statistics && result.statistics.uid !== uid)
        {throw new Error("Foreign owner statistics");}
    }
  }

  if (city || point.pointType === 3) {
    const allianceId = point.allianceId;

    if (allianceId != null && !(typeof allianceId === "string" && blank(allianceId))) {
      if (!validText(allianceId, 40)) {throw new Error("Invalid point alliance");}

      result.alliance = single(
        await db
          .select({ uid: alliance.uid, abbr: alliance.abbr })
          .from(alliance)
          .where(eq(alliance.uid, allianceId))
          .limit(2),
      );

      if (result.alliance && result.alliance.uid !== allianceId)
        {throw new Error("Foreign point alliance");}

      result.member = single(
        await db
          .select({ uid: alliance_member.uid, rank: alliance_member.rank })
          .from(alliance_member)
          .where(eq(alliance_member.uid, uid))
          .limit(2),
      );

      if (result.member && result.member.uid !== uid) {throw new Error("Foreign owner membership");}
    }
  }

  return result;
}

async function readPoint(
  db: Reader,
  id: number,
  worldId: number,
  remote: boolean,
  cityExtras = false,
  resourceEffects = false,
): Promise<
  Pick<WorldPointDetailSnapshot, "owner" | "resource" | "resourceGroup"> & {
    point?: Pick<typeof worldpoint.$inferSelect, keyof typeof pointColumns>;
  }
> {
  const point = single(
    await db
      .select(pointColumns)
      .from(worldpoint)
      .where(and(eq(worldpoint.id, id), eq(worldpoint.worldId, worldId)))
      .limit(2),
  );

  if (!point) {return {};}

  if (point.id !== id || point.worldId !== worldId || !integer(point.pointType))
    {throw new Error("Invalid world point");}

  const owner = await ownerRows(db, point, remote, cityExtras);
  const resource =
    (point.pointType === 3 || point.pointType === 37) &&
    !blank(point.ownerId) &&
    !blank(point.ownerMarchUUid)
      ? await readResourceMarch(db, point)
      : undefined;
  const resourceGroup =
    resourceEffects && point.pointType === 37 && (!blank(point.ownerId) || !blank(point.ownerName))
      ? await db
          .select({
            uuid: world_march.uuid,
            targetId: world_march.targetId,
            worldId: world_march.worldId,
            state: world_march.state,
            collectSpd: world_march.collectSpd,
            marchArrivalTime: world_march.marchArrivalTime,
            collectedBeforeSpd: world_march.collectedBeforeSpd,
            changeCollectSpdTime: world_march.changeCollectSpdTime,
            occupyResourceEndTime: world_march.occupyResourceEndTime,
          })
          .from(world_march)
          .where(
            and(
              eq(world_march.targetId, id),
              eq(world_march.worldId, worldId),
              eq(world_march.state, 1),
            ),
          )
          .orderBy(asc(world_march.uuid))
          .limit(4097)
      : undefined;

  if (
    resourceGroup &&
    (resourceGroup.length > 4096 ||
      new Set(resourceGroup.map((row) => row.uuid)).size !== resourceGroup.length)
  )
    {throw new Error("Invalid shared resource marches");}

  const resourceOwner =
    resourceEffects && resource?.march
      ? await readWorldResourceOwner(db, point.ownerId!)
      : undefined;

  return {
    point,
    owner,
    ...(resourceGroup ? { resourceGroup } : {}),
    ...(resource
      ? { resource: { ...resource, ...(resourceOwner ? { owner: resourceOwner } : {}) } }
      : {}),
  };
}

export function createWorldPointDetailStore(
  databases: Databases,
  kingdomId: number,
): WorldPointDetailStore {
  if (!integer(kingdomId) || kingdomId < 1 || !databases.kingdoms.has(kingdomId))
    {throw new Error("Invalid world detail realm");}

  return {
    async read(observer, input, selectExploration, turret) {
      const query = Object.freeze({ ...input });

      if (
        !validText(observer, 255) ||
        !observer ||
        !integer(query.point) ||
        !integer(query.kingdomId) ||
        query.kingdomId < 1 ||
        !Number.isSafeInteger(query.now) ||
        query.now < 0 ||
        (query.cityExtras !== undefined && typeof query.cityExtras !== "boolean") ||
        (query.resourceEffects !== undefined && typeof query.resourceEffects !== "boolean")
      )
        {throw new Error("Invalid world detail query");}

      const remote = query.kingdomId !== kingdomId;

      try {
        const local = await databases.getKingdom(kingdomId).db.transaction(async (tx) => {
          const profile = single(
            await tx
              .select(profileColumns)
              .from(userprofile)
              .where(eq(userprofile.uid, observer))
              .limit(2),
          );
          const snapshot = { profile, kingdomId: query.kingdomId, remote };

          if (!authorized(profile, observer, kingdomId, query.now) || query.point <= 0)
            {return snapshot;}

          const world = single(
            await tx
              .select({ uid: user_world.uid, worldId: user_world.worldId })
              .from(user_world)
              .where(eq(user_world.uid, observer))
              .limit(2),
          );

          if (!world || world.uid !== observer || !integer(world.worldId))
            {throw new Error("Missing observer world");}

          const result = { ...snapshot, world };

          if (remote) {return result;}

          const detail = await readPoint(
            tx,
            query.point,
            world.worldId,
            false,
            query.cityExtras,
            query.resourceEffects,
          );
          const special = detail.point
            ? await readSpecialWorldDetail(tx, detail.point, profile!, kingdomId, false, turret)
            : undefined;
          const exploration =
            detail.point?.pointType === 6 && selectExploration
              ? await readExploration(tx, observer, detail.point, selectExploration)
              : undefined;
          const neutralResource =
            detail.point?.pointType === 60 && !blank(detail.point.pointItem)
              ? await readNeutralResource(tx, detail.point)
              : undefined;
          const barbarian =
            detail.point?.pointType === 44 ? await readBarbarian(tx, detail.point) : undefined;
          const city =
            query.cityExtras && detail.point?.pointType === 1 && detail.owner?.profile
              ? await readCity(tx, observer, detail.owner.profile, kingdomId)
              : undefined;

          return {
            ...result,
            ...detail,
            ...(special ? { special } : {}),
            ...(exploration ? { exploration } : {}),
            ...(neutralResource ? { neutralResource } : {}),
            ...(city ? { city } : {}),
            ...(barbarian ? { barbarian } : {}),
          };
        }, options);

        if (
          !authorized(local.profile, observer, kingdomId, query.now) ||
          query.point <= 0 ||
          !remote
        )
          {return local;}

        if (!databases.kingdoms.has(query.kingdomId))
          {throw new Error("Unconfigured world detail realm");}

        const detail = await databases.getKingdom(query.kingdomId).db.transaction(async (tx) => {
          const result = await readPoint(tx, query.point, 0, true, false, query.resourceEffects);
          const special = result.point
            ? await readSpecialWorldDetail(
                tx,
                result.point,
                local.profile!,
                query.kingdomId,
                true,
                turret,
              )
            : undefined;

          return { ...result, ...(special ? { special } : {}) };
        }, options);

        return { ...local, ...detail };
      } catch {
        throw new DependencyError("world point detail");
      }
    },
  };
}

async function readCity(db: Reader, observer: string, profile: Row, kingdomId: number) {
  if (profile.serverId !== kingdomId) {throw new Error("Invalid city realm");}

  const observerStatistics = single(
    await db
      .select({ uid: playerinfo.uid, power: playerinfo.power })
      .from(playerinfo)
      .where(eq(playerinfo.uid, observer))
      .limit(2),
  );

  if (!observerStatistics || observerStatistics.uid !== observer)
    {throw new Error("Foreign observer statistics");}

  const mixed = single(
    await db
      .select({ uid: user_mixed_info.uid, lastBeDuelTime: user_mixed_info.lastBeDuelTime })
      .from(user_mixed_info)
      .where(eq(user_mixed_info.uid, profile.uid as string))
      .limit(2),
  );

  if (!mixed || mixed.uid !== profile.uid) {throw new Error("Foreign city duel state");}

  const effects = await readPlayerEffects(db, profile, true);

  return { observerStatistics, mixed, effects };
}

export async function checkWorldPointDetailStore(db: Db): Promise<void> {
  await checkWorldResourceOwnerStore(db);
  await checkSpecialWorldDetail(db);
  await db.select(barbarianColumns).from(world_barbarion).limit(0);
  await db
    .select({ uid: user_mixed_info.uid, lastBeDuelTime: user_mixed_info.lastBeDuelTime })
    .from(user_mixed_info)
    .limit(0);
  await db
    .select({
      ...marchColumns,
      ...resourceMarchColumns,
      exploreReport: world_march.exploreReport,
      occupyResourceEndTime: world_march.occupyResourceEndTime,
    })
    .from(world_march)
    .limit(0);
  await db
    .select({
      ...profileColumns,
      pic: userprofile.pic,
      regTime: userprofile.regTime,
      level: userprofile.level,
      pf: userprofile.pf,
      civilizationType: userprofile.civilizationType,
      decomposeSuitEffect: userprofile.decomposesuiteffect,
    })
    .from(userprofile)
    .limit(0);
  await db.select({ uid: user_world.uid, worldId: user_world.worldId }).from(user_world).limit(0);
  await db.select(pointColumns).from(worldpoint).limit(0);
  await db
    .select({ uid: playerinfo.uid, power: playerinfo.power, armyKill: playerinfo.armyKill })
    .from(playerinfo)
    .limit(0);
  await db
    .select({ uid: stat_reg.uid, type: stat_reg.type, time: stat_reg.time })
    .from(stat_reg)
    .limit(0);
  await db.select({ uid: alliance.uid, abbr: alliance.abbr }).from(alliance).limit(0);
  await db
    .select({ uid: alliance_member.uid, rank: alliance_member.rank })
    .from(alliance_member)
    .limit(0);
}
