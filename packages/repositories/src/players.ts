import type { createDatabases } from "@opencok/drizzle";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_vip } from "@opencok/drizzle/schema/opencok_kingdom/user_vip";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { alliance_title } from "@opencok/drizzle/schema/opencok_kingdom/alliance_title";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { stat_reg } from "@opencok/drizzle/schema/opencok_kingdom/stat_reg";
import { and, asc, eq, inArray, ne } from "drizzle-orm";
import type { PlayerSummary } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import { DependencyError } from "@opencok/errors/dependency";

type Databases = ReturnType<typeof createDatabases>;
type KingdomDb = ReturnType<Databases["getKingdom"]>["db"];

export async function checkPlayerSummaryStore(db: KingdomDb) {
  for (const table of [
    user_vip,
    alliance,
    alliance_member,
    alliance_title,
    user_state,
    user_mixed_info,
    stat_reg,
  ])
    await db.select().from(table).limit(0);
}

export async function readPlayerSummaries(db: KingdomDb, uids: string[]): Promise<Row[]> {
  if (!uids.length) return [];
  if (uids.length > 50) throw new DependencyError("player batch");
  return db.transaction(
    async (tx) => {
      const rows = await tx
        .select({
          uid: userprofile.uid,
          name: userprofile.name,
          allianceId: userprofile.allianceId,
          pic: userprofile.pic,
          picVer: userprofile.picVer,
          picfraId: userprofile.picfraId,
          gmFlag: userprofile.gmFlag,
          crossFightSrcServerId: userprofile.crossFightSrcServerId,
          country: userprofile.country,
          profileServerId: userprofile.serverId,
          vipLevel: user_vip.level,
          vipEndTime: user_vip.vipEndTime,
          sLevel: user_vip.sLevel,
          abbr: alliance.abbr,
          rank: alliance_member.rank,
          showBanner: user_mixed_info.showBanner,
        })
        .from(userprofile)
        .leftJoin(user_vip, eq(user_vip.uid, userprofile.uid))
        .leftJoin(
          alliance,
          and(eq(alliance.uid, userprofile.allianceId), ne(userprofile.allianceId, "")),
        )
        .leftJoin(
          alliance_member,
          and(
            eq(alliance_member.uid, userprofile.uid),
            eq(alliance_member.allianceId, userprofile.allianceId),
            ne(userprofile.allianceId, ""),
          ),
        )
        .leftJoin(user_mixed_info, eq(user_mixed_info.uid, userprofile.uid))
        .where(inArray(userprofile.uid, uids));
      if (!rows.length) return [];
      const found = rows.map((row) => row.uid);
      const titles = await tx
        .select({ uid: alliance_title.uid, title: alliance_title.title })
        .from(alliance_title)
        .innerJoin(
          userprofile,
          and(
            eq(userprofile.uid, alliance_title.uid),
            eq(userprofile.allianceId, alliance_title.allianceId),
            ne(userprofile.allianceId, ""),
          ),
        )
        .where(inArray(alliance_title.uid, found))
        .orderBy(asc(alliance_title.title));
      const states = await tx
        .select({ uid: user_state.uid, stateId: user_state.stateId, endTime: user_state.endTime })
        .from(user_state)
        .where(and(inArray(user_state.uid, found), eq(user_state.type2, 103)))
        .orderBy(asc(user_state.stateId));
      const registrations = await tx
        .select({ uid: stat_reg.uid, country: stat_reg.country })
        .from(stat_reg)
        .where(inArray(stat_reg.uid, found))
        .orderBy(asc(stat_reg.type));
      return rows.map((row) => {
        const state = states.find((entry) => entry.uid === row.uid);
        return {
          ...row,
          officer: titles.find((entry) => entry.uid === row.uid)?.title ?? null,
          stateId: state?.stateId ?? 0,
          endTime: state?.endTime ?? 0n,
          registrationCountry: registrations.find((entry) => entry.uid === row.uid)?.country ?? "",
        };
      });
    },
    { isolationLevel: "repeatable read", accessMode: "read only" },
  );
}

export async function loadPlayerSummaries(
  databases: Pick<Databases, "getKingdom" | "global" | "kingdoms">,
  kingdomId: number,
  uids: string[],
  allServers: boolean,
): Promise<PlayerSummary[]> {
  if (!uids.length) return [];
  if (uids.length > 50) throw new DependencyError("player batch");
  const local = await readPlayerSummaries(databases.getKingdom(kingdomId).db, [...new Set(uids)]);
  const byUid = new Map(local.map((data) => [String(data.uid), data]));
  const result: PlayerSummary[] = uids.flatMap((uid) => {
    const data = byUid.get(uid);
    return data ? [{ data, kingdomId, remote: false }] : [];
  });
  if (!allServers) return result;
  const missing = uids
    .filter((uid) => !byUid.has(uid))
    .map((uid) => uid.replaceAll("@mod", ""))
    .filter((uid) => /^\d+$/.test(uid));
  if (!missing.length) return result;
  const accounts = await databases.global.db
    .select({ uid: account_new.gameUid, server: account_new.server })
    .from(account_new)
    .where(inArray(account_new.gameUid, [...new Set(missing)]));
  const groups = new Map<number, string[]>();
  for (const account of accounts) {
    const id = Number(account.server);
    if (!Number.isSafeInteger(id) || !databases.kingdoms.has(id))
      throw new DependencyError("player realm");
    const group = groups.get(id) ?? [];
    group.push(account.uid);
    groups.set(id, group);
  }
  const remote = new Map<string, PlayerSummary>();
  for (const [id, ids] of groups) {
    const rows = await readPlayerSummaries(databases.getKingdom(id).db, ids);
    for (const data of rows) {
      if (Number(data.profileServerId) !== id) throw new DependencyError("player realm");
      remote.set(String(data.uid), { data, kingdomId: id, remote: true });
    }
  }
  for (const uid of missing) {
    const summary = remote.get(uid);
    if (summary) result.push(summary);
  }
  return result;
}
