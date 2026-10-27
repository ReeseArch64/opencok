import { withTreasureMarchTimes } from "./treasure-map";
import { and, asc, eq, inArray } from "drizzle-orm";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { alliance_territory } from "@opencok/drizzle/schema/opencok_kingdom/alliance_territory";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { alliance_battle_team } from "@opencok/drizzle/schema/opencok_kingdom/alliance_battle_team";
import { kingdom_battle_team } from "@opencok/drizzle/schema/opencok_kingdom/kingdom_battle_team";
import { arena_battle_team } from "@opencok/drizzle/schema/opencok_kingdom/arena_battle_team";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { kingdom_position } from "@opencok/drizzle/schema/opencok_kingdom/kingdom_position";
import { user_pet_dragon } from "@opencok/drizzle/schema/opencok_kingdom/user_pet_dragon";
import { new_general_skill } from "@opencok/drizzle/schema/opencok_kingdom/new_general_skill";
import { kingdom_building } from "@opencok/drizzle/schema/opencok_kingdom/kingdom_building";
import type { ReconnectMarchState } from "@opencok/contracts/reconnect";
import type { Row } from "@opencok/contracts/rows";
import type { Database } from "./game.ts";

const marchColumns = {
  uuid: world_march.uuid,
  ownerUid: world_march.ownerUid,
  ownerId: world_march.ownerId,
  ownerName: world_march.ownerName,
  ownerColor: world_march.ownerColor,
  allianceId: world_march.allianceId,
  teamId: world_march.teamId,
  armyInfo: world_march.armyInfo,
  type: world_march.type,
  targetId: world_march.targetId,
  targetType: world_march.targetType,
  targetUid: world_march.targetUid,
  marchStartTime: world_march.marchStartTime,
  marchTime: world_march.marchTime,
  marchArrivalTime: world_march.marchArrivalTime,
  returnStartTime: world_march.returnStartTime,
  arrivalTime: world_march.arrivalTime,
  exploreTime: world_march.exploreTime,
  collectSpd: world_march.collectSpd,
  changeCollectSpdTime: world_march.changeCollectSpdTime,
  collectedBeforeSpd: world_march.collectedBeforeSpd,
  plunderRes: world_march.plunderRes,
  retrieveRes: world_march.retrieveRes,
  state: world_march.state,
  extraParam: world_march.extraParam,
  blackLandMarchTime: world_march.blackLandMarchTime,
  monsterArmyCount: world_march.monsterArmyCount,
  monsterLevel: world_march.monsterLevel,
  territoryStartTime: world_march.territoryStartTime,
  territoryUpdateTime: world_march.territoryUpdateTime,
  territoryStat: world_march.territoryStat,
  slowDown: world_march.slowDown,
  worldId: world_march.worldId,
  isDuelSkill: world_march.isDuelSkill,
  occupyResourceEndTime: world_march.occupyResourceEndTime,
};

type Reader = Pick<Database["kingdom"]["db"], "select">;

const bounded = <T>(rows: T[]): T[] => {
  if (rows.length > 32767) throw new Error("Oversized reconnect march state");

  return rows;
};

const identities = (rows: readonly Row[], key: string) => [
  ...new Set(
    rows.flatMap((row) => (typeof row[key] === "string" && row[key] ? [row[key] as string] : [])),
  ),
];

export async function readReconnectMarches(db: Reader, uid: string): Promise<ReconnectMarchState> {
  if (!uid || uid.length > 40 || uid.includes("\0") || !uid.isWellFormed())
    throw new Error("Invalid reconnect march owner");

  const rows = await withTreasureMarchTimes(
    db,
    bounded(
      await db
        .select(marchColumns)
        .from(world_march)
        .where(eq(world_march.ownerUid, uid))
        .orderBy(asc(world_march.uuid))
        .limit(32768),
    ),
  );
  const result: ReconnectMarchState = {
    rows,
    teams: [],
    points: [],
    profiles: [],
    alliances: [],
    states: [],
    offices: [],
    dragons: [],
    skills: [],
    miracles: [],
    territories: [],
  };

  if (!rows.length) return result;

  if (rows.some((row) => row.ownerUid !== uid)) throw new Error("Foreign reconnect march");

  const teams: (Row & { family: number })[] = [];
  const seen = new Set(rows.map((row) => row.uuid));

  for (const [family, table] of [
    [4, alliance_battle_team],
    [15, kingdom_battle_team],
    [18, arena_battle_team],
  ] as const) {
    const ids = identities(
      rows.filter((row) => row.type === family || row.type === family + 1),
      "teamId",
    );

    if (!ids.length) continue;

    const selected = bounded(
      await db
        .select({
          id: table.id,
          worldId: table.worldId,
          leaderUid: table.leaderUid,
          createTime: table.createTime,
        })
        .from(table)
        .where(inArray(table.id, ids))
        .orderBy(asc(table.id))
        .limit(32768),
    );

    if (
      new Set(selected.map((row) => row.id)).size !== selected.length ||
      selected.some((row) => !ids.includes(row.id))
    )
      throw new Error("Invalid reconnect teams");

    teams.push(...selected.map((row) => ({ ...row, family })));
    const members = bounded(
      await db
        .select(marchColumns)
        .from(world_march)
        .where(
          and(
            inArray(
              world_march.teamId,
              selected.map((row) => row.id),
            ),
            inArray(world_march.type, [family, family + 1]),
          ),
        )
        .orderBy(asc(world_march.uuid))
        .limit(32768),
    );

    for (const row of members) {
      const team = selected.find((team) => team.id === row.teamId);

      if (!team || team.worldId !== row.worldId || ![family, family + 1].includes(row.type))
        throw new Error("Foreign reconnect team member");

      if (!seen.has(row.uuid)) {
        seen.add(row.uuid);
        rows.push(row);
      }
    }

    bounded(rows);
  }

  result.teams = teams;
  const owners = identities(rows, "ownerUid");
  const users = [...new Set([...owners, ...identities(rows, "targetUid")])];
  result.profiles = bounded(
    await db
      .select({
        uid: userprofile.uid,
        serverId: userprofile.serverId,
        crossFightSrcServerId: userprofile.crossFightSrcServerId,
        allianceId: userprofile.allianceId,
      })
      .from(userprofile)
      .where(inArray(userprofile.uid, users))
      .orderBy(asc(userprofile.uid))
      .limit(32768),
  );
  result.states = bounded(
    await db
      .select({ uid: user_state.uid, stateId: user_state.stateId, endTime: user_state.endTime })
      .from(user_state)
      .where(inArray(user_state.uid, users))
      .orderBy(asc(user_state.uid), asc(user_state.stateId))
      .limit(32768),
  );
  result.offices = bounded(
    await db
      .select({
        uid: kingdom_position.uid,
        positionId: kingdom_position.positionId,
        serverId: kingdom_position.serverId,
      })
      .from(kingdom_position)
      .where(inArray(kingdom_position.uid, owners))
      .orderBy(asc(kingdom_position.uid))
      .limit(32768),
  );
  result.dragons = bounded(
    await db
      .select({
        uid: user_pet_dragon.uid,
        uuid: user_pet_dragon.uuid,
        itemId: user_pet_dragon.itemId,
        lv: user_pet_dragon.lv,
        friendly: user_pet_dragon.friendly,
        nickName: user_pet_dragon.nickName,
      })
      .from(user_pet_dragon)
      .where(inArray(user_pet_dragon.uid, owners))
      .orderBy(asc(user_pet_dragon.uuid))
      .limit(32768),
  );
  result.skills = bounded(
    await db
      .select({
        uid: new_general_skill.uid,
        newGeneralId: new_general_skill.newGeneralId,
        skillId: new_general_skill.skillId,
        stat: new_general_skill.stat,
        actTime: new_general_skill.actTime,
      })
      .from(new_general_skill)
      .where(inArray(new_general_skill.uid, owners))
      .orderBy(asc(new_general_skill.uid), asc(new_general_skill.skillId))
      .limit(32768),
  );
  const alliances = identities(rows, "allianceId");

  if (alliances.length)
    result.alliances = bounded(
      await db
        .select({ uid: alliance.uid, abbr: alliance.abbr })
        .from(alliance)
        .where(inArray(alliance.uid, alliances))
        .orderBy(asc(alliance.uid))
        .limit(32768),
    );

  const worlds = [...new Set(rows.map((row) => row.worldId))];
  const points: Row[] = [];
  const miracles: Row[] = [];
  const territories: Row[] = [];

  for (const world of worlds) {
    const targets = [
      ...new Set(rows.filter((row) => row.worldId === world).map((row) => row.targetId)),
    ];
    points.push(
      ...bounded(
        await db
          .select({
            id: worldpoint.id,
            worldId: worldpoint.worldId,
            pointType: worldpoint.pointType,
            pointItem: worldpoint.pointItem,
            ownerId: worldpoint.ownerId,
            allianceId: worldpoint.allianceId,
            territoryAlliance: worldpoint.territoryAlliance,
            ownerMarchUUid: worldpoint.ownerMarchUUid,
            resInitValue: worldpoint.resInitValue,
            resCostValue: worldpoint.resCostValue,
            reserve: worldpoint.reserve,
            startOccupyTime: worldpoint.startOccupyTime,
          })
          .from(worldpoint)
          .where(and(eq(worldpoint.worldId, world), inArray(worldpoint.id, targets)))
          .orderBy(asc(worldpoint.id))
          .limit(32768),
      ),
    );
    const territoryTargets = rows
      .filter((row) => row.worldId === world && [14, 23, 46, 47].includes(row.targetType ?? 0))
      .map((row) => row.targetId);

    if (territoryTargets.length)
      territories.push(
        ...bounded(
          await db
            .select({
              atWorldId: alliance_territory.atWorldId,
              pointId: alliance_territory.pointId,
              allianceId: alliance_territory.allianceId,
            })
            .from(alliance_territory)
            .where(
              and(
                eq(alliance_territory.atWorldId, world),
                inArray(alliance_territory.pointId, territoryTargets),
              ),
            )
            .limit(32768),
        ),
      );

    const miracleTargets = rows
      .filter((row) => row.worldId === world && row.targetType === 54)
      .map((row) => row.targetId);

    if (miracleTargets.length)
      miracles.push(
        ...bounded(
          await db
            .select({
              worldid: kingdom_building.worldid,
              point: kingdom_building.point,
              starttime: kingdom_building.starttime,
              updatetime: kingdom_building.updatetime,
              state: kingdom_building.state,
            })
            .from(kingdom_building)
            .where(
              and(
                eq(kingdom_building.worldid, world),
                inArray(kingdom_building.point, miracleTargets),
              ),
            )
            .limit(32768),
        ),
      );
  }

  result.points = bounded(points);
  result.miracles = bounded(miracles);
  result.territories = bounded(territories);

  for (const [records, allowed, field] of [
    [result.profiles, users, "uid"],
    [result.states, users, "uid"],
    [result.offices, owners, "uid"],
    [result.dragons, owners, "uid"],
    [result.skills, owners, "uid"],
    [result.alliances, alliances, "uid"],
  ] as const)
    if (records.some((row) => !allowed.includes(String(row[field]))))
      throw new Error("Foreign reconnect march dependency");

  for (const [records, keys] of [
    [result.profiles, ["uid"]],
    [result.states, ["uid", "stateId"]],
    [result.offices, ["uid"]],
    [result.dragons, ["uid", "uuid"]],
    [result.skills, ["uid", "newGeneralId", "skillId"]],
    [result.alliances, ["uid"]],
    [result.points, ["worldId", "id"]],
    [result.miracles, ["worldid", "point"]],
    [result.territories, ["atWorldId", "pointId"]],
  ] as const) {
    const keysSeen = new Set(records.map((row) => keys.map((key) => String(row[key])).join("\0")));

    if (keysSeen.size !== records.length) throw new Error("Duplicate reconnect march dependency");
  }

  for (const [records, worldKey, pointKey] of [
    [result.points, "worldId", "id"],
    [result.miracles, "worldid", "point"],
    [result.territories, "atWorldId", "pointId"],
  ] as const)
    if (
      records.some(
        (point) =>
          !rows.some((row) => row.worldId === point[worldKey] && row.targetId === point[pointKey]),
      )
    )
      throw new Error("Foreign reconnect destination");

  return result;
}
