import type { createDatabases } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import type { WorldSearchQuery, WorldSearchStore } from "@opencok/contracts/world-search";
import type { Row } from "@opencok/contracts/rows";
import { DependencyError } from "@opencok/errors/dependency";
import { and, asc, eq, ilike, ne, sql } from "drizzle-orm";

type Databases = Pick<ReturnType<typeof createDatabases>, "getKingdom" | "kingdoms">;

type Db = ReturnType<Databases["getKingdom"]>["db"];

type Reader = Pick<Db, "select">;

function realm(value: number): boolean {
  return Number.isInteger(value) && value > 0 && value <= 2147483647;
}

function string(value: unknown, limit: number): value is string {
  return (
    typeof value === "string" &&
    value.length <= limit &&
    value.isWellFormed() &&
    !value.includes("\0")
  );
}

function authorized(profile: Row | undefined, owner: string, kingdomId: number, now: number) {
  return (
    profile?.uid === owner &&
    profile.serverId === kingdomId &&
    (profile.banFlag ?? 0) === 0 &&
    ((profile.banTime ?? 0n) as bigint) <= BigInt(now)
  );
}

async function read(db: Reader, query: WorldSearchQuery): Promise<Row[]> {
  const rows = await db
    .select({
      uid: userprofile.uid,
      name: userprofile.name,
      pic: userprofile.pic,
      picVer: userprofile.picVer,
      power: playerinfo.power,
      abbr: sql<string>`coalesce(${alliance.abbr}, '')`,
    })
    .from(userprofile)
    .leftJoin(playerinfo, eq(playerinfo.uid, userprofile.uid))
    .leftJoin(alliance, eq(alliance.uid, userprofile.allianceId))
    .where(
      and(
        ne(userprofile.banTime, 9223372036854775807n),
        ne(userprofile.banTime, 9223372036854775806n),
        ilike(userprofile.name, `%${query.name}%`),
      ),
    )
    .orderBy(asc(userprofile.uid))
    .limit(8)
    .offset(query.offset);

  if (rows.length > 8 || new Set(rows.map((row) => row.uid)).size !== rows.length)
    {throw new DependencyError("world search results");}

  return rows;
}

export function createWorldSearchStore(databases: Databases, kingdomId: number): WorldSearchStore {
  if (!realm(kingdomId) || !databases.kingdoms.has(kingdomId))
    {throw new Error("Invalid world search realm");}

  const options = { isolationLevel: "repeatable read", accessMode: "read only" } as const;

  return {
    async search(owner, input) {
      const query = Object.freeze({ ...input });

      if (
        !string(owner, 255) ||
        !owner ||
        !string(query.name, 32767) ||
        new TextEncoder().encode(query.name).length > 32767 ||
        !Number.isInteger(query.offset) ||
        query.offset < 0 ||
        query.offset > 2147483647 ||
        query.offset % 8 !== 0 ||
        !realm(query.kingdomId) ||
        !Number.isSafeInteger(query.now) ||
        query.now < 0
      )
        {throw new Error("Invalid world search query");}

      try {
        const snapshot = await databases.getKingdom(kingdomId).db.transaction(async (tx) => {
          const [profile] = await tx
            .select({
              uid: userprofile.uid,
              serverId: userprofile.serverId,
              banTime: userprofile.banTime,
              banFlag: userprofile.banFlag,
            })
            .from(userprofile)
            .where(eq(userprofile.uid, owner))
            .limit(1);
          const rows =
            authorized(profile, owner, kingdomId, query.now) && query.kingdomId === kingdomId
              ? await read(tx, query)
              : [];

          return { profile, kingdomId: query.kingdomId, rows };
        }, options);

        if (!authorized(snapshot.profile, owner, kingdomId, query.now)) {return snapshot;}

        if (query.kingdomId === kingdomId) {return snapshot;}

        if (!databases.kingdoms.has(query.kingdomId))
          {throw new DependencyError("world search realm");}

        const rows = await databases
          .getKingdom(query.kingdomId)
          .db.transaction((tx) => read(tx, query), options);

        return { ...snapshot, rows };
      } catch {
        throw new DependencyError("world search");
      }
    },
  };
}

export async function checkWorldSearchStore(db: Db): Promise<void> {
  await db
    .select({
      uid: userprofile.uid,
      name: userprofile.name,
      pic: userprofile.pic,
      picVer: userprofile.picVer,
      allianceId: userprofile.allianceId,
      serverId: userprofile.serverId,
      banTime: userprofile.banTime,
      banFlag: userprofile.banFlag,
    })
    .from(userprofile)
    .limit(0);
  await db.select({ uid: playerinfo.uid, power: playerinfo.power }).from(playerinfo).limit(0);
  await db.select({ uid: alliance.uid, abbr: alliance.abbr }).from(alliance).limit(0);
}
