import { avatar_storage } from "@opencok/drizzle/schema/opencok_kingdom/avatar_storage";
import { text, num, long } from "@opencok/contracts/rows";
import { asc, eq } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { decode, int, str } from "@opencok/messages/sfs";
import { playerItemGiftRecipient } from "@opencok/rules/player-item-gifts";
import type { CosmeticTargetWrite } from "@opencok/contracts/city-cosmetics";
import type { MutationTransaction } from "./mutation";
import { writePlayerEffects } from "./player-effects";

export async function readCosmeticTarget(
  tx: MutationTransaction,
  request?: Uint8Array,
  actor?: string,
) {
  const params = request ? decode(Buffer.from(request)) : {};

  if (!actor && (int(params, "type", -1) !== 45 || !str(params, "uid", "").trim())) return;

  const uid = playerItemGiftRecipient(actor ?? str(params, "uid"));
  const [profile] = await tx
    .select({ uid: userprofile.uid, realm: userprofile.serverId })
    .from(userprofile)
    .where(eq(userprofile.uid, uid));

  if (!profile) throw new Error("Missing cosmetic interaction target");

  const [world] = await tx
    .select({ point: user_world.pointId, worldId: user_world.worldId })
    .from(user_world)
    .where(eq(user_world.uid, uid));
  const states = await tx
    .select()
    .from(user_state)
    .where(eq(user_state.uid, uid))
    .orderBy(asc(user_state.stateId))
    .limit(4097)
    .for("update");

  if (states.length > 4096 || (world && world.worldId !== 0))
    throw new Error("Invalid cosmetic target world or state bound");

  const avatars = await tx
    .select()
    .from(avatar_storage)
    .where(eq(avatar_storage.uid, uid))
    .limit(4097)
    .for("update");

  if (avatars.length > 4096) throw new Error("Cosmetic storage exceeds bound");

  return { ...profile, point: world?.point ?? 0, states, avatars };
}

export async function writeCosmeticTarget(
  tx: MutationTransaction,
  owner: string,
  target: string | undefined,
  write: CosmeticTargetWrite,
) {
  if (write.uid !== target || write.states.some((row) => row.uid !== target))
    throw new Error("Foreign cosmetic interaction write");

  if (write.uid !== owner)
    await writePlayerEffects(tx, write.uid, { states: write.states, deletedStates: write.deleted });

  if ((write.avatars?.length ?? 0) > 64) throw new Error("Cosmetic storage write exceeds bound");

  for (const row of write.avatars ?? []) {
    if (
      row.uid !== target ||
      !text(row, "avatarId") ||
      text(row, "avatarId").length > 255 ||
      long(row, "expirationTime") < -1n ||
      ![0, 1].includes(num(row, "effectiveSign"))
    )
      throw new Error("Invalid cosmetic ownership write");

    const value = {
      uid: write.uid,
      avatarId: text(row, "avatarId"),
      expirationTime: long(row, "expirationTime"),
      effectiveSign: num(row, "effectiveSign"),
    };
    await tx
      .insert(avatar_storage)
      .values(value)
      .onConflictDoUpdate({ target: [avatar_storage.uid, avatar_storage.avatarId], set: value });
  }
}
