import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { alliance_territory } from "@opencok/drizzle/schema/opencok_kingdom/alliance_territory";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { mailBlank } from "@opencok/rules/mail";
import { kingdom_battle_team } from "@opencok/drizzle/schema/opencok_kingdom/kingdom_battle_team";
import { alliance_battle_team } from "@opencok/drizzle/schema/opencok_kingdom/alliance_battle_team";
import { user_territory_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_territory_resource";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { t_worldboss } from "@opencok/drizzle/schema/opencok_kingdom/t_worldboss";
import { t_worldbossrank } from "@opencok/drizzle/schema/opencok_kingdom/t_worldbossrank";
import type { Database } from "./game.ts";
import type { Row } from "@opencok/contracts/rows";
import type {
  WorldSpecialDetailSnapshot,
  WorldTurretReader,
} from "@opencok/contracts/world-point-detail";
import { readWorldResourceOwner } from "./world-resource-owner.ts";

type Reader = Pick<Database["kingdom"]["db"], "select">;
const territoryTypes = [14, 18, 20, 21, 23, 46, 47];
const publicColumns = {
  uid: userprofile.uid,
  name: userprofile.name,
  pic: userprofile.pic,
  picVer: userprofile.picVer,
  picfraId: userprofile.picfraId,
  allianceId: userprofile.allianceId,
};
const marchColumns = {
  uuid: world_march.uuid,
  ownerUid: world_march.ownerUid,
  targetId: world_march.targetId,
  worldId: world_march.worldId,
  state: world_march.state,
  teamId: world_march.teamId,
  type: world_march.type,
  armyInfo: world_march.armyInfo,
};
function one<T>(rows: T[]): T | undefined {
  if (rows.length > 1) throw new Error("Ambiguous specialized world state");
  return rows[0];
}
function text(value: unknown): string {
  if (
    typeof value !== "string" ||
    value.length > 255 ||
    !value.isWellFormed() ||
    value.includes("\0")
  )
    throw new Error("Invalid specialized world identifier");
  return value;
}
async function banner(db: Reader, id: unknown): Promise<string> {
  if (id == null || id === "") return "UN";
  const row = one(
    await db
      .select({ uid: alliance.uid, bannerStyle: alliance.bannerStyle })
      .from(alliance)
      .where(eq(alliance.uid, text(id)))
      .limit(2),
  );
  return row ? text(row.bannerStyle) : "UN";
}
export async function readSpecialWorldDetail(
  db: Reader,
  point: Row,
  observer: Row,
  kingdomId: number,
  remote: boolean,
  turret?: WorldTurretReader,
): Promise<WorldSpecialDetailSnapshot | undefined> {
  const type = point.pointType as number;
  if (!territoryTypes.includes(type) && (remote || ![49, 50].includes(type))) return undefined;
  const state: WorldSpecialDetailSnapshot = { marches: [], resources: [], kills: [], ranks: [] };
  if ([49, 50].includes(type)) {
    if (!mailBlank(point.ownerId as string | null) || !mailBlank(point.ownerName as string | null))
      return state;
    if (typeof point.reserve !== "bigint") throw new Error("Missing boss selector");
    const selector = Number((point.reserve & 0xf00000n) >> 20n);
    state.boss = (
      await db
        .select()
        .from(t_worldboss)
        .where(eq(t_worldboss.type, selector))
        .orderBy(desc(t_worldboss.id))
        .limit(1)
    )[0];
    if (state.boss?.status === 2) {
      state.ranks = await db
        .select()
        .from(t_worldbossrank)
        .where(eq(t_worldbossrank.bosstid, state.boss.id as number))
        .orderBy(asc(t_worldbossrank.id))
        .limit(10001);
      if (state.ranks.length > 10000) throw new Error("Boss rank snapshot exceeds limit");
    }
    return state;
  }
  if (type === 46 && !remote) state.observerBanner = await banner(db, observer.allianceId);
  state.territory = one(
    await db
      .select()
      .from(alliance_territory)
      .where(
        and(
          eq(alliance_territory.pointId, point.id as number),
          eq(alliance_territory.atWorldId, point.worldId as number),
        ),
      )
      .limit(2),
  );
  const territory = state.territory;
  if (!territory) return state;
  if (
    territory.pointId !== point.id ||
    territory.atWorldId !== point.worldId ||
    territory.type !== type
  )
    throw new Error("Foreign territory state");
  if (type === 46) state.banner = await banner(db, territory.allianceId);
  const owner = point.ownerId;
  if (!mailBlank(owner as string | null)) {
    state.ownerProfile = one(
      await db
        .select(publicColumns)
        .from(userprofile)
        .where(eq(userprofile.uid, text(owner)))
        .limit(2),
    );
    const allianceId = state.ownerProfile?.allianceId ?? point.allianceId;
    if (allianceId != null && allianceId !== "")
      state.ownerAlliance = one(
        await db
          .select({ uid: alliance.uid, abbr: alliance.abbr })
          .from(alliance)
          .where(eq(alliance.uid, text(allianceId)))
          .limit(2),
      );
    if (point.ownerMarchUUid != null && point.ownerMarchUUid !== "")
      state.leader = one(
        await db
          .select(marchColumns)
          .from(world_march)
          .where(eq(world_march.uuid, text(point.ownerMarchUUid)))
          .limit(2),
      );
    const leader = state.leader;
    if (
      leader &&
      (leader.ownerUid !== owner ||
        leader.targetId !== point.id ||
        leader.worldId !== point.worldId)
    )
      throw new Error("Foreign territory leader");
    if (leader?.teamId && !mailBlank(point.allianceId as string | null)) {
      const teamTable = [15, 16].includes(leader.type as number)
        ? kingdom_battle_team
        : alliance_battle_team;
      state.team = one(
        await db
          .select({
            id: teamTable.id,
            targetId: teamTable.targetId,
            worldId: teamTable.worldId,
            leaderUid: teamTable.leaderUid,
          })
          .from(teamTable)
          .where(eq(teamTable.id, text(leader.teamId)))
          .limit(2),
      );
      if (
        state.team &&
        (state.team.targetId !== point.id ||
          state.team.worldId !== point.worldId ||
          state.team.leaderUid !== owner)
      )
        throw new Error("Foreign territory team");
    }
    state.marches = await db
      .select(marchColumns)
      .from(world_march)
      .where(
        and(
          eq(world_march.targetId, point.id as number),
          eq(world_march.worldId, point.worldId as number),
          eq(world_march.state, 1),
          state.team
            ? eq(world_march.teamId, text(state.team.id))
            : !mailBlank(point.allianceId as string | null)
              ? undefined
              : eq(world_march.ownerUid, text(owner)),
        ),
      )
      .orderBy(asc(world_march.uuid))
      .limit(4097);
    if (
      state.marches.length > 4096 ||
      state.marches.reduce(
        (n, row) => n + (Buffer.isBuffer(row.armyInfo) ? row.armyInfo.length : 0),
        0,
      ) >
        4 * 1024 * 1024
    )
      throw new Error("Territory army snapshot exceeds limit");
    if (
      [14, 20, 21, 46, 47].includes(type) &&
      state.marches.some((march) => march.ownerUid === owner)
    )
      state.ownerEffects = await readWorldResourceOwner(db, text(owner));
  }
  let resources: Row[] = [];
  let kills: ReadonlyMap<string, string> = new Map();
  if (type === 23) {
    resources = await db
      .select()
      .from(user_territory_resource)
      .where(eq(user_territory_resource.allianceId, text(territory.allianceId)))
      .orderBy(asc(user_territory_resource.uid))
      .limit(1001);
    if (resources.length > 1000) throw new Error("Territory warehouse exceeds limit");
  }
  if (type === 21 && territory.active === 1) {
    if (!turret) throw new Error("Missing turret archive reader");
    kills = await turret(kingdomId, text(territory.uid));
    if (
      kills.size > 1000 ||
      [...kills.values()].reduce((n, value) => n + Buffer.byteLength(value), 0) > 4 * 1024 * 1024
    )
      throw new Error("Turret archive exceeds limit");
  }
  const ids = [...new Set([...resources.map((row) => text(row.uid)), ...kills.keys()].map(text))];
  const profiles = ids.length
    ? await db.select(publicColumns).from(userprofile).where(inArray(userprofile.uid, ids))
    : [];
  const byId = new Map(profiles.map((row) => [row.uid, row]));
  state.resources = resources.flatMap((row) => {
    const profile = byId.get(row.uid as string);
    return profile ? [{ row, profile }] : [];
  });
  state.kills = [...kills].map(([uid, content]) => ({ uid, content, profile: byId.get(uid) }));
  return state;
}
export async function checkSpecialWorldDetail(db: Reader) {
  await db.select().from(alliance_territory).limit(0);
  await db.select().from(user_territory_resource).limit(0);
  await db.select().from(t_worldboss).limit(0);
  await db.select().from(t_worldbossrank).limit(0);
  await db.select(publicColumns).from(userprofile).limit(0);
  await db.select(marchColumns).from(world_march).limit(0);
  await db.select({ id: alliance_battle_team.id }).from(alliance_battle_team).limit(0);
  await db.select({ id: kingdom_battle_team.id }).from(kingdom_battle_team).limit(0);
}
