import { asc, eq } from "drizzle-orm";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { user_arena } from "@opencok/drizzle/schema/opencok_kingdom/user_arena";
import { arena_registration } from "@opencok/drizzle/schema/opencok_kingdom/arena_registration";
import { user_arena_army } from "@opencok/drizzle/schema/opencok_kingdom/user_arena_army";
import { num, long, text } from "@opencok/contracts/rows";
import type { ArenaWrite } from "@opencok/contracts/arena";
import type { MutationTransaction } from "./mutation";

export async function readArena(tx: MutationTransaction, owner: string) {
  const [registration] = await tx
    .select()
    .from(arena_registration)
    .where(eq(arena_registration.uid, owner))
    .for("update");
  const legacy = registration
    ? []
    : await tx.select().from(user_arena).where(eq(user_arena.uid, owner)).limit(2);
  const armies = await tx
    .select()
    .from(user_arena_army)
    .where(eq(user_arena_army.uid, owner))
    .orderBy(asc(user_arena_army.armyId))
    .limit(129);

  if (legacy.length > 1 || armies.length > 128)
    {throw new Error("Ambiguous or oversized arena owner");}

  const [world] = await tx.select().from(user_world).where(eq(user_world.uid, owner));

  return { registration, legacy: legacy[0], armies, world };
}

export async function writeArena(tx: MutationTransaction, owner: string, write: ArenaWrite) {
  if (write.registration) {
    const row = write.registration;

    if (row.uid !== owner) {throw new Error("Foreign arena registration");}

    const value = {
      uid: owner,
      rankScore: num(row, "rankScore"),
      state: num(row, "state"),
      fightServerId: num(row, "fightServerId"),
      worldId: num(row, "worldId"),
      version: num(row, "version"),
      time: long(row, "time"),
      totalWinCount: num(row, "totalWinCount"),
      totalLoseCount: num(row, "totalLoseCount"),
      serialWinCount: num(row, "serialWinCount"),
      applicationId: text(row, "applicationId"),
    };
    await tx
      .insert(arena_registration)
      .values(value)
      .onConflictDoUpdate({ target: arena_registration.uid, set: value });
  }

  for (const row of write.armies ?? []) {
    if (row.uid !== owner) {throw new Error("Foreign virtual arena army");}

    const value = { uid: owner, armyId: text(row, "armyId"), free: num(row, "free") };
    await tx
      .insert(user_arena_army)
      .values(value)
      .onConflictDoUpdate({
        target: [user_arena_army.uid, user_arena_army.armyId],
        set: { free: value.free },
      });
  }
}
