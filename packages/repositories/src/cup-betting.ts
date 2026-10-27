import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";
import { reconcileCupMatches } from "@opencok/rules/cup-betting";
import { and, asc, eq, sql } from "drizzle-orm";
import { soccer_match } from "@opencok/drizzle/schema/opencok_kingdom/soccer_match";
import { user_bet } from "@opencok/drizzle/schema/opencok_kingdom/user_bet";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import { num, text } from "@opencok/contracts/rows";
import type { CupBettingWrite } from "@opencok/contracts/cup-betting";
import type { MutationTransaction } from "./mutation";
import type { Database } from "./game";
export async function readCupBetting(tx: MutationTransaction, owner: string) {
  await tx.execute(sql`set local lock_timeout='1s'`);
  await tx.execute(sql`select pg_advisory_xact_lock(728218,1)`);
  const matches = await tx
    .select()
    .from(soccer_match)
    .orderBy(asc(soccer_match.startTime), asc(soccer_match.id))
    .limit(1025)
    .for("update");
  const bets = await tx
    .select()
    .from(user_bet)
    .where(eq(user_bet.uid, owner))
    .orderBy(asc(user_bet.uuid))
    .limit(4097)
    .for("update");
  if (matches.length > 1024 || bets.length > 4096) throw new Error("Cup aggregate exceeds bound");
  return { matches, bets };
}
export async function writeCupBetting(
  tx: MutationTransaction,
  owner: string,
  write: CupBettingWrite,
) {
  if ((write.matches?.length ?? 0) > 1024 || (write.bets?.length ?? 0) > 4096)
    throw new Error("Cup write exceeds bound");
  for (const row of write.matches ?? []) {
    const id = text(row, "id"),
      vs = text(row, "vs"),
      winner = text(row, "winner"),
      startBetTime = cityAmount(row.startBetTime),
      startTime = cityAmount(row.startTime),
      oddsA = num(row, "oddsA"),
      oddsB = num(row, "oddsB");
    if (
      !id ||
      id.length > 255 ||
      vs.length > 100 ||
      startBetTime >= startTime ||
      ![oddsA, oddsB].every((value) => !Number.isNaN(value) && value > 0) ||
      (winner && !vs.split("|").includes(winner))
    )
      throw new Error("Invalid cup match write");
    const value = {
      id,
      vs,
      idx: cityInteger(row.idx),
      winner,
      startBetTime,
      startTime,
      ended: cityInteger(row.ended, 0, 1),
      betNumA: cityAmount(row.betNumA),
      betNumB: cityAmount(row.betNumB),
      oddsA,
      oddsB,
    };
    await tx
      .insert(soccer_match)
      .values(value)
      .onConflictDoUpdate({ target: soccer_match.id, set: value });
  }
  for (const row of write.bets ?? []) {
    if (
      row.uid !== owner ||
      !text(row, "uuid") ||
      text(row, "uuid").length > 255 ||
      text(row, "matchId").length > 255 ||
      text(row, "vs").length > 100 ||
      text(row, "betSide").length > 50 ||
      text(row, "winner").length > 50 ||
      Number.isNaN(num(row, "odds")) ||
      num(row, "odds") <= 0
    )
      throw new Error("Invalid cup bet owner");
    const value = {
      uuid: text(row, "uuid"),
      uid: owner,
      matchId: text(row, "matchId"),
      vs: text(row, "vs"),
      resourceType: cityInteger(row.resourceType, 0, 3),
      betNum: cityInteger(row.betNum, 1),
      betSide: text(row, "betSide"),
      winner: text(row, "winner"),
      ended: cityInteger(row.ended, 0, 1),
      rewarded: cityInteger(row.rewarded, 0, 1),
      odds: num(row, "odds"),
    };
    const [saved] = await tx
      .select({ uid: user_bet.uid, odds: user_bet.odds })
      .from(user_bet)
      .where(eq(user_bet.uuid, value.uuid));
    if (saved && saved.uid !== owner) throw new Error("Foreign cup bet");
    if (value.odds === Infinity && saved?.odds !== Infinity)
      throw new Error("Invalid new cup odds");
    await tx
      .insert(user_bet)
      .values(value)
      .onConflictDoUpdate({ target: user_bet.uuid, set: value });
  }
}
export async function pendingCupSettlements(db: Database["kingdom"]["db"], after?: string) {
  const rows = await db
    .select({
      owner: user_bet.uid,
      ids: sql<string[]>`(array_agg(${user_bet.uuid} order by ${user_bet.uuid}))[1:64]`,
    })
    .from(user_bet)
    .innerJoin(soccer_match, eq(soccer_match.id, user_bet.matchId))
    .where(
      and(
        sql`${user_bet.uid} is not null and ${user_bet.uid} <> ''`,
        eq(user_bet.rewarded, 0),
        eq(soccer_match.ended, 1),
        after ? sql`${user_bet.uid}>${after}` : undefined,
      ),
    )
    .groupBy(user_bet.uid)
    .orderBy(asc(user_bet.uid))
    .limit(64);
  if (rows.some((row) => row.ids.length > 4096)) throw new Error("Cup settlement exceeds bound");
  return rows;
}

export function createCupScheduleStore(db: Database["kingdom"]["db"], authority: RealmAuthority) {
  return {
    async reconcile(definitions: readonly import("@opencok/contracts/rows").Row[], now: bigint) {
      await db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        const state = await readCupBetting(tx, "");
        await writeCupBetting(tx, "", {
          matches: reconcileCupMatches(state.matches, definitions, now),
        });
      });
    },
  };
}
