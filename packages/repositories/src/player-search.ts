import type { createDatabases } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_vip } from "@opencok/drizzle/schema/opencok_kingdom/user_vip";
import { usermapping } from "@opencok/drizzle/schema/opencok_global/usermapping";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import type { PlayerSearchStore, PlayerSearchRemote } from "@opencok/contracts/player-search";
import type { Row } from "@opencok/contracts/rows";
import { DependencyError } from "@opencok/errors/dependency";
import { and, asc, eq, gte, ilike, inArray, ne } from "drizzle-orm";

type Databases = Pick<ReturnType<typeof createDatabases>, "getKingdom" | "kingdoms" | "global">;
const options = { isolationLevel: "repeatable read", accessMode: "read only" } as const;
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
function authorized(profile: Row | undefined, owner: string, kingdomId: number, now: number) {
  return (
    profile?.uid === owner &&
    profile.serverId === kingdomId &&
    (profile.banFlag ?? 0) === 0 &&
    ((profile.banTime ?? 0n) as bigint) <= BigInt(now)
  );
}
export function createPlayerSearchStore(
  databases: Databases,
  kingdomId: number,
): PlayerSearchStore {
  if (!integer(kingdomId) || kingdomId < 1 || !databases.kingdoms.has(kingdomId))
    throw new Error("Invalid player search realm");
  return {
    async search(owner, input, now, inspect) {
      const query = Object.freeze({ ...input });
      if (
        !validText(owner, 255) ||
        !owner ||
        !validText(query.key, 32767) ||
        new TextEncoder().encode(query.key).length > 32767 ||
        !integer(query.minimumLevel) ||
        !integer(query.page) ||
        !integer(query.maximum) ||
        query.maximum < 0 ||
        query.maximum > 32766 ||
        query.limit !== query.maximum + 1 ||
        query.kingdomId !== kingdomId ||
        typeof query.cross !== "boolean" ||
        !Number.isSafeInteger(now) ||
        now < 0
      )
        throw new Error("Invalid player search query");
      try {
        const local = await databases.getKingdom(kingdomId).db.transaction(async (tx) => {
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
          if (!authorized(profile, owner, kingdomId, now)) return { profile, rows: [] };
          const rows = await tx
            .select({
              uid: userprofile.uid,
              name: userprofile.name,
              lang: userprofile.lang,
              pic: userprofile.pic,
              picVer: userprofile.picVer,
              power: playerinfo.power,
              alliancename: alliance.alliancename,
              abbr: alliance.abbr,
              level: user_building.level,
            })
            .from(userprofile)
            .leftJoin(alliance, eq(alliance.uid, userprofile.allianceId))
            .innerJoin(user_building, eq(user_building.uid, userprofile.uid))
            .innerJoin(playerinfo, eq(playerinfo.uid, userprofile.uid))
            .where(
              and(
                ilike(userprofile.name, `${query.key}%`),
                eq(user_building.itemId, 400000),
                gte(user_building.level, query.minimumLevel),
              ),
            )
            .orderBy(asc(userprofile.uid), asc(user_building.uuid))
            .limit(query.limit);
          if (
            rows.length > query.limit ||
            rows.some(
              (row) =>
                !validText(row.uid, 255) ||
                !row.uid ||
                !integer(row.level) ||
                row.level < query.minimumLevel,
            )
          )
            throw new Error("Invalid local search rows");
          return { profile, rows };
        }, options);
        const result = {
          profile: local.profile,
          local: local.rows,
          remote: [] as PlayerSearchRemote[],
        };
        if (!authorized(local.profile, owner, kingdomId, now) || !query.cross) return result;
        const budget = { ...inspect(local.rows) };
        if (
          !integer(budget.limit) ||
          budget.limit < 0 ||
          budget.limit > 32767 ||
          budget.limit > query.limit * 2 ||
          budget.minimumLevel !== ((query.minimumLevel - 2) | 0)
        )
          throw new Error("Invalid player search budget");
        if (!budget.limit) return result;
        const accounts = await databases.global.db.transaction(async (tx) => {
          const matches = await tx
            .select({ uid: usermapping.gameUid })
            .from(usermapping)
            .where(
              and(
                eq(usermapping.mappingType, "name"),
                ilike(usermapping.mappingValue, `${query.key}%`),
              ),
            )
            .orderBy(asc(usermapping.gameUid))
            .limit(budget.limit);
          const ids = matches.map((row) => row.uid);
          if (
            ids.length > budget.limit ||
            ids.some((id) => !validText(id, 100) || !id) ||
            new Set(ids).size !== ids.length
          )
            throw new Error("Invalid player search mapping");
          if (!ids.length) return [];
          const rows = await tx
            .select({ uid: account_new.gameUid, server: account_new.server })
            .from(account_new)
            .where(
              and(
                inArray(account_new.gameUid, ids),
                ne(account_new.server, String(kingdomId)),
                gte(account_new.gameUserLevel, budget.minimumLevel),
              ),
            )
            .orderBy(asc(account_new.gameUid));
          const allowed = new Set(ids);
          if (
            rows.length > ids.length ||
            rows.some((row) => !allowed.has(row.uid)) ||
            new Set(rows.map((row) => row.uid)).size !== rows.length
          )
            throw new Error("Invalid player search directory");
          return rows;
        }, options);
        const groups = new Map<number, string[]>();
        for (const account of accounts) {
          if (!/^[1-9][0-9]*$/.test(account.server)) throw new Error("Invalid player search route");
          const realm = Number(account.server);
          if (!integer(realm) || realm === kingdomId || !databases.kingdoms.has(realm))
            throw new Error("Unconfigured player search route");
          const ids = groups.get(realm) ?? [];
          ids.push(account.uid);
          groups.set(realm, ids);
        }
        const found = new Map<string, PlayerSearchRemote>();
        for (const [realm, ids] of groups) {
          await databases.getKingdom(realm).db.transaction(async (tx) => {
            for (let offset = 0; offset < ids.length; offset += 500) {
              const batch = ids.slice(offset, offset + 500);
              const rows = await tx
                .select({
                  uid: userprofile.uid,
                  name: userprofile.name,
                  pic: userprofile.pic,
                  picVer: userprofile.picVer,
                  picfraId: userprofile.picfraId,
                  lang: userprofile.lang,
                  allianceId: userprofile.allianceId,
                  gmFlag: userprofile.gmFlag,
                  crossFightSrcServerId: userprofile.crossFightSrcServerId,
                  offLineTime: userprofile.offLineTime,
                  profileServerId: userprofile.serverId,
                  power: playerinfo.power,
                  abbr: alliance.abbr,
                  mainBuildingLevel: user_building.level,
                  vipScore: user_vip.score,
                  vipEndTime: user_vip.vipEndTime,
                  svipLevel: user_vip.sLevel,
                  rank: alliance_member.rank,
                })
                .from(userprofile)
                .leftJoin(playerinfo, eq(playerinfo.uid, userprofile.uid))
                .leftJoin(alliance, eq(alliance.uid, userprofile.allianceId))
                .leftJoin(
                  user_building,
                  and(eq(user_building.uid, userprofile.uid), eq(user_building.itemId, 400000)),
                )
                .leftJoin(user_vip, eq(user_vip.uid, userprofile.uid))
                .leftJoin(alliance_member, eq(alliance_member.uid, userprofile.uid))
                .where(inArray(userprofile.uid, batch))
                .orderBy(asc(userprofile.uid))
                .limit(batch.length + 1);
              const allowed = new Set(batch);
              if (rows.length > batch.length) throw new Error("Ambiguous player search profile");
              for (const data of rows) {
                if (!allowed.has(data.uid) || data.profileServerId !== realm || found.has(data.uid))
                  throw new Error("Invalid player search profile");
                found.set(data.uid, { key: data.uid, kingdomId: realm, data });
              }
            }
          }, options);
        }
        for (const account of accounts) {
          const entry = found.get(account.uid);
          if (entry) result.remote.push(entry);
        }
        for (const account of accounts)
          if (!found.has(account.uid))
            result.remote.push({ key: account.uid, kingdomId: Number(account.server), data: {} });
        return result;
      } catch {
        throw new DependencyError("player search");
      }
    },
  };
}

export async function checkPlayerSearchStore(
  databases: Databases,
  kingdomId: number,
  cross: boolean,
): Promise<void> {
  const db = databases.getKingdom(kingdomId).db;
  for (const table of [userprofile, playerinfo, alliance, user_building])
    await db.select().from(table).limit(0);
  if (cross) {
    await databases.global.db
      .select({
        uid: usermapping.gameUid,
        type: usermapping.mappingType,
        value: usermapping.mappingValue,
      })
      .from(usermapping)
      .limit(0);
    await databases.global.db
      .select({
        uid: account_new.gameUid,
        server: account_new.server,
        level: account_new.gameUserLevel,
      })
      .from(account_new)
      .limit(0);
  }
}
