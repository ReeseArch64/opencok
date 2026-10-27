import { user_king_skill } from "@opencok/drizzle/schema/opencok_kingdom/user_king_skill";
import { kingdom_skill_log } from "@opencok/drizzle/schema/opencok_kingdom/kingdom_skill_log";
import { alliance_territory } from "@opencok/drizzle/schema/opencok_kingdom/alliance_territory";
import { alliance_skill } from "@opencok/drizzle/schema/opencok_kingdom/alliance_skill";
import { hero_office } from "@opencok/drizzle/schema/opencok_kingdom/hero_office";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { alliance_battle_team } from "@opencok/drizzle/schema/opencok_kingdom/alliance_battle_team";
import { kingdom_battle_team } from "@opencok/drizzle/schema/opencok_kingdom/kingdom_battle_team";
import { arena_battle_team } from "@opencok/drizzle/schema/opencok_kingdom/arena_battle_team";
import { createHash } from "node:crypto";
import type { Row } from "@opencok/contracts/rows";
import { and, asc, eq, ne, sql, inArray, gt } from "drizzle-orm";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_wall } from "@opencok/drizzle/schema/opencok_kingdom/user_wall";
import { user_science } from "@opencok/drizzle/schema/opencok_kingdom/user_science";
import { user_general } from "@opencok/drizzle/schema/opencok_kingdom/user_general";
import { user_pet_dragon } from "@opencok/drizzle/schema/opencok_kingdom/user_pet_dragon";
import { new_general } from "@opencok/drizzle/schema/opencok_kingdom/new_general";
import { building_production } from "@opencok/drizzle/schema/opencok_kingdom/building_production";
import { world_barbarion } from "@opencok/drizzle/schema/opencok_kingdom/world_barbarion";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { t_worldboss } from "@opencok/drizzle/schema/opencok_kingdom/t_worldboss";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { num, text } from "@opencok/contracts/rows";
import type {
  ScoutParticipant,
  ScoutReinforcement,
  WorldScoutTarget,
  WorldScoutMail,
} from "@opencok/contracts/world-scout-report";
import { readWorldResourceOwner } from "./world-resource-owner";
import type { MutationTransaction } from "./mutation";

const profileFields = {
  uid: userprofile.uid,
  serverId: userprofile.serverId,
  crossFightSrcServerId: userprofile.crossFightSrcServerId,
  name: userprofile.name,
  pic: userprofile.pic,
  picVer: userprofile.picVer,
  picfraId: userprofile.picfraId,
  civilizationType: userprofile.civilizationType,
  level: userprofile.level,
  allianceId: userprofile.allianceId,
  appVersion: userprofile.appVersion,
};

const validUid = (uid: unknown): uid is string =>
  typeof uid === "string" &&
  uid.length > 0 &&
  uid.length <= 40 &&
  uid.isWellFormed() &&
  !uid.includes("\0");

async function companionDragons(tx: MutationTransaction, uid: string) {
  const rows = await tx
    .select()
    .from(user_pet_dragon)
    .where(eq(user_pet_dragon.uid, uid))
    .orderBy(asc(user_pet_dragon.uuid))
    .limit(65);

  if (rows.length > 64 || rows.some((row) => row.uid !== uid))
    throw new Error("Scout dragon bound exceeded");

  return rows;
}

async function reinforcement(tx: MutationTransaction, march: Row, kingdom: number) {
  const uid = march.ownerUid;

  if (!validUid(uid) || num(march, "worldId") !== 0) throw new Error("Invalid scout reinforcement");

  const [profile] = await tx
      .select(profileFields)
      .from(userprofile)
      .where(eq(userprofile.uid, uid))
      .limit(1),
    [statistics] = await tx
      .select({ uid: playerinfo.uid, power: playerinfo.power })
      .from(playerinfo)
      .where(eq(playerinfo.uid, uid))
      .limit(1);

  if (
    !profile ||
    profile.serverId !== kingdom ||
    num(profile, "crossFightSrcServerId") > 0 ||
    !statistics
  )
    throw new Error("Unknown scout reinforcement owner");

  const [guild] = profile.allianceId
    ? await tx
        .select({ uid: alliance.uid, abbr: alliance.abbr })
        .from(alliance)
        .where(eq(alliance.uid, profile.allianceId))
        .limit(1)
    : [];

  return { march, profile, statistics, dragons: await companionDragons(tx, uid), alliance: guild };
}

async function participant(
  tx: MutationTransaction,
  uid: string,
  kingdom: number,
): Promise<ScoutParticipant | undefined> {
  if (!validUid(uid)) throw new Error("Invalid scout participant");

  const [profile] = await tx
    .select(profileFields)
    .from(userprofile)
    .where(eq(userprofile.uid, uid))
    .limit(1);

  if (!profile || profile.serverId !== kingdom || num(profile, "crossFightSrcServerId") > 0) return;

  const [world] = await tx.select().from(user_world).where(eq(user_world.uid, uid));
  const [resources] = await tx.select().from(user_resource).where(eq(user_resource.uid, uid));
  const effects = await readWorldResourceOwner(tx, uid);

  if (!world || world.worldId !== 0 || !resources || !effects || effects.newGenerals.moved) return;

  const buildings = await tx
    .select()
    .from(user_building)
    .where(eq(user_building.uid, uid))
    .orderBy(asc(user_building.uuid))
    .limit(257);
  const armies = await tx
    .select()
    .from(user_army)
    .where(eq(user_army.uid, uid))
    .orderBy(asc(user_army.armyId))
    .limit(1025);
  const forts = await tx
    .select()
    .from(user_wall)
    .where(eq(user_wall.uid, uid))
    .orderBy(asc(user_wall.armyId))
    .limit(1025);
  const sciences = await tx
    .select()
    .from(user_science)
    .where(eq(user_science.uid, uid))
    .orderBy(asc(user_science.itemId))
    .limit(4097);
  const generals = await tx
    .select()
    .from(user_general)
    .where(eq(user_general.uid, uid))
    .orderBy(asc(user_general.uuid))
    .limit(129);
  const dragons = await companionDragons(tx, uid);
  const marches = await tx
    .select()
    .from(world_march)
    .where(and(eq(world_march.worldId, 0), eq(world_march.ownerUid, uid)))
    .orderBy(asc(world_march.uuid))
    .limit(257);
  const offices = await tx
    .select()
    .from(hero_office)
    .where(eq(hero_office.uid, uid))
    .orderBy(asc(hero_office.id))
    .limit(257);
  const [mixed] = await tx
    .select({
      uid: user_mixed_info.uid,
      plunderResource: user_mixed_info.plunderResource,
      plunderTime: user_mixed_info.plunderTime,
    })
    .from(user_mixed_info)
    .where(eq(user_mixed_info.uid, uid))
    .limit(1);
  const newGenerals = await tx
    .select()
    .from(new_general)
    .where(eq(new_general.uid, uid))
    .orderBy(asc(new_general.id))
    .limit(1025);
  const production = await tx
    .select()
    .from(building_production)
    .where(eq(building_production.ownerId, uid))
    .orderBy(asc(building_production.buildingId))
    .limit(257);

  if (
    buildings.length > 256 ||
    armies.length > 1024 ||
    forts.length > 1024 ||
    sciences.length > 4096 ||
    generals.length > 128 ||
    dragons.length > 64 ||
    newGenerals.length > 1024 ||
    production.length > 256 ||
    marches.length > 256 ||
    offices.length > 256
  )
    throw new Error("Scout participant exceeds bound");

  const [guild] = profile.allianceId
    ? await tx.select().from(alliance).where(eq(alliance.uid, profile.allianceId))
    : [];
  const turrets = profile.allianceId
    ? await tx
        .select()
        .from(alliance_territory)
        .where(
          and(
            eq(alliance_territory.allianceId, profile.allianceId),
            eq(alliance_territory.type, 20),
            eq(alliance_territory.atWorldId, 0),
            gt(alliance_territory.pointId, 0),
          ),
        )
        .orderBy(asc(alliance_territory.uid))
        .limit(257)
    : [];

  if (turrets.length > 256) throw new Error("Scout territory bound exceeded");

  const territorySkills = turrets.length
    ? await tx
        .select()
        .from(alliance_skill)
        .where(
          inArray(
            alliance_skill.buildingUid,
            turrets.map((row) => row.uid),
          ),
        )
        .orderBy(asc(alliance_skill.uuid))
        .limit(1025)
    : [];

  if (territorySkills.length > 1024) throw new Error("Scout territory skill bound exceeded");

  const kingSkills = await tx
      .select({
        uid: user_king_skill.uid,
        skillId: user_king_skill.skillId,
        startTime: user_king_skill.startTime,
      })
      .from(user_king_skill)
      .where(inArray(user_king_skill.uid, ["KING_USER", "DONATE_RELEASE"]))
      .orderBy(
        sql`CASE WHEN ${user_king_skill.uid}='KING_USER' THEN 0 ELSE 1 END`,
        asc(user_king_skill.uuid),
      )
      .limit(1025),
    kingSkillLogs = await tx
      .select()
      .from(kingdom_skill_log)
      .where(eq(kingdom_skill_log.uid, uid))
      .orderBy(asc(kingdom_skill_log.skillId))
      .limit(1025);

  if (kingSkills.length > 1024 || kingSkillLogs.length > 1024)
    throw new Error("Scout kingdom repair bound exceeded");

  return {
    profile,
    world,
    resources,
    effects,
    buildings,
    armies,
    forts,
    sciences,
    generals,
    dragons,
    newGenerals,
    production,
    marches,
    offices,
    mixed,
    turrets,
    territorySkills,
    kingSkills,
    kingSkillLogs,
    alliance: guild,
  };
}

export async function readWorldScoutTargets(
  tx: MutationTransaction,
  ids: readonly number[],
  kingdom: number,
): Promise<ReadonlyMap<number, WorldScoutTarget>> {
  if (
    !Number.isInteger(kingdom) ||
    kingdom < 1 ||
    ids.length > 256 ||
    ids.some((id) => !Number.isInteger(id) || id < 1 || id > 16000000) ||
    new Set(ids).size !== ids.length
  )
    throw new Error("Scout target bound exceeded");

  const result = new Map<number, WorldScoutTarget>(),
    people = new Map<string, ScoutParticipant | undefined>();

  for (const id of ids) {
    const [point] = await tx
      .select()
      .from(worldpoint)
      .where(and(eq(worldpoint.worldId, 0), eq(worldpoint.id, id)));

    if (!point) continue;

    const uid = text(point, "ownerId");

    if (uid && !people.has(uid)) people.set(uid, await participant(tx, uid, kingdom));

    const [occupyingMarch] = text(point, "ownerMarchUUid")
      ? await tx
          .select()
          .from(world_march)
          .where(
            and(eq(world_march.uuid, text(point, "ownerMarchUUid")), eq(world_march.worldId, 0)),
          )
      : [];
    const defender = people.get(uid),
      targetCity = defender && num(defender.world, "pointId") === id;
    const reinforcementRows = targetCity
      ? await tx
          .select()
          .from(world_march)
          .where(
            and(
              eq(world_march.worldId, 0),
              eq(world_march.targetId, id),
              eq(world_march.type, 7),
              eq(world_march.state, 1),
            ),
          )
          .orderBy(asc(world_march.uuid))
          .limit(129)
      : [];
    const reinforcements = [];

    if (reinforcementRows.length > 128) throw new Error("Scout reinforcements exceed bound");

    for (const march of reinforcementRows)
      reinforcements.push(await reinforcement(tx, march, kingdom));

    const rallies = defender
      ? await tx
          .select()
          .from(world_march)
          .where(
            and(
              eq(world_march.worldId, 0),
              eq(world_march.ownerUid, uid),
              ne(world_march.state, 2),
              sql`coalesce(${world_march.teamId},'')<>''`,
            ),
          )
          .limit(129)
      : [];

    if (rallies.length > 128) throw new Error("Scout rally bound exceeded");

    const rallyDetails = [];

    for (const march of rallies) {
      const family = [15, 16].includes(num(march, "type"))
          ? 15
          : [18, 19].includes(num(march, "type"))
            ? 18
            : 4,
        table =
          family === 15
            ? kingdom_battle_team
            : family === 18
              ? arena_battle_team
              : alliance_battle_team;
      const teams = await tx
        .select()
        .from(table)
        .where(eq(table.id, text(march, "teamId")))
        .limit(2);

      if (teams.length > 1) throw new Error("Ambiguous scout team");

      const team = teams[0],
        members: ScoutReinforcement[] = [];

      if (team && (num(team, "worldId") !== 0 || team.leaderUid !== uid)) {
        rallyDetails.push({ march, members });
        continue;
      }

      if (team) {
        const rows = await tx
          .select()
          .from(world_march)
          .where(
            and(
              eq(world_march.worldId, 0),
              eq(world_march.teamId, text(march, "teamId")),
              eq(world_march.state, 1),
              eq(world_march.type, family + 1),
            ),
          )
          .orderBy(asc(world_march.uuid))
          .limit(129);

        if (rows.length > 128) throw new Error("Scout rally members exceed bound");

        for (const member of rows) members.push(await reinforcement(tx, member, kingdom));
      }

      rallyDetails.push({ march, team, members });
    }

    const [barbarian] =
      point.pointType === 44
        ? await tx.select().from(world_barbarion).where(eq(world_barbarion.pointId, id))
        : [];
    const cityBosses = targetCity
      ? await tx
          .select({
            x: worldpoint.x,
            y: worldpoint.y,
            status: t_worldboss.status,
            firerange: t_worldboss.firerange,
            firespeed: t_worldboss.firespeed,
          })
          .from(t_worldboss)
          .innerJoin(
            worldpoint,
            and(eq(worldpoint.worldId, 0), eq(worldpoint.id, t_worldboss.point)),
          )
          .where(eq(t_worldboss.status, 1))
          .limit(129)
      : [];

    if (cityBosses.length > 128) throw new Error("Scout city-boss bound exceeded");

    result.set(id, {
      point,
      participant: defender,
      occupyingMarch,
      reinforcements,
      rallies,
      rallyDetails,
      barbarian,
      cityBosses,
    });
  }

  return result;
}

export async function writeWorldScoutMails(
  tx: MutationTransaction,
  owner: string,
  values: readonly WorldScoutMail[],
) {
  if (values.length > 512) throw new Error("Scout mail bound exceeded");

  for (const value of values) {
    if (
      !validUid(owner) ||
      value.owner !== owner ||
      !validUid(value.recipient) ||
      value.march.length > 40 ||
      !value.march.length ||
      value.id !==
        createHash("sha256")
          .update(`scout:${value.march}:${value.recipient}:${value.type}`)
          .digest("hex")
          .slice(0, 32) +
          "00" ||
      value.id.length !== 34 ||
      !value.id.endsWith("00") ||
      value.contents.byteLength > 65535 ||
      value.createdAt < 0n ||
      value.createdAt > 9223372036854775807n ||
      value.title.length > 255 ||
      value.senderName.length > 100 ||
      ![2, 6, 8].includes(value.type) ||
      ![0, 1].includes(value.itemIdFlag ?? 0) ||
      (value.type === 8 && value.itemIdFlag !== undefined && value.itemIdFlag !== 0) ||
      (value.type === 2 &&
        (value.itemIdFlag !== 1 ||
          !/^(114005|105554)(\||$)/.test(Buffer.from(value.contents).toString("utf8")) ||
          value.sender !== "")) ||
      (value.type === 8 && value.recipient !== owner) ||
      ([2, 6].includes(value.type) &&
        value.recipient !== owner &&
        value.recipient !== value.targetOwner) ||
      (value.sender !== "" && value.sender !== owner)
    )
      throw new Error("Invalid owned scout mail");

    const [scout] = await tx
      .select()
      .from(world_march)
      .where(
        and(
          eq(world_march.uuid, value.march),
          eq(world_march.ownerUid, owner),
          eq(world_march.worldId, 0),
          eq(world_march.type, 1),
          eq(world_march.targetId, value.target),
        ),
      )
      .limit(1);
    const [actor] = await tx
      .select({ realm: userprofile.serverId })
      .from(userprofile)
      .where(eq(userprofile.uid, owner))
      .limit(1);

    if (
      !scout ||
      num(scout, "state") !== 0 ||
      !actor ||
      !actor.realm ||
      scout.marchStartTime > value.createdAt ||
      (scout.marchArrivalTime !== null && scout.marchArrivalTime > value.createdAt)
    )
      throw new Error("Missing owned scout mail march");

    const [target] = await tx
      .select()
      .from(worldpoint)
      .where(and(eq(worldpoint.worldId, 0), eq(worldpoint.id, value.target)));

    if (!target || text(target, "ownerId") !== value.targetOwner)
      throw new Error("Changed scout mail target");

    const [recipient] = await tx
      .select({ realm: userprofile.serverId })
      .from(userprofile)
      .where(eq(userprofile.uid, value.recipient));

    if (!recipient || recipient.realm !== actor.realm)
      throw new Error("Missing resident scout mail recipient");

    await tx.insert(mail).values({
      uid: value.id,
      toUser: value.recipient,
      fromUser: value.sender || null,
      fromName: value.senderName,
      title: value.title,
      contents: Buffer.from(value.contents),
      type: value.type,
      itemIdFlag: value.itemIdFlag ?? 0,
      rewardId: null,
      rewardStatus: 1,
      status: 0,
      createTime: value.createdAt,
      reply: 0,
    });
  }
}
