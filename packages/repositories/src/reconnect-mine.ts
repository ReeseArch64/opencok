import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_mine } from "@opencok/drizzle/schema/opencok_kingdom/user_mine";
import { and, eq } from "drizzle-orm";
import type { FriendshipMine } from "@opencok/contracts/reconnect";
import type { Row } from "@opencok/contracts/rows";
import { DependencyError } from "@opencok/errors/dependency";
import type { Database } from "./game.ts";

const mineFields = {
  itemId: user_mine.itemId,
  level: user_mine.level,
  exp: user_mine.exp,
  miner: user_mine.miner,
  mineTime: user_mine.mineTime,
  call: user_mine.call,
};

export async function loadFriendshipMine(
  global: Database["databases"]["global"]["db"],
  kingdom: Database["kingdom"]["db"],
  kingdomId: number,
  uid: string,
  initial: () => FriendshipMine,
): Promise<Row> {
  if (
    !uid.trim() ||
    uid.length > 40 ||
    !Number.isInteger(kingdomId) ||
    kingdomId < 1 ||
    kingdomId > 2147483647
  )
    throw new DependencyError("reconnect owner");
  const binding = await readFriendshipBinding(global, kingdomId, uid);
  return kingdom.transaction(
    async (tx) => {
      const profile = (
        await tx
          .select({ uid: userprofile.uid, serverId: userprofile.serverId })
          .from(userprofile)
          .where(eq(userprofile.uid, uid))
          .limit(1)
          .for("share")
      )[0];
      if (!profile || profile.uid !== uid || profile.serverId !== kingdomId)
        throw new DependencyError("reconnect owner");
      return readFriendshipMine(tx, uid, binding, initial);
    },
    { isolationLevel: "read committed", accessMode: "read write" },
  );
}

export async function readFriendshipBinding(
  global: Database["databases"]["global"]["db"],
  kingdomId: number,
  uid: string,
): Promise<string | null> {
  const accounts = await global
    .select({ binding: account_new.facebookAccount, server: account_new.server })
    .from(account_new)
    .where(eq(account_new.gameUid, uid))
    .limit(2);
  const account = accounts.length === 1 ? accounts[0] : undefined;
  if (account && (!/^[+-]?\d+$/.test(account.server) || Number(account.server) !== kingdomId))
    throw new DependencyError("reconnect realm");
  const binding = account?.binding;
  if (binding && binding.trim() && binding.length > 40)
    throw new DependencyError("reconnect binding");
  return binding ?? null;
}

export async function readFriendshipMine(
  tx: Pick<Database["kingdom"]["db"], "select" | "insert">,
  uid: string,
  binding: string | null,
  initial: () => FriendshipMine,
): Promise<Row> {
  if (!binding?.trim()) return { ...initial() };
  const read = () =>
    tx
      .select(mineFields)
      .from(user_mine)
      .where(and(eq(user_mine.uid, uid), eq(user_mine.fId, binding)))
      .limit(1)
      .for("share");
  const existing = (await read())[0];
  if (existing) return existing;
  const seed = initial();
  const inserted = (
    await tx
      .insert(user_mine)
      .values({
        uid,
        fId: binding,
        itemId: seed.itemId,
        level: seed.level,
        exp: seed.exp,
        miner: seed.miner,
        mineTime: seed.mineTime,
        call: seed.call,
        helpInfo: null,
      })
      .onConflictDoNothing({ target: [user_mine.uid, user_mine.fId] })
      .returning(mineFields)
  )[0];
  if (inserted) return inserted;
  const winner = (await read())[0];
  if (!winner) throw new DependencyError("reconnect mine");
  return winner;
}
