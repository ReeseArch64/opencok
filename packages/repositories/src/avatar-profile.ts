import type {
  AvatarProfileDelivery,
  AvatarProfileProjector,
  AvatarProfilePublisher,
} from "@opencok/contracts/files";
import { avatar_completion } from "@opencok/drizzle/schema/opencok_kingdom/avatar_completion";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { and, eq } from "drizzle-orm";
import type { Database } from "./game.ts";

type Publication = (
  db: Database["kingdom"]["db"],
  kingdomId: number,
  owner: string,
  sequence: number,
  project: AvatarProfileProjector,
  publish: AvatarProfilePublisher,
  timeoutMs: number,
) => Promise<AvatarProfileDelivery>;

export const publishAvatarProfile: Publication = (...args) => publishAvatarEffect(2, ...args);

export const publishAvatarChat: Publication = (...args) => publishAvatarEffect(4, ...args);

function publishAvatarEffect(
  bit: 2 | 4,
  db: Database["kingdom"]["db"],
  kingdomId: number,
  owner: string,
  sequence: number,
  project: AvatarProfileProjector,
  publish: AvatarProfilePublisher,
  timeoutMs: number,
): Promise<AvatarProfileDelivery> {
  if (
    typeof owner !== "string" ||
    !/^[0-9]{1,20}$/.test(owner) ||
    !Number.isInteger(kingdomId) ||
    kingdomId < 1 ||
    kingdomId > 2147483647 ||
    !Number.isInteger(sequence) ||
    sequence < 1 ||
    sequence > 999999 ||
    !Number.isInteger(timeoutMs) ||
    timeoutMs < 100 ||
    timeoutMs > 30000
  )
    throw new Error("Invalid avatar profile query");

  return db.transaction(
    async (tx) => {
      const profile = (
        await tx
          .select({ uid: userprofile.uid, serverId: userprofile.serverId })
          .from(userprofile)
          .where(eq(userprofile.uid, owner))
          .limit(1)
          .for("update")
      )[0];

      if (!profile || profile.uid !== owner || profile.serverId !== kingdomId)
        return { profile, published: false };

      const key = and(
        eq(avatar_completion.ownerUid, owner),
        eq(avatar_completion.sequence, sequence),
      );
      const entry = (
        await tx.select().from(avatar_completion).where(key).limit(1).for("update")
      )[0];

      if (!entry) return { profile, published: false };

      if (
        entry.ownerUid !== owner ||
        entry.sequence !== sequence ||
        !Number.isInteger(entry.pendingEffects) ||
        entry.pendingEffects < 0 ||
        entry.pendingEffects > 7
      )
        throw new Error("Invalid avatar profile state");

      if (!(entry.pendingEffects & bit)) return { profile, published: false };

      const update = Object.freeze({ ...project(Object.freeze({ ...entry }), kingdomId) });

      if (
        update.owner !== owner ||
        update.kingdomId !== kingdomId ||
        update.sequence !== sequence ||
        update.picVer !== entry.picVer ||
        update.committedAt !== entry.committedAt ||
        (update.revision ?? 0n) !== (entry.revision ?? 0n) ||
        typeof update.committedAt !== "bigint" ||
        update.committedAt < 0n ||
        update.committedAt > BigInt(Number.MAX_SAFE_INTEGER) ||
        !Number.isInteger(update.picVer) ||
        update.picVer < 0 ||
        update.picVer > 2147483647 ||
        update.picVer % 1000000 !== sequence ||
        update.updatedAt !== String(update.committedAt / 1000n) ||
        [update.userName, update.platform].some(
          (value) =>
            typeof value !== "string" ||
            value.length > 255 ||
            value.includes("\0") ||
            !value.isWellFormed(),
        )
      )
        throw new Error("Invalid avatar profile projection");

      const controller = new AbortController();
      let timer: ReturnType<typeof setTimeout> | undefined;

      try {
        await Promise.race([
          Promise.resolve().then(() => publish(update, controller.signal)),
          new Promise<never>((_, reject) => {
            timer = setTimeout(() => {
              controller.abort();
              reject(new Error());
            }, timeoutMs);
          }),
        ]);
      } catch {
        throw new Error("Avatar profile publication unavailable");
      } finally {
        clearTimeout(timer);
        controller.abort();
      }

      const changed = await tx
        .update(avatar_completion)
        .set({ pendingEffects: entry.pendingEffects & ~bit })
        .where(and(key, eq(avatar_completion.pendingEffects, entry.pendingEffects)))
        .returning({ ownerUid: avatar_completion.ownerUid });

      if (changed.length !== 1 || changed[0]!.ownerUid !== owner)
        throw new Error("Avatar profile acknowledgment failed");

      return { profile, published: true };
    },
    { isolationLevel: "read committed", accessMode: "read write" },
  );
}
